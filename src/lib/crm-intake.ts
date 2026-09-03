import type { SubmitResult } from "./form-result";

/**
 * 반오토 영업관리 접수 API 로 신청을 보낸다 — 세 폼(무료체험·매니저 지원·도입 상담)의 **유일한 저장소**.
 *
 * ⚠️ 운영(bahnauto.kr)은 GitHub Pages 정적 빌드라 이 파일(서버 액션)은 **쓰이지 않는다** —
 *    정적 빌드에서는 `form-submit.static.ts` 가 브라우저에서 공개키로 같은 API 를 부른다.
 *    이 파일은 서버가 있는 배포(Cloudflare Workers 등)로 옮길 때를 위해 남긴다.
 *
 * 문서: https://app.bahnauto.kr/developers/leads-api
 *
 * 서버 액션("use server")에서만 부른다 — 클라이언트 컴포넌트에서 import 하지 않는다.
 * 환경변수(서버 전용 — 브라우저에 절대 내리지 않는다):
 *   CRM_INTAKE_URL  https://app.bahnauto.kr/api/v1/public/leads
 *   CRM_API_KEY     반오토 환경설정 › API 관리에서 발급한 bao_live_… 키
 * 둘 중 하나라도 없으면 「연결 안 됨」이다 — 받은 척하지 않고 다른 경로를 안내한다(각 actions.ts).
 *
 * CLAUDE.md §1.1 S3 — 요청 본문·응답을 로그에 남기지 않는다. 실패 시 상태 코드만 기록한다.
 */

export function crmConfigured(): boolean {
  return !!(process.env.CRM_INTAKE_URL && process.env.CRM_API_KEY);
}

export type LeadType = "trial" | "careers" | "contact";

export async function postLead(
  type: LeadType,
  payload: Record<string, unknown>,
): Promise<SubmitResult> {
  const url = process.env.CRM_INTAKE_URL;
  const key = process.env.CRM_API_KEY;
  if (!url || !key) return { ok: false, message: "접수 저장소가 연결되어 있지 않습니다." };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ ...payload, type, submittedAt: new Date().toISOString() }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error(`[crm] ${type} 접수 요청 실패 (network)`);
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
  console.error(`[crm] ${type} 접수 거절 (${res.status})`); // 값은 남기지 않는다

  if (res.status === 400 && body.fieldErrors) {
    return {
      ok: false,
      message: body.error ?? "입력값을 다시 확인해 주세요",
      fieldErrors: body.fieldErrors,
    };
  }
  return {
    ok: false,
    message:
      "접수 처리 중 문제가 생겼습니다. 잠시 후 다시 시도하거나 전화(1899-3635)로 말씀해 주세요.",
  };
}
