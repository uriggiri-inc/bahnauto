import { z } from "zod";
import { digitsOnly, REFERRERS } from "./contact-schema";

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

/*
  ── 2026-09-04 소개서 폼과 양식을 통일했다 (노션 「반오토 폼양식 수정」) ──
  순서는 문서 그대로다: 성함 › 연락처 › 이메일 › 회사명 또는 매장명 › 어떻게 알고 오셨나요.
  두 폼이 같은 모양이어야 방문자가 어느 쪽을 눌러도 같은 것을 묻는다고 느낀다.

  ⚠️ 이메일이 새로 들어왔다. 개인정보처리방침 제2조 수집 항목에 이메일이 없다 —
     사용자가 **방침을 노션에서 갱신하는 것으로 정리**하고 진행을 확정했다(2026-09-04).
     방침이 갱신되기 전까지는 항목과 고지가 어긋난 상태다.
*/
export const trialSchema = z
  .object({
    name: z.string().trim().min(2, "성함을 2자 이상 입력해 주세요").max(30, "성함이 너무 깁니다"),

    // 저장·검증은 숫자만으로 한다. 화면 표시만 하이픈을 넣는다(상담 폼과 동일).
    phone: z
      .string()
      .transform(digitsOnly)
      .refine((v) => /^01[016789]\d{7,8}$/.test(v), "휴대폰 번호를 정확히 입력해 주세요"),

    // 체험 계정 안내를 보낼 곳. 형식만 본다 — 존재 여부는 발송 시점에 드러난다.
    email: z
      .string()
      .trim()
      .max(120, "이메일 주소가 너무 깁니다")
      .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "이메일 주소를 정확히 입력해 주세요"),

    company: z
      .string()
      .trim()
      .min(2, "회사명 또는 매장명을 2자 이상 입력해 주세요")
      .max(60, "회사명이 너무 깁니다"),

    // 선택 항목. 선택지는 상담·소개서 폼과 **같은 목록**(`REFERRERS`)을 쓴다
    referrer: z.union([z.enum(REFERRERS), z.literal("")]).optional(),
    referrerDetail: z.string().trim().max(50, "50자 이내로 입력해 주세요").optional(),

    agreePrivacy: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요" }),
  })
  // `기타` 가 아니면 직접 입력값을 버린다(상담·소개서 폼과 같은 처리)
  .transform((v) => (v.referrer === "기타" ? v : { ...v, referrerDetail: undefined }));

export type TrialInput = z.input<typeof trialSchema>;
export type TrialData = z.output<typeof trialSchema>;
