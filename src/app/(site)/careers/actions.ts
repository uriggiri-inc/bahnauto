"use server";

import { careersSchema } from "@/lib/careers-schema";
import type { SubmitResult } from "@/lib/form-result";
import { crmConfigured, postLead } from "@/lib/crm-intake";

/**
 * 매장매니저 지원서 접수 — 서버 재검증 지점.
 *
 * ⚠️ **상담 리드와 반드시 다른 저장소에 넣는다**(CLAUDE.md §1.2 · PRD §7.7 AC).
 * 채용 목적 개인정보는 보유기간과 파기 의무가 상담 리드와 다르다.
 * 편의상 한 테이블에 섞으면 나중에 파기 시점이 오면 분리할 수 없다.
 *
 * ⚠️ 개인정보를 로그에 남기지 않는다(§1.1 S3). 실패해도 필드 이름만 돌려준다.
 *
 * 화면은 이 파일을 직접 import 하지 않고 `@/lib/form-submit` 을 거친다 —
 * 정적 미리보기 빌드에서 그 지점이 스텁으로 교체되기 때문이다.
 */

/**
 * 지원서 저장소가 연결되었는가. 상담 리드(`contact/actions.ts`)와 **별도 플래그**다 —
 * 하나만 켜는 실수를 막기 위해 일부러 공유하지 않는다.
 */
// 2026-09-05: 저장소는 반오토 영업관리 접수 API 다(lib/crm-intake.ts). 유형 careers 로 들어가
// 상담 리드(contact)와 다른 갈래로 관리·파기된다.
const APPLICANT_SINK_CONFIGURED = crmConfigured();

export async function submitApplication(raw: unknown): Promise<SubmitResult> {
  const parsed = careersSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "입력값을 다시 확인해 주세요", fieldErrors };
  }

  if (!APPLICANT_SINK_CONFIGURED) {
    if (process.env.NODE_ENV === "production") {
      // 저장할 곳이 없는데 접수됐다고 답하면 지원자를 잃는다.
      return {
        ok: false,
        message: "지금은 온라인 지원 접수가 준비 중입니다. 전화로 연락 주시면 안내해 드리겠습니다.",
      };
    }
    return { ok: true };
  }

  const d = parsed.data;
  return postLead("careers", {
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
