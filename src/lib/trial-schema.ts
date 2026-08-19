import { z } from "zod";
import { digitsOnly } from "./contact-schema";

/**
 * 무료체험 신청 스키마 — 이름 · 연락처 · 회사명(매장명) 세 개뿐이다.
 *
 * ── 왜 세 개인가 ──
 * 체험 계정을 열어드리고 사용 방법을 안내하는 데 필요한 최소값이다. 상담
 * 신청서와 같은 항목(업종·매장 수·지역)을 여기서 또 받으면 "일단 써보려던
 * 사람"이 상담 폼을 다시 만난 셈이 되어 이탈한다. CLAUDE.md §1.2 도 개인정보
 * 최소 수집을 요구한다 — 목적에 필요하지 않은 항목은 받지 않는다.
 *
 * ⚠️⚠️ **개인정보처리방침 제2조 개정 전에는 접수를 열지 않는다.**
 * 이름·연락처는 방침에 있는 항목이지만 **수집 목적("무료체험 신청 접수")이
 * 없다.** 목적 외 수집도 위반이므로 `trial/actions.ts` 의
 * `TRIAL_SINK_CONFIGURED` 는 false 이고, 운영 환경에서는 접수가 성사되지 않는다
 * (X-17). 방침 개정(X-02)과 저장소 연결(X-08)을 **같이** 하기 전에는 올리지 않는다.
 *
 * ── 상담 리드·소개서 요청과 섞지 않는다 ──
 * 세 데이터는 목적과 보유기간이 다르다(§1.2). 스키마를 따로 두어 나중에 한쪽만
 * 고치는 사고를 막는다.
 *
 * ── 체험 "기간" 은 어디에도 적지 않는다 ──
 * 기획 문서마다 14일과 7일이 갈린다(`content/plans.ts` 머리 주석). 확정 전까지
 * 숫자를 화면에 박지 않는다.
 */

export const trialSchema = z.object({
  name: z.string().trim().min(2, "성함을 2자 이상 입력해 주세요").max(30, "성함이 너무 깁니다"),

  // 저장·검증은 숫자만으로 한다. 화면 표시만 하이픈을 넣는다(상담 폼과 동일).
  phone: z
    .string()
    .transform(digitsOnly)
    .refine((v) => /^01[016789]\d{7,8}$/.test(v), "휴대폰 번호를 정확히 입력해 주세요"),

  company: z
    .string()
    .trim()
    .min(2, "회사명 또는 매장명을 2자 이상 입력해 주세요")
    .max(60, "회사명이 너무 깁니다"),

  agreePrivacy: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요" }),
});

export type TrialInput = z.input<typeof trialSchema>;
export type TrialData = z.output<typeof trialSchema>;
