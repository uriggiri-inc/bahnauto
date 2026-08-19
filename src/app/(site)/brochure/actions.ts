"use server";

import { brochureSchema } from "@/lib/brochure-schema";
import type { SubmitResult } from "@/lib/form-result";

/**
 * 서비스 소개서 요청 접수 — **서버 재검증 지점**.
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
 * 소개서 요청 저장소가 연결되었는가. 상담 리드·채용 지원과 **별도 플래그**다 —
 * 세 데이터는 목적과 보유기간이 달라 저장소를 분리한다(§1.2).
 *
 * ⚠️⚠️ 이 플래그를 올리기 전에 **반드시** 두 가지를 먼저 끝낸다.
 *   1. 개인정보처리방침 제2조에 **이메일** 수집을 추가한다(현재 없음 — X-02)
 *   2. 보낼 소개서 파일 자체를 확보한다(현재 없음 — X-10)
 * 둘 중 하나라도 빠진 채로 접수를 열면, 방침에 없는 항목을 받거나 보낼 것이
 * 없는데 받는 상태가 된다.
 */
const BROCHURE_SINK_CONFIGURED = false;

export async function submitBrochure(raw: unknown): Promise<SubmitResult> {
  const parsed = brochureSchema.safeParse(raw);

  if (!parsed.success) {
    // 필드 이름만 모은다. 사용자가 입력한 값은 담지 않는다.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "입력값을 다시 확인해 주세요", fieldErrors };
  }

  if (!BROCHURE_SINK_CONFIGURED) {
    if (process.env.NODE_ENV === "production") {
      // 보낼 곳도 보낼 것도 아직 없다. 받은 척하지 않고 다른 경로를 안내한다.
      return {
        ok: false,
        message:
          "지금은 소개서 온라인 신청이 준비 중입니다. 도입 상담을 신청해 주시면 담당자가 소개서와 함께 안내해 드리겠습니다.",
      };
    }
    // 개발 환경 — 화면 흐름 확인용으로만 통과시킨다
    return { ok: true };
  }

  // TODO(저장소 연결): 소개서 요청을 **상담 리드·채용 지원과 다른 저장소**에 저장한다.
  //  · 보유기간과 파기 시점을 개인정보처리방침에 기재한 값과 일치시킨다
  //  · 발송 메일에도 개인정보 최소 원칙을 적용한다
  return { ok: true };
}
