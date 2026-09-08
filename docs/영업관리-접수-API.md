# 영업관리 접수 API (반오토 CRM) — 홈페이지 폼이 어디로 가는가

홈페이지의 신청 폼 **네 개**는 모두 반오토(app.bahnauto.kr)의 **영업관리 › 문의 통합**으로 들어간다.
메일도, 스프레드시트도, 별도 DB도 없다. **저장소는 이 API 하나뿐이다.**

- 문서(정본): <https://app.bahnauto.kr/developers/leads-api>
- 화면: 반오토 › 통합 관리 › 영업관리
- 기준 시점: **2026-09-08**

---

## 1. 폼 → 유형 → 접수번호

| 홈페이지 폼 | `type` | 접수번호 | 반오토 탭 |
|---|---|---|---|
| `/trial` 무료체험 신청 | `trial` | `T-0001` | 무료체험신청 |
| `/brochure` 서비스 소개서 | `brochure` | `B-0001` | 소개서신청 |
| `/careers` 매장 매니저 지원 | `careers` | `M-0001` | 매니저지원 |
| `/contact` 도입 상담 | `contact` | `C-0001` | 도입상담 |

접수되면 반오토가 **유형별 주 담당자에게 자동 배정**하고 담당자 휴대폰으로 푸시를 보낸다.
그래서 **테스트 제출은 실제 사람에게 알림이 간다** — 확인이 필요하면 담당자에게 먼저 알린다.

## 2. 보내는 경로가 둘이다

| 경로 | 파일 | 언제 쓰이나 | 키 |
|---|---|---|---|
| 정적(운영) | `src/lib/form-submit.static.ts` | **bahnauto.kr (GitHub Pages)** — 서버가 없어 브라우저가 직접 부른다 | 공개키 `bao_pub_…` (`NEXT_PUBLIC_CRM_PUBLIC_KEY`) |
| 서버 액션 | `src/app/(site)/*/actions.ts` + `src/lib/crm-intake.ts` | 서버가 있는 배포(Cloudflare Workers 등)·로컬 | 비밀키 `bao_live_…` (`CRM_API_KEY`) |

> **⚠️ 폼 항목을 고칠 때는 두 경로를 함께 고친다.** 한쪽만 고치면 운영과 미리보기가 갈라진다.
> 화면은 언제나 `@/lib/form-submit` 을 거쳐 부른다 — 정적 빌드에서 그 지점이 교체된다.

### 빌드/런타임 변수

```
# 정적(GitHub Actions → Repository variables → deploy.yml)
NEXT_PUBLIC_CRM_INTAKE_URL=https://app.bahnauto.kr/api/v1/public/leads
NEXT_PUBLIC_CRM_PUBLIC_KEY=bao_pub_…        # 허용 출처(https://bahnauto.kr)로 막힌다

# 서버 배포
CRM_INTAKE_URL=https://app.bahnauto.kr/api/v1/public/leads
CRM_API_KEY=bao_live_…                       # 브라우저에 절대 내리지 않는다
```

둘 중 하나라도 없으면 **접수가 꺼진 상태**다. 무료체험·상담·지원은 「준비 중」 안내로 떨어지고
(받은 척하지 않는다), 소개서만 예외로 완료 화면까지 통과시킨다(§4).

## 3. 유형별로 보내는 항목

공통(모든 유형): `name` · `phone` · `email` · `agreePrivacy` · `agreeMarketing` · `channel` · `submittedAt` · `website`(허니팟, 항상 빈 값)

| `type` | 유형별 항목 |
|---|---|
| `trial` | `callTime`\* · `company`(필수) · `storeName` |
| `brochure` | `company`(필수) |
| `careers` | `callTime`\* · `homeSido`·`homeSigungu`·`workSido`·`workSigungu`(필수) · `timeSlots`(필수) · `transport`(필수) · `experience` · `message` |
| `contact` | `callTime`\* · `storeType`·`sido`·`sigungu`·`storeCount`(필수) · `visits` · `referrer` · `referrerDetail` · `message` |

\* `callTime`(연락 가능 시간대)은 **2026-09-08 부터 네 폼 중 세 곳(무료체험·지원·상담)에서 저장된다.**
소개서에는 이 칸이 없다 — 파일을 보내는 폼이라 통화 시간을 받을 이유가 없다(사용자 확정).

> **⚠️ 정의에 없는 키는 API 가 조용히 버린다(최소 수집).** 폼에 칸을 새로 넣으면
> **반오토 쪽 `LEAD_FIELDS` 에 먼저 그 필드를 추가**해야 값이 저장된다. 넣기 전에는
> 화면에만 보이고 아무 데도 남지 않는다. 실제로 `callTime` 이 그 상태였다(이슈 #36, 2026-09-08 해소).
>
> 선택지가 있는 항목(`callTime`·`referrer`·`storeType` …)은 **양쪽 목록이 글자까지 같아야 한다.**
> 다르면 400 `fieldErrors` 로 거절된다. 정본은 `src/lib/contact-schema.ts` 의 상수들이다.

## 4. 소개서만 다른 점

소개서가 약속하는 것은 「연락」이 아니라 **파일(PDF)** 이다. 그래서:

- 저장에 실패해도 **완료 화면으로 보낸다** — 접수 서버가 죽었다고 방문자가 소개서를 못 받는 것이 더 나쁘다
- 대신 **입력값 검증 실패는 그대로 막는다**
- 파일은 `public/brochure/` 의 공개 정적 파일이고 완료 화면에서 즉시 내려받는다

## 5. 응답과 오류

| 상태 | 뜻 | 화면 |
|---|---|---|
| 201 | 접수됨 | 완료 화면 |
| 200 `duplicate` | 10분 안에 같은 번호·같은 유형 | 완료 화면(같게 취급) |
| 400 `fieldErrors` | 검증 실패 — **필드 이름만** 온다 | 해당 칸에 오류 표시 |
| 401 / 403 | 키 없음·틀림·폐기 · 출처 불일치 | 「문제가 생겼습니다」 |
| 429 | 비밀키 분당 30회 · 공개키 IP 당 분당 5회 | 「요청이 너무 잦습니다」 |

**개인정보를 로그·에러에 남기지 않는다**(`../CLAUDE.md` §1.1 S3). 실패해도 값은 어디에도 기록하지 않는다.

## 6. 확인하는 법

```bash
# 1. 배포본이 그 칸을 담고 있나
curl -s https://bahnauto.kr/trial/ | grep -c "연락 가능 시간대"

# 2. 실제로 저장되나 — 폼을 제출한 뒤 반오토 › 영업관리에서 접수번호를 찾는다
#    ⚠️ 담당자에게 푸시가 간다. 테스트 건은 확인 후 지운다(관리자만 삭제 가능)
```

## 7. 남은 일 (법무)

**개인정보처리방침 제2조의 수집 항목에 아직 없는 것: 이메일 · 연락 가능 시간대 · 유입 경로** (X-02).
네 폼이 모두 방침보다 넓게 받고 있다. 방침을 노션에서 개정할 때 **네 폼의 동의 블록 「수집 항목」
표기와 함께** 손본다 — 받는 것과 고지하는 것이 어긋나면 그 자체가 문제다.

관련 파일: `src/lib/trial-schema.ts` · `brochure-schema.ts` · `careers-schema.ts` · `contact-schema.ts` 의 머리 주석,
각 폼의 동의 블록(`TrialForm.tsx` 등).
