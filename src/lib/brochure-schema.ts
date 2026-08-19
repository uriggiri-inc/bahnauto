import { z } from "zod";
import { digitsOnly } from "./contact-schema";

/**
 * 서비스 소개서 받기 스키마 — 회사명 · 이메일 · 연락처 세 개뿐이다.
 *
 * ── 왜 세 개인가 ──
 * 소개서를 보내는 데 필요한 최소값이다. 상담 신청서와 같은 항목(업종·매장 수·
 * 지역)을 여기서도 받으면 "소개서만 받아보려던 사람"이 상담 폼을 다시 만난 셈이
 * 되어 이탈한다. 그리고 CLAUDE.md §1.2 는 개인정보 최소 수집을 요구한다 —
 * 목적(소개서 발송)에 필요하지 않은 항목은 받지 않는다.
 *
 * ⚠️⚠️ **이메일은 이 사이트가 지금까지 받지 않던 항목이다.**
 * 개인정보처리방침 제2조의 수집 항목에 이메일이 없다. 방침에 없는 항목을
 * 실제로 수집하면 그 자체가 위반이므로, **방침 개정 전에는 접수를 열지 않는다.**
 * 그래서 `brochure/actions.ts` 의 `BROCHURE_SINK_CONFIGURED` 는 false 이고,
 * 운영 환경에서는 접수가 성사되지 않는다. 방침 개정과 저장소 연결을 **같이**
 * 하기 전에는 이 플래그를 올리지 않는다.
 *
 * ── 상담 리드와 섞지 않는다 ──
 * 소개서 요청과 도입 상담은 목적과 보유기간이 다르다(§1.2). 스키마를 따로 두어
 * 나중에 한쪽만 고치는 사고를 막는다.
 */

export const brochureSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "회사명 또는 매장명을 2자 이상 입력해 주세요")
    .max(60, "회사명이 너무 깁니다"),

  // 소개서를 보낼 곳. 형식만 본다 — 존재 여부는 발송 시점에 드러난다.
  email: z
    .string()
    .trim()
    .max(120, "이메일 주소가 너무 깁니다")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "이메일 주소를 정확히 입력해 주세요"),

  // 저장·검증은 숫자만으로 한다. 화면 표시만 하이픈을 넣는다(상담 폼과 동일).
  phone: z
    .string()
    .transform(digitsOnly)
    .refine((v) => /^01[016789]\d{7,8}$/.test(v), "휴대폰 번호를 정확히 입력해 주세요"),

  agreePrivacy: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요" }),
});

export type BrochureInput = z.input<typeof brochureSchema>;
export type BrochureData = z.output<typeof brochureSchema>;
