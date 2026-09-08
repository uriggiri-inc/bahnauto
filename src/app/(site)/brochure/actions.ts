"use server";

import { brochureSchema } from "@/lib/brochure-schema";
import type { SubmitResult } from "@/lib/form-result";
import { crmConfigured, postLead } from "@/lib/crm-intake";

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
 * 소개서 요청 저장소가 연결되었는가. 다른 세 폼과 **같은 저장소**(반오토 영업관리 접수 API)이지만
 * 유형(`brochure`)이 달라 그 안에서 분리 관리된다 — 목적과 보유기간이 다르기 때문이다(§1.2).
 *
 * ── 2026-09-08 접수를 열었다 (사용자 지시) ──
 * 그동안 막아 둔 이유 두 가지가 모두 해소됐다.
 *   · 접수 API 에 `brochure` 유형이 없었다 → **있다.** 접수번호 `B-0001`, 「소개서신청」 탭,
 *     담당자 자동 배정, 필드(회사명·이메일·유입 경로)까지 반오토 쪽에 준비돼 있다
 *   · 보낼 소개서 파일이 없었다(X-10) → **있다.** 2026-08-28 에 `public/brochure/` 에 넣었고
 *     완료 화면에서 즉시 내려받는다
 *
 * ⚠️ 남은 것은 **개인정보처리방침 제2조에 이메일 수집을 넣는 일**(X-02)이다. 무료체험 폼이
 *    2026-09-04 부터 이미 이메일을 받아 저장하고 있어 소개서만 막아 두는 것이 뜻이 없어졌고,
 *    사용자가 접수를 여는 쪽으로 정했다. 방침 개정 때 네 폼을 함께 손본다.
 */
// 저장소는 반오토 영업관리 접수 API 다. 서버 환경변수 CRM_INTAKE_URL · CRM_API_KEY 가
// 둘 다 있을 때만 켜진다(lib/crm-intake.ts). 정적 배포에서는 이 파일이 아니라
// `lib/form-submit.static.ts` 가 공개키로 같은 API 를 부른다.
const BROCHURE_SINK_CONFIGURED = crmConfigured();

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

  /*
    ── 접수에 실패해도 완료 화면으로 보낸다 ──
    다른 셋과 성격이 다르다. 상담·지원·체험은 "사람이 연락을 줄 것" 을 약속하므로 저장에
    실패하면 성공 화면을 띄우면 안 되지만, 소개서가 약속한 것은 **파일**이다. 우리 접수 서버가
    잠깐 죽었다고 방문자가 소개서를 못 받는 것이 더 나쁘다.
    그래서 저장 실패는 조용히 넘기고 완료 화면(= 다운로드)으로 보낸다.
    ⚠️ 대신 **입력값 검증 실패는 그대로 막는다** — 위에서 이미 돌려보냈다.
  */
  const d = parsed.data;
  if (BROCHURE_SINK_CONFIGURED) {
    // 유입 경로는 공통 필드 `channel` 로 — `brochure` 유형에는 `referrer` 가 없다(무료체험과 같은 규칙)
    await postLead("brochure", {
      name: d.name,
      phone: d.phone,
      email: d.email,
      company: d.company,
      agreePrivacy: true,
      channel: d.referrer === "기타" ? d.referrerDetail || "기타" : d.referrer || "홈페이지 소개서",
    }).catch(() => undefined);
  }
  return { ok: true };
}
