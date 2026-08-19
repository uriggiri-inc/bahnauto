"use server";

import { contactSchema } from "@/lib/contact-schema";
import type { SubmitResult } from "@/lib/form-result";

/**
 * 상담 신청 접수 — **서버 재검증 지점**.
 *
 * CLAUDE.md §1.1 S6: 폼은 브라우저를 거치지 않고 직접 POST 로 우회할 수 있다.
 * 화면에서 아무리 막아도 여기서 다시 확인하지 않으면 막은 것이 아니다.
 * 클라이언트와 같은 스키마를 쓰되, **진실은 이쪽**이다.
 *
 * ⚠️ CLAUDE.md §1.1 S3 — 개인정보를 로그·에러 메시지에 남기지 않는다.
 * 폼 실패 로그에 body 를 통째로 찍는 것이 가장 흔한 사고다. 여기서는 실패해도
 * **어떤 필드가 틀렸는지(이름)만** 돌려주고 값은 어디에도 기록하지 않는다.
 *
 * 화면은 이 파일을 직접 import 하지 않고 `@/lib/form-submit` 을 거친다 —
 * 정적 미리보기 빌드에서 그 지점이 스텁으로 교체되기 때문이다.
 */

/**
 * 리드 저장소가 연결되었는가.
 *
 * 지금은 **UI 만 먼저** 만든 상태라 false 다. 저장소(Cloudflare D1 / 메일 발송 등)를
 * 붙이면서 true 로 바꾸고 아래 저장 블록을 채운다.
 *
 * false 인 동안 **운영 환경에서는 접수를 성공으로 처리하지 않는다.** 성공 화면만
 * 띄우고 실제로는 아무 데도 저장되지 않으면 **리드가 조용히 사라지기 때문이다.**
 * 개발 환경에서는 화면 흐름을 확인해야 하므로 통과시킨다.
 */
const LEAD_SINK_CONFIGURED = false;

export async function submitContact(raw: unknown): Promise<SubmitResult> {
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    // 필드 이름만 모은다. 사용자가 입력한 값은 담지 않는다.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "입력값을 다시 확인해 주세요", fieldErrors };
  }

  if (!LEAD_SINK_CONFIGURED) {
    if (process.env.NODE_ENV === "production") {
      // 저장할 곳이 없는데 성공이라고 답하면 리드를 잃는다. 다른 경로를 안내한다.
      return {
        ok: false,
        message:
          "지금은 온라인 접수가 준비 중입니다. 전화 또는 카카오톡으로 연락 주시면 바로 도와드리겠습니다.",
      };
    }
    // 개발 환경 — 화면 흐름 확인용으로만 통과시킨다
    return { ok: true };
  }

  // TODO(저장소 연결): 상담 리드를 저장한다.
  //  · CLAUDE.md §1.2 — 상담 리드와 채용 지원 데이터는 **분리 저장**한다(보유기간 정책이 다름)
  //  · 보유기간과 파기 시점을 개인정보처리방침에 기재한 값과 일치시킨다
  //  · 저장 실패는 반드시 사용자에게 알린다. 조용히 삼키면 리드가 사라진다
  //  · 알림 메일·메시지에도 개인정보 최소 원칙을 적용한다
  return { ok: true };
}
