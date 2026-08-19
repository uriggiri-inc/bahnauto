# 반오토 BAHNAUTO — Design System

반오토(BAHNAUTO)는 **우리끼리(주)**가 운영하는 **무인매장 위탁 관리 서비스**다. 결제·입장은 자동화됐지만 남아 있는 나머지 절반(청소·재고·응대·점검·행정)을 전담 매니저가 표준 체크리스트로 수행하고, **모든 수행 결과를 사진과 기록으로 증명**한다.

> 브랜드 프라미스 — **"자동화되지 않은 나머지 절반, 그 절반을 반오토가 맡습니다."**

## 제품(Surfaces)

| 제품 | 설명 | 이 저장소의 UI 킷 |
| --- | --- | --- |
| **공식 홈페이지** (구축 예정) | 점주 도입 상담(1순위 전환) + 매장매니저 지원(2순위 전환) 을 위한 멀티페이지 브랜드 사이트. Next.js 15 / Tailwind + CSS 변수 토큰 / Vercel | `ui_kits/website/` |
| **매장관리 앱** (운영 중) | 매장매니저용 모바일 앱. 대시보드 · 체크리스트(상시근무 + 주차별, 총 319개 항목) · 출퇴근(단말기 화면 촬영 + 시각 자동 인식) · 재고관리(유통기한 D-day) · 발주요청(작성→검토→수령→완료) · 게시판 · 채널톡 | `ui_kits/manager_app/` |

> ⚠️ 앱은 **계약 체결 후에만** 사용 가능하다. 웹에서는 앱을 "전환 수단"이 아니라 **"신뢰의 증거"**로 노출한다. 다운로드/로그인 진입점에는 항상 **"계약 점주·매니저 전용"** 라벨을 함께 붙인다.

## 출처 (Sources)

이 디자인 시스템은 아래 자료만을 근거로 만들었다. 코드베이스나 Figma 파일은 제공되지 않았다.

- `uploads/bahnauto_design assets.pdf` — 공식 BI 가이드 (로고 3종 + 클리어스페이스·최소사이즈 + 컬러 2종)
- `uploads/bahnauto_splash/` — `logo_horizontal.svg` / `_dark`, `logo_slogan.svg` / `_dark`, `symbol.svg`, `icon.png`, `splash.png`, `splash_slogan.png`, `Android_feature graphic.png`, `Android_foreground.png`
- `uploads/Bahnauto_*_Logo_(RGB|CMYK)/` — 워드마크/슬로건/심볼/앱아이콘 개별 SVG 패키지
- 반오토 공식 홈페이지 구축 PRD v1.0 (채팅으로 전달됨) — IA, 카피, 컴포넌트 인벤토리, 토큰 스펙의 원본
- 매장매니저용 앱 사용 매뉴얼 4종에서 확인된 기능 명세 (PRD 부록 A)

**제공되지 않은 것**: 앱 실제 스크린샷 파일, 실적 수치, 요금표, 사업자 정보, 도입 사례. UI 킷의 해당 자리는 실제 값 대신 **구조만** 재현했고 자리표시자임을 명시했다.

---

## CONTENT FUNDAMENTALS — 카피는 이렇게 쓴다

**보이스: 실무적이고 담백한 동료.** 과장 없이 사실을 제시한다. 판매원이 아니라 매장을 같이 운영해본 사람의 말투.

### 원칙

| 원칙 | 이렇게 | 이러지 않는다 |
| --- | --- | --- |
| 숫자로 말한다 | "상시근무 10개 항목을 매일 수행합니다" | "꼼꼼하게 관리합니다" |
| 형용사보다 명사 | "항목별 사진 기록" | "완벽하고 철저한 관리" |
| 점주의 하루로 말한다 | "퇴근하고 다시 매장에 들르지 않으셔도 됩니다" | "고객 만족을 실현합니다" |
| 존대는 하되 굽히지 않는다 | "매일 리포트로 확인하실 수 있습니다" | "저희가 최선을 다해 모시겠습니다" |
| 증명 못 할 말은 쓰지 않는다 | 실측 수치만 | "업계 1위", "최고의" |

### 호칭과 인칭
- 방문자는 **"사장님"** 또는 존대형 어미로 부른다. "고객님"은 쓰지 않는다(점주는 고객이자 파트너).
- 자사는 **"반오토"**. "저희 회사", "당사"는 쓰지 않는다. 운영사를 밝힐 때만 "우리끼리(주)".
- 매니저는 **"매장매니저"** 또는 **"전담 매니저"**. "알바", "직원"은 쓰지 않는다.

### 금지어
최고의 / 완벽한 / 혁신적인 / 1등 / 국내 유일 / 업계 최초 / 100%(근거 없는 경우) / AI 기반(실제 미탑재 시).
표시광고법상 부당표시 리스크가 있는 최상급 표현은 객관적 근거 없이는 금지.

### 문장 형태
- 헤드라인은 **한 문장, 마침표 없이** 끝내거나 서술형으로 끝낸다. 예: `무인매장은 절반만 자동입니다` / `"관리했습니다"라는 말 대신, 기록을 보여드립니다`
- 대조 구문을 자주 쓴다: **"A 대신 B"**, **"A는 자동이지만 B는 남습니다"**, **"사람이 바뀌어도 기준은 바뀌지 않습니다"**. 브랜드 서사(半-auto = 나머지 절반)가 그대로 문장 구조가 된다.
- 섹션 레이블은 짧은 명사구, 13.5px / 600 / letter-spacing 0.06em. 예: `반오토 운영 시스템`, `도입 절차`, `요금 안내`
- 본문 서브카피는 2문장 이내. 첫 문장은 사실, 둘째 문장은 그래서 점주가 얻는 것.
- 숫자는 항상 3자리 구분(`Intl.NumberFormat('ko-KR')`), 금액 옆에는 예외 없이 **`VAT 별도`**.

### 대소문자·표기
- 브랜드 표기는 한글 **반오토**가 1순위, 로마자는 **BAHNAUTO**(전부 대문자). "Bahnauto", "BahnAuto"는 쓰지 않는다.
- 영문 UI 라벨은 최소화. 한국어 단일 언어 서비스다.
- **이모지는 쓰지 않는다.** 브랜드 어느 자산에도 없다. 상태 표시는 색 + 텍스트 배지로 한다.

### 앱 카피 (매니저용)
명령형 단문 + 단계 번호. 예: `사진을 촬영해 주세요`, `특이사항이 있다면 입력해 주세요`, `완료 처리하면 진행률에 반영됩니다`. 실패 메시지는 원인 + 다음 행동을 함께 준다: `시각이 잘못 인식되었나요? 기록일시를 수정할 수 있습니다`.

---

## VISUAL FOUNDATIONS

### 한 줄 요약
**화이트 베이스 + 플랫 2D + `#004ACC` 포인트.** 입체·그라데이션 표현은 **브랜드 심볼의 링과 CTA 게이지 단 두 곳**에만 허용한다. (레퍼런스: start.litt.ly의 플랫 2D를 베이스로 채택, about.handly.team의 전면 3D는 비채택 — 심볼이 이미 유일한 입체 요소이기 때문.)

### 컬러
- 브랜드 컬러는 **블루 하나**. `#004ACC` (Pantone 2728C). 화이트 위 대비 7.37:1 → AAA.
- 잉크(본문·다크 섹션)는 **`#262B3C`**. 어셋 PDF에 `#282828`과 `R38 G43 B60`이 함께 표기된 불일치가 있었으나, 실제 아트워크(피처 그래픽의 슬로건 레터링) 픽셀값이 `#262B3C`이고 CMYK(C90 M85 Y60 K45)도 청색 편향이므로 **`#262B3C`를 정본으로 확정**했다. 변경 시 `--color-ink` 한 곳만 고치면 된다.
- 배경은 화이트가 기본, 섹션 구분은 `#F7F9FD` / `#F4F7FD` 같은 아주 옅은 블루 틴트로만 한다. **한 페이지에 배경색은 최대 2종**(화이트 + 틴트) + 다크 섹션(잉크) 1~2회.
- `#8B919E`는 3.1:1이므로 **본문·폼 라벨·오류 메시지에 금지**. 18px 이상 보조 정보에만.
- 시맨틱 컬러는 앱 UI와 동일: 정상 `#16A34A`, D-30 임박 `#D97706`, 폐기 대상 `#DC2626`.

### 타이포그래피
- **Pretendard** 단일 서체(dynamic subset). 한글 UI 표준체이고 로고 슬로건 레터링과 계열이 맞는다.
- 헤드라인은 700 + 마이너스 자간(-0.03em 전후), 본문은 400 / line-height 1.75. 한글은 행간을 넉넉히 준다.
- **`word-break: keep-all` 필수** — 한글 단어 중간 줄바꿈 방지. 모든 문단에 `text-wrap: pretty`.
- 숫자 강조(체크리스트 319개, 요금)는 헤딩 사이즈 + 브랜드 블루, 단위는 본문 크기 서브 컬러로 붙인다.

### 배경 · 이미지
- 풀블리드 사진은 쓰지 않는다. 배경은 **단색 또는 옅은 틴트**.
- 반복 패턴·텍스처·노이즈 **없음**. 그라데이션 배경 **없음**(CTA 게이지 제외).
- 사진은 **실제 매장 사진 / 실제 앱 화면 우선**. 스톡 최소화, 불가피하면 블루 톤 컬러 그레이딩으로 통일. 컬러 무드는 **차갑고 밝은 중성**(웜톤 금지, 그레인 금지).
- 앱 화면은 항상 **폰 프레임(radius 24px, 얇은 보더 1px `#E8ECF5`)** 안에 넣고, 실사 그림자 대신 플랫 카드 섀도우를 쓴다.

### 카드 · 보더 · 섀도우
- 카드 = 화이트 배경 + `1px solid #E8ECF5` + `radius 18px` + `0 4px 14px rgba(0,74,204,.06)`. **그림자는 항상 블루 틴트**(검정 그림자 금지).
- 떠 있는 요소(플로팅 카드·드롭다운·모바일 오버레이): `0 14px 34px rgba(24,32,52,.12)`.
- Primary CTA: `0 10px 24px rgba(0,74,204,.24)`.
- 좌측 컬러 보더만 있는 카드, 굵은 컬러 아웃라인 카드 **쓰지 않는다**.
- Radius 체계: 10 / 14 / 18 / 22 / 24 / 999px. 버튼 10px, 인풋 10px, 카드 18px, 큰 패널 22~24px, 배지·칩 999px.

### 레이아웃
- 컨테이너 1120px, 섹션 세로 패딩 `clamp(56px,7vw,96px)`, 좌우 거터 `clamp(20px,4vw,56px)`.
- 그리드 데스크톱 12 / 태블릿 8 / 모바일 4. 스페이싱 스케일 4·8·12·16·20·24·32·40·56·72·96.
- **모바일 퍼스트** — 점주 트래픽의 70% 이상이 모바일 가정.
- 고정 요소는 둘뿐: **sticky 헤더(72px, `rgba(255,255,255,.9)` + `backdrop-filter: blur(10px)`)** 와 **모바일 하단 고정 CTA 바(전화 | 상담, 스크롤 400px 이후 등장)**. 채널톡 위젯은 우하단, 모바일에서 하단 바와 겹치지 않게 오프셋.
- 투명도·블러는 이 sticky 헤더와 모바일 풀스크린 오버레이 **딱 두 군데**에서만 쓴다. 카드나 섹션에 글래스모피즘을 쓰지 않는다.

### 모션
- 스크롤 진입: `opacity 0→1` + `translateY 24px→0`, 500ms, `cubic-bezier(0.16,1,0.3,1)`, 뷰포트 15% 진입 시점. 카드 그룹은 60ms 스태거.
- 버튼 hover: `translateY(-1px)` + 그림자 강화, 160ms. **색은 어둡게**(`#003BA3`), 밝아지지 않는다.
- press: `translateY(0)` + 더 어두운 톤(`#002F82`). 스케일 축소는 쓰지 않는다.
- 탭 전환은 200ms 크로스페이드. 모바일 메뉴는 240ms 슬라이드 인.
- 카운터는 0→목표값 1400ms `easeOutExpo`, **1회만**.
- 브랜드 전용 모션 1종: **히어로에서 심볼 링 위의 점이 궤도를 1회 돌고 멈춘다** (= 비어 있는 궤도를 채우러 가는 반오토). 바운스·스프링·무한 루프는 쓰지 않는다.
- `prefers-reduced-motion: reduce`면 트랜스폼·자동재생 전부 끄고 opacity만 남긴다. 애니메이션 때문에 콘텐츠가 영구히 숨겨지면 안 된다.

### 상태 · 포커스
- 포커스 링: `outline: 2px solid #004ACC; outline-offset: 2px` — 예외 없이 가시적.
- disabled: 배경 `#EEF1F7`, 텍스트 `#8B919E`, 그림자 제거.
- 모바일 터치 타깃 최소 44×44px.

---

## ICONOGRAPHY

- **제공된 아이콘 세트가 없다.** 브랜드 자산은 로고 3종 + 앱 아이콘뿐이다.
- 표준으로 **Lucide** (CDN, `https://unpkg.com/lucide@latest`)를 채택한다 — stroke 기반, `stroke-width` 조정 가능, 라운드 캡. 브랜드 가이드가 요구하는 **stroke 1.8~2.0px / 24×24 viewBox / `stroke-linecap: round`** 와 일치한다. ⚠️ **이것은 대체(substitution)다.** 반오토 앱의 실제 아이콘 세트를 받으면 교체해야 한다.
- 사용 규칙: 크기 20 / 24 / 28px, `stroke-width: 1.8`, 색은 `currentColor`. 면(fill) 아이콘은 쓰지 않는다.
- 아이콘 강조가 필요하면 `#EEF3FF` 배경 + `radius 14px` 정사각 타일 안에 블루 아이콘을 넣는다(그라데이션 타일 금지).
- **이모지는 쓰지 않는다.** 유니코드 기호를 아이콘 대용으로 쓰지 않는다(`→`는 CTA 텍스트 안에서만 허용).
- 심볼 로고(`assets/logo/symbol.svg`)는 **아이콘이 아니다** — 파비콘, 앱 아이콘, 로딩 인디케이터, 대형 그래픽 요소로만 쓴다. 클리어스페이스 0.2X.
- 앱 하단 탭(홈/체크리스트/출퇴근/재고관리/게시판/발주요청)도 Lucide로 대체 구현했다: `home, check-square, clock, package, message-square, clipboard-list`.

### 로고 사용 규칙
| 유형 | 파일 | 최소 사이즈 | 클리어스페이스 | 사용처 |
| --- | --- | --- | --- | --- |
| 워드마크형 | `assets/logo/logo-horizontal.svg` / `-dark.svg` | 5.5mm / **36px** | 0.25X | GNB, 푸터 |
| 슬로건형 | `assets/logo/logo-slogan.svg` / `-dark.svg` | 20mm / **60px** | 0.25X | 히어로, 회사소개, 인쇄물 |
| 심볼 | `assets/logo/symbol.svg` | — | 0.2X | 파비콘, 앱 아이콘, 그래픽 요소 |
| 앱 아이콘 | `assets/logo/app-icon.png` (1024×1024) | — | — | 스토어, 런처 |

- 어두운 배경에는 반드시 `-dark` 버전. **`filter: invert()` 금지** — 심볼 링의 블루 그라데이션이 깨진다.
- 로고 좌우 여백은 로고 높이(X)의 0.25배 이상. 모바일 GNB에서 가장 위반하기 쉽다.

> **자산 복구 메모**: 업로드된 원본 SVG는 `<style>` 블록과 링 그라데이션 래스터가 유실된 상태였다(모든 패스가 검게 렌더). `assets/logo/`의 파일은 각 패스에 명시적 `fill`을 부여하고, 링 그라데이션을 실제 아트워크에서 샘플링한 값(`#004ACC → #A3C3FF`, 수평)의 SVG `linearGradient`로 재구성한 복구본이다. 원본 벡터 형상은 손대지 않았다. 원본 그라데이션 데이터가 있다면 교체 권장.

---

## Index

```
styles.css              ← 소비 프로젝트가 링크하는 단 하나의 진입점 (@import만)
tokens/                 colors · typography · spacing · effects · motion · fonts
assets/logo/            logo-horizontal(-dark) · logo-slogan(-dark) · symbol · app-icon.png
assets/brand/           splash.png · splash-slogan.png · feature-graphic.png · android-foreground.png
guidelines/             파운데이션 스펙 카드 (Design System 탭에 표시)
components/core/        Button · Badge · Card · SectionLabel · Stat · Toast
components/forms/       Field · TextInput · Select · Checkbox · Radio
components/layout/      Header · Footer · MobileStickyCTA
components/marketing/   FeatureCard · ProcessCard · PhoneFrame · Tabs · Accordion · PricingCalculator
components/app/         AppHeader · ChecklistItem · StatusPill · ProgressBar · TabBar
ui_kits/website/        공식 홈페이지 재현 (홈 · 운영시스템 · 요금 · 상담)
ui_kits/manager_app/    매장관리 앱 재현 (대시보드 · 체크리스트 · 출퇴근 · 재고)
SKILL.md                Claude Code용 스킬 진입점
```

컴포넌트 인벤토리는 PRD §8.5의 컴포넌트 표를 소스로 삼았다.

### Components (전체)
**core** — `Button`, `Badge`, `Card`, `SectionLabel`, `Stat`, `Toast`
**forms** — `Field`, `TextInput`, `Select`, `Checkbox`, `Radio`
**layout** — `Header`, `Footer`, `MobileStickyCTA`
**marketing** — `FeatureCard`, `ProcessCard`, `PhoneFrame`, `Tabs`, `Accordion`, `PricingCalculator`
**app** — `AppHeader`, `ChecklistItem`, `StatusPill`, `ProgressBar`, `TabBar`

### Intentional additions
- `SectionLabel`, `StatusPill`, `ProgressBar`, `TabBar` — PRD 표에 개별 항목으로는 없지만 §8.3(레이블 토큰)과 부록 A(앱 화면)에서 실제로 반복되는 요소라 프리미티브로 분리했다.
- `Icon` 래퍼는 만들지 않았다. Lucide를 그대로 쓴다.
