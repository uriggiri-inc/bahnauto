import { z } from "zod";
import { digitsOnly } from "./contact-schema";
import { isValidRegion } from "./regions";

/**
 * 매장매니저 지원서 스키마 (PRD §7.7).
 *
 * ⚠️ **상담 리드와 같은 스키마를 쓰지 않는다.** 두 데이터는 보유기간과 파기 의무가
 * 다르다 — 채용 미채택자 정보는 별도 파기 의무가 있고, 저장소도 분리해야 한다
 * (CLAUDE.md §1.2 · PRD §7.7 AC). 파일을 나눠 두면 나중에 한쪽만 고치는 사고를 막는다.
 *
 * 수집 항목은 §7.7 의 9개로 고정한다. 생년월일·주민번호·사진은 받지 않는다.
 */

/** 가능 시간대 — 앱 인정 시간(18:00~10:00)에 맞춘 구간 */
export const TIME_SLOTS = [
  "오전 (06:00~10:00)",
  "오후 (10:00~18:00)",
  "저녁 (18:00~22:00)",
  "심야 (22:00~06:00)",
] as const;

export const TRANSPORT = ["자차", "대중교통", "도보"] as const;

export const EXPERIENCE = ["있음", "없음"] as const;

export const careersSchema = z
  .object({
    name: z.string().trim().min(2, "성함을 2자 이상 입력해 주세요").max(30, "성함이 너무 깁니다"),

    phone: z
      .string()
      .transform(digitsOnly)
      .refine((v) => /^01[016789]\d{7,8}$/.test(v), "휴대폰 번호를 정확히 입력해 주세요"),

    // 거주 지역
    homeSido: z.string().min(1, "거주 시·도를 선택해 주세요"),
    homeSigungu: z.string().min(1, "거주 시·군·구를 선택해 주세요"),

    // 희망 근무 지역
    workSido: z.string().min(1, "희망 근무 시·도를 선택해 주세요"),
    workSigungu: z.string().min(1, "희망 근무 시·군·구를 선택해 주세요"),

    // 복수 선택. 최소 하나는 골라야 배정이 가능하다
    timeSlots: z.array(z.enum(TIME_SLOTS)).min(1, "가능한 시간대를 하나 이상 선택해 주세요"),

    transport: z.enum(TRANSPORT, { message: "이동 수단을 선택해 주세요" }),

    experience: z.union([z.enum(EXPERIENCE), z.literal("")]).optional(),
    message: z.string().trim().max(500, "500자 이내로 입력해 주세요").optional(),

    agreePrivacy: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요" }),
  })
  .refine((v) => isValidRegion(v.homeSido, v.homeSigungu), {
    message: "거주 지역 조합을 확인해 주세요",
    path: ["homeSigungu"],
  })
  .refine((v) => isValidRegion(v.workSido, v.workSigungu), {
    message: "희망 근무 지역 조합을 확인해 주세요",
    path: ["workSigungu"],
  });

export type CareersInput = z.input<typeof careersSchema>;
