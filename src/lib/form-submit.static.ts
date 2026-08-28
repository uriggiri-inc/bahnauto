import type { SubmitResult } from "./form-result";

/**
 * 정적 내보내기 빌드용 교체본 (`next.config.ts` 의 resolveAlias 가 연결한다).
 *
 * 정적 사이트에는 서버가 없다. 접수를 받을 수 없으므로 **받은 척하지 않는다.**
 * 성공 화면만 띄우면 그 사람은 연락을 기다리다가 아무 일도 일어나지 않는다.
 *
 * 검증은 이미 화면에서 같은 Zod 스키마로 끝난 뒤다. 여기서는 그 결과를 어디로도
 * 보낼 수 없다는 사실만 알린다.
 */

const PREVIEW_NOTICE =
  "이 화면은 검토용 미리보기라 접수가 되지 않습니다. 실제 신청은 정식 오픈 후 가능합니다.";

export async function submitContact(): Promise<SubmitResult> {
  return { ok: false, message: PREVIEW_NOTICE };
}

export async function submitApplication(): Promise<SubmitResult> {
  return { ok: false, message: PREVIEW_NOTICE };
}

/**
 * 소개서만 **성공으로 통과시킨다** (사용자 지시 2026-08-28).
 *
 * 다른 셋과 성격이 다르다. 상담·지원·체험 신청은 "사람이 연락을 줄 것" 을 약속
 * 하므로, 서버가 없는데 성공 화면을 띄우면 그 사람은 오지 않는 연락을 기다린다.
 * 그래서 막는 것이 맞다.
 *
 * 소개서는 **약속이 아니라 파일**이다. 방문자가 받으려는 것(PDF)은 정적 사이트가
 * 그 자체로 내려줄 수 있다. 여기서 막으면 줄 수 있는 것을 안 주는 셈이다.
 * 그래서 검증을 통과한 제출은 완료 화면으로 보내고, 거기서 파일을 내려준다.
 *
 * ⚠️⚠️ **입력값은 어디에도 전송·저장되지 않는다.** 정적 사이트에는 받을 서버가
 *      없다. 즉 지금 이 폼은 **리드를 모으지 못하고** 다운로드 전 확인 절차로만
 *      동작한다. 리드를 실제로 받으려면 두 가지가 **함께** 필요하다:
 *        ① 개인정보처리방침 개정 — 제2조 수집 항목에 **이메일이 없다**
 *           (`lib/brochure-schema.ts` 의 경고). 방침에 없는 항목을 수집하면
 *           그 자체가 개인정보보호법 위반이다.
 *        ② 접수 저장소 연결 — 외부 서비스 연동은 `CLAUDE.md` §1.3 확인 대상이다.
 *      둘 중 하나라도 없이 수집을 켜지 않는다. 지금은 **아무것도 수집하지 않으므로
 *      새는 경로도 없다** — 이 상태가 위반은 아니다.
 */
export async function submitBrochure(): Promise<SubmitResult> {
  return { ok: true };
}

export async function submitTrial(): Promise<SubmitResult> {
  return { ok: false, message: PREVIEW_NOTICE };
}
