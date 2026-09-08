import type { SubmitResult } from "./form-result";
import { trialSchema } from "./trial-schema";
import { careersSchema } from "./careers-schema";
import { contactSchema } from "./contact-schema";
import { brochureSchema } from "./brochure-schema";

/**
 * 정적 내보내기 빌드용 교체본 (`next.config.ts` 의 resolveAlias 가 연결한다).
 *
 * ── 2026-09-05 — 정적 사이트도 접수한다 ──
 * bahnauto.kr 은 GitHub Pages 라 서버가 없다. 그래서 **브라우저가 직접** 반오토 영업관리
 * 접수 API 를 부른다. 키는 브라우저용 **공개키(bao_pub_…)** — HTML 에 실리므로 비밀이 아니고,
 * 반오토 쪽에서 허용 출처(https://bahnauto.kr)와 IP 상한으로 막는다.
 *   문서: https://app.bahnauto.kr/developers/leads-api
 *
 * 빌드 변수(둘 다 있어야 켜진다 — GitHub Actions 의 Repository variables → deploy.yml):
 *   NEXT_PUBLIC_CRM_INTAKE_URL   https://app.bahnauto.kr/api/v1/public/leads
 *   NEXT_PUBLIC_CRM_PUBLIC_KEY   반오토 환경설정 › API 관리에서 발급한 공개키
 * 없으면 예전처럼 「접수 준비 중」 안내로 떨어진다 — 받은 척하지 않는다.
 *
 * 검증은 서버 액션과 같은 Zod 스키마로 여기서 한 번 더 한다(화면이 우회될 수 있다).
 * 개인정보를 로그·에러에 남기지 않는다(CLAUDE.md §1.1 S3).
 */

const URL = process.env.NEXT_PUBLIC_CRM_INTAKE_URL;
const KEY = process.env.NEXT_PUBLIC_CRM_PUBLIC_KEY;

const PREVIEW_NOTICE =
  "이 화면은 검토용 미리보기라 접수가 되지 않습니다. 실제 신청은 정식 오픈 후 가능합니다.";
/*
  위 두 빌드 변수가 비었을 때만 나가는 예비 안내다.

  ⚠️ 각 `actions.ts`(서버 경로)의 같은 문구와 **글자까지 같아야 한다.** 정적 빌드와
     서버 빌드가 다른 말을 하면 미리보기와 배포본이 갈라진다.

  2026-09-07 카카오톡 언급을 뺐다(X-20) — 카카오 채널·채널톡은 2026-09-04 폐기
  확정이라 안내해도 갈 곳이 없다. `contact` 에는 없던 대표번호를 함께 넣었다.
  전화하라면서 번호를 주지 않는 안내였다.
*/
const NOT_READY = {
  trial:
    "지금은 체험 온라인 신청이 준비 중입니다. 전화(1899-3635)로 말씀해 주시면 담당자가 체험 계정과 사용 방법을 안내해 드리겠습니다.",
  careers: "지금은 온라인 지원 접수가 준비 중입니다. 전화로 연락 주시면 안내해 드리겠습니다.",
  contact:
    "지금은 온라인 접수가 준비 중입니다. 전화(1899-3635)로 연락 주시면 바로 도와드리겠습니다.",
  /* 소개서는 이 문구를 화면에 띄우지 않는다 — 저장에 실패해도 완료 화면(다운로드)으로 보낸다.
     `post()` 가 유형별 문구를 요구해서 대칭을 위해 둔다. */
  brochure: "지금은 소개서 접수가 준비 중입니다. 소개서는 아래에서 바로 내려받으실 수 있습니다.",
} as const;

function fieldErrorsOf(issues: { path: PropertyKey[]; message: string }[]) {
  // 필드 이름만 모은다. 값은 담지 않는다.
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

async function post(
  type: keyof typeof NOT_READY,
  payload: Record<string, unknown>,
): Promise<SubmitResult> {
  if (!URL || !KEY) {
    return {
      ok: false,
      message: process.env.NODE_ENV === "production" ? NOT_READY[type] : PREVIEW_NOTICE,
    };
  }
  let res: Response;
  try {
    res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      // website: 허니팟 — 사람은 이 칸을 채울 수 없다. 늘 비워 보낸다
      body: JSON.stringify({
        ...payload,
        type,
        website: "",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return { ok: false, message: "접수 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }
  // 201 접수됨 · 200 중복(이미 접수된 건) — 사용자에게는 둘 다 「접수됨」
  if (res.ok) return { ok: true };

  let body: { error?: string; fieldErrors?: Record<string, string> } = {};
  try {
    body = await res.json();
  } catch {
    /* 본문 없음 */
  }
  if (res.status === 400 && body.fieldErrors) {
    return {
      ok: false,
      message: body.error ?? "입력값을 다시 확인해 주세요",
      fieldErrors: body.fieldErrors,
    };
  }
  if (res.status === 429)
    return { ok: false, message: "요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요." };
  return {
    ok: false,
    message:
      "접수 처리 중 문제가 생겼습니다. 잠시 후 다시 시도하거나 전화(1899-3635)로 말씀해 주세요.",
  };
}

export async function submitContact(raw: unknown): Promise<SubmitResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      message: "입력값을 다시 확인해 주세요",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  const d = parsed.data;
  return post("contact", {
    name: d.name,
    phone: d.phone,
    // 연락 가능 시간대 — 접수 API 에 필드가 생겨 **저장된다**(2026-09-08 확인, 이슈 #36 해소)
    callTime: d.callTime,
    agreePrivacy: true,
    agreeMarketing: d.agreeMarketing,
    storeType: d.storeType,
    sido: d.sido,
    sigungu: d.sigungu,
    storeCount: d.storeCount,
    visits: d.visits || undefined,
    message: d.message || undefined,
    referrer: d.referrer || undefined,
    referrerDetail: d.referrerDetail || undefined,
  });
}

export async function submitApplication(raw: unknown): Promise<SubmitResult> {
  const parsed = careersSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      message: "입력값을 다시 확인해 주세요",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  const d = parsed.data;
  return post("careers", {
    name: d.name,
    phone: d.phone,
    // 연락 가능 시간대 — 접수 API 에 저장된다(2026-09-08 확인). 아래 `timeSlots`
    // (근무 가능 시간대)와 **다른 항목**이니 합치지 않는다.
    callTime: d.callTime,
    agreePrivacy: true,
    homeSido: d.homeSido,
    homeSigungu: d.homeSigungu,
    workSido: d.workSido,
    workSigungu: d.workSigungu,
    timeSlots: d.timeSlots,
    transport: d.transport,
    experience: d.experience || undefined,
    message: d.message || undefined,
    channel: "홈페이지 매니저 지원",
  });
}

export async function submitTrial(raw: unknown): Promise<SubmitResult> {
  const parsed = trialSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      message: "입력값을 다시 확인해 주세요",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  const d = parsed.data;
  return post("trial", {
    name: d.name,
    phone: d.phone,
    // 연락 가능 시간대 — 반오토가 trial 에도 필드를 열어 **저장된다**(2026-09-08 확인).
    // 실제 접수(T-0009)로 값이 들어가는 것까지 확인했다.
    callTime: d.callTime,
    // 이메일은 API **공통 필드**라 그대로 저장된다(2026-09-04 양식 통일로 추가)
    email: d.email,
    company: d.company,
    agreePrivacy: true,
    /*
      유입 경로는 공통 필드 `channel` 로 보낸다 — `trial` 유형에는 `referrer` 가 없다.
      `기타` 를 고르면 직접 적은 값이 더 구체적이므로 그것을 보내고, 아무것도 고르지
      않았으면 최소한 어느 폼에서 왔는지는 남긴다.
    */
    channel: d.referrer === "기타" ? d.referrerDetail || "기타" : d.referrer || "홈페이지 무료체험",
  });
}

/**
 * 소개서 — 접수 API 로 보내되, **실패해도 완료 화면으로 통과시킨다**.
 *
 * 다른 셋과 성격이 다르다. 상담·지원·체험 신청은 "사람이 연락을 줄 것" 을 약속하므로
 * 저장에 실패하면 성공 화면을 띄우면 안 되지만(위 post 가 그래서 막는다), 소개서가 약속한
 * 것은 **파일**이다. 접수 서버가 잠깐 죽었다고 방문자가 PDF 를 못 받는 것이 더 나쁘다.
 * 그래서 저장은 시도하되 그 결과로 화면을 막지 않는다 — 검증을 통과했으면 완료 화면(다운로드)이다.
 *
 * ── 2026-09-08 접수를 열었다 (사용자 지시) ──
 * 그동안 보내지 않던 이유(접수 API 에 brochure 유형 없음 · 보낼 파일 없음)가 둘 다 해소됐다.
 * 반오토에는 「소개서신청」 유형(접수번호 B-…)이 있고, 소개서 PDF 는 `public/brochure/` 에 있다.
 * 남은 것은 개인정보처리방침 제2조의 이메일 수집 표기(X-02)뿐이다 — 서버 경로
 * (`app/(site)/brochure/actions.ts`)에 같은 설명이 있다. 함께 고친다.
 */
export async function submitBrochure(raw: unknown): Promise<SubmitResult> {
  const parsed = brochureSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      message: "입력값을 다시 확인해 주세요",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  const d = parsed.data;
  // 유입 경로는 공통 필드 `channel` 로 — `brochure` 유형에는 `referrer` 가 없다(무료체험과 같은 규칙)
  await post("brochure", {
    name: d.name,
    phone: d.phone,
    email: d.email,
    company: d.company,
    agreePrivacy: true,
    channel: d.referrer === "기타" ? d.referrerDetail || "기타" : d.referrer || "홈페이지 소개서",
  }).catch(() => undefined);
  return { ok: true };
}
