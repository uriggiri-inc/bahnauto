"use server";

import { trialSchema } from "@/lib/trial-schema";
import type { SubmitResult } from "@/lib/form-result";

/**
 * 무료체험 신청 접수 — **서버 재검증 지점**.
 *
 * CLAUDE.md §1.1 S6: 폼은 브라우저를 거치지 않고 직접 POST 로 우회할 수 있다.
 * 클라이언트와 같은 스키마를 쓰되 **진실은 이쪽**이다.
 *
 * ⚠️ §1.1 S3 — 개인정보를 로그·에러 메시지에 남기지 않는다. 실패해도
 * **어떤 필드가 틀렸는지(이름)만** 돌려주고 값은 어디에도 기록하지 않는다.
 *
 * 화면은 이 파일을 직접 import 하지 않고 `@/lib/form-submit` 을 거친다 —
 * 정적 미리보기 빌드에서 그 지점이 스텁으로 교체되기 때문이다.
 */

/**
 * 체험 신청 저장소가 연결되었는가. 상담 리드·채용 지원·소개서 요청과
 * **별도 플래그**다 — 네 데이터는 목적과 보유기간이 달라 저장소를 분리한다(§1.2).
 *
 * ⚠️⚠️ 이 플래그를 올리기 전에 **반드시** 두 가지를 먼저 끝낸다(X-17).
 *   1. 개인정보처리방침 제2조에 **무료체험 신청 접수** 를 수집 목적으로 추가한다
 *      (이름·연락처 항목 자체는 있으나 이 목적이 없다 — X-02)
 *   2. 체험 신청 저장소를 연결한다(X-08)
 * 둘 중 하나라도 빠진 채로 접수를 열면, 방침에 없는 목적으로 개인정보를 받거나
 * 신청이 조용히 사라지는 상태가 된다.
 */
const TRIAL_SINK_CONFIGURED = false;

export async function submitTrial(raw: unknown): Promise<SubmitResult> {
  const parsed = trialSchema.safeParse(raw);

  if (!parsed.success) {
    // 필드 이름만 모은다. 사용자가 입력한 값은 담지 않는다.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "입력값을 다시 확인해 주세요", fieldErrors };
  }

  if (!TRIAL_SINK_CONFIGURED) {
    if (process.env.NODE_ENV === "production") {
      // 신청을 받아둘 곳이 아직 없다. 받은 척하지 않고 다른 경로를 안내한다.
      return {
        ok: false,
        message:
          "지금은 체험 온라인 신청이 준비 중입니다. 전화(1899-3635)나 카카오톡으로 말씀해 주시면 담당자가 체험 계정과 사용 방법을 안내해 드리겠습니다.",
      };
    }
    // 개발 환경 — 화면 흐름(제출 → 완료 → 체험 대시보드) 확인용으로만 통과시킨다
    return { ok: true };
  }

  // TODO(저장소 연결): 체험 신청을 **상담 리드·채용 지원·소개서 요청과 다른
  //  저장소**에 저장한다.
  //  · 보유기간과 파기 시점을 개인정보처리방침에 기재한 값과 일치시킨다
  //  · 체험 계정 발급 안내에도 개인정보 최소 원칙을 적용한다
  return { ok: true };
}
