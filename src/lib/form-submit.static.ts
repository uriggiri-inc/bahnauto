import type { SubmitResult } from "./form-result";
import { trialSchema } from "./trial-schema";
import { careersSchema } from "./careers-schema";
import { contactSchema } from "./contact-schema";

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
const NOT_READY = {
  trial:
    "지금은 체험 온라인 신청이 준비 중입니다. 전화(1899-3635)나 카카오톡으로 말씀해 주시면 담당자가 체험 계정과 사용 방법을 안내해 드리겠습니다.",
  careers: "지금은 온라인 지원 접수가 준비 중입니다. 전화로 연락 주시면 안내해 드리겠습니다.",
  contact:
    "지금은 온라인 접수가 준비 중입니다. 전화 또는 카카오톡으로 연락 주시면 바로 도와드리겠습니다.",
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
  const { name, phone, company } = parsed.data;
  return post("trial", { name, phone, company, agreePrivacy: true, channel: "홈페이지 무료체험" });
}

/**
 * 소개서만 **성공으로 통과시킨다** (사용자 지시 2026-08-28).
 *
 * 다른 셋과 성격이 다르다. 상담·지원·체험 신청은 "사람이 연락을 줄 것" 을 약속하므로
 * 저장소 없이 성공 화면을 띄우면 안 되지만(위 post 가 그래서 env 없으면 막는다),
 * 소개서는 **약속이 아니라 파일**이다. 방문자가 받으려는 것(PDF)은 정적 사이트가
 * 그 자체로 내려줄 수 있다. 검증을 통과한 제출은 완료 화면으로 보내고 거기서 파일을 내려준다.
 *
 * ⚠️ 입력값은 어디에도 전송·저장되지 않는다 — 접수 API 에 brochure 유형이 없고,
 *    개인정보처리방침 수집 항목에 이메일이 없다(`lib/brochure-schema.ts` 경고). 둘이 갖춰지기 전에는 켜지 않는다.
 */
export async function submitBrochure(): Promise<SubmitResult> {
  return { ok: true };
}
