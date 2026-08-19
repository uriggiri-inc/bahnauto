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

export async function submitBrochure(): Promise<SubmitResult> {
  return { ok: false, message: PREVIEW_NOTICE };
}

export async function submitTrial(): Promise<SubmitResult> {
  return { ok: false, message: PREVIEW_NOTICE };
}
