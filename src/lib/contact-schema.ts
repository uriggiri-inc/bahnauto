import { z } from "zod";
import { isValidRegion } from "./regions";

/**
 * 도입 상담 신청 스키마 — **클라이언트와 서버가 같은 파일을 쓴다.**
 *
 * CLAUDE.md §1.1 S6: 클라이언트 검증만 믿고 서버 재검증을 생략하지 않는다.
 * 폼은 브라우저를 거치지 않고 직접 POST 로 우회할 수 있으므로, 화면에서 아무리
 * 막아도 서버가 다시 확인하지 않으면 막은 게 아니다. 스키마를 공유하되
 * **실행의 진실은 서버 쪽**이다.
 *
 * 수집 항목은 PRD §7.6 에 정의된 8개 + 동의 2개로 고정한다.
 * CLAUDE.md §1.2: 정의된 필드 외 추가 금지. 주민번호·생년월일·상세주소는 어떤 경우에도
 * 수집하지 않는다.
 */

/** PRD §7.6 — 업종 선택지 */
export const STORE_TYPES = [
  "무인키즈카페",
  "무인카페",
  "무인아이스크림",
  "무인문구",
  "무인세탁",
  "무인스터디카페",
  "기타",
] as const;

/** PRD §7.6 — 운영 매장 수 */
export const STORE_COUNTS = ["1개", "2개", "3개 이상", "개설 준비 중"] as const;

/** 홈 요금 계산기의 방문 횟수와 값을 맞춘다(쿼리로 사전 채움) */
export const VISIT_OPTIONS = [
  "주 1회",
  "주 2회",
  "주 3회",
  "주 5회",
  "매일",
  "상담 후 결정",
] as const;

/**
 * PRD §7.6 — 마케팅 채널 성과 측정용. 반드시 포함한다.
 *
 * ── 2026-08-28 채널을 넓혔다 (사용자 지시) ──
 * 이전에는 여섯 개(네이버 검색·검색광고·지인 소개·카페·커뮤니티·인스타그램·기타)
 * 였다. 실제로 유입되는 채널이 더 많은데 그것들이 전부 `기타` 로 뭉쳐 들어오면
 * **성과 측정이라는 목적 자체가 성립하지 않는다.** 구글·유튜브·당근을 항목으로
 * 올렸다.
 *
 * ── 순서 ──
 * 검색 → SNS·동영상 → 지역 커뮤니티 → 사람 → 기타. 무작정 가나다순으로 두면
 * 고를 사람이 자기 경로를 찾느라 목록을 훑어야 한다. `기타` 는 항상 마지막이다.
 *
 * ⚠️ 이 목록은 **상담·소개서 두 폼이 함께 쓴다.** 값을 바꾸면 양쪽 화면의 선택지가
 *    같이 바뀐다 — 채널별 집계를 한 기준으로 보려면 그래야 한다.
 * ⚠️ 항목을 지울 때는 이미 접수된 값에 그 항목이 있는지 확인한다. 지금은 접수를
 *    저장하지 않아 문제가 없지만, 저장을 켠 뒤에는 `z.enum` 검증이 옛 값을
 *    거부한다.
 */
export const REFERRERS = [
  "네이버 검색",
  "구글 검색",
  "검색광고",
  "인스타그램",
  "유튜브",
  "당근",
  "카페·커뮤니티",
  "지인 소개",
  "기타",
] as const;

/**
 * **연락 가능 시간대** — 담당자가 언제 전화하면 받으실 수 있는지 (노션 「반오토 폼양식 수정」
 * 2026-09-04). 도입 상담과 매니저 지원 두 폼이 같은 목록을 쓴다.
 *
 * ⚠️⚠️ **매니저 지원의 `TIME_SLOTS`(근무 가능 시간대)와 다른 것이다.**
 *    그쪽은 "언제 매장에 나갈 수 있는가", 이쪽은 "언제 전화를 받을 수 있는가" 다.
 *    지원 폼에는 둘이 나란히 있으므로 화면 라벨도 `근무 가능 시간대` ·
 *    `연락 가능 시간대` 로 분명히 갈라 적는다(사용자 지시 2026-09-04).
 *    두 목록을 하나로 합치지 않는다 — 시간 구간의 뜻이 다르다.
 *
 * ⚠️ 접수 API 는 **아직 이 필드를 받지 않는다.** 문서에 "정의에 없는 키는 저장하지
 *    않습니다" 라고 명시돼 있어 지금 보내면 조용히 버려진다. 홈페이지를 먼저
 *    올려두면 확인해 주기로 한 상태다(2026-09-04) — API 에 `callTime` 이 생기면
 *    그때부터 저장된다. 화면·검증은 지금부터 정상 동작한다.
 */
export const CALL_TIMES = [
  "오전 (09:00~12:00)",
  "오후 (12:00~18:00)",
  "저녁 (18:00~21:00)",
  "아무 때나 괜찮습니다",
] as const;

/** 숫자만 남긴다. 하이픈·공백·국가번호 표기가 섞여 들어오기 때문이다 */
export function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

/** 010-1234-5678 형태로 표시용 하이픈을 넣는다 */
export function formatPhone(v: string) {
  const d = digitsOnly(v).slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "성함을 2자 이상 입력해 주세요").max(30, "성함이 너무 깁니다"),

    // 저장·검증은 숫자만으로 한다. 화면 표시만 하이픈을 넣는다.
    phone: z
      .string()
      .transform(digitsOnly)
      .refine((v) => /^01[016789]\d{7,8}$/.test(v), "휴대폰 번호를 정확히 입력해 주세요"),

    // 연락처 바로 밑에 둔다(노션 「반오토 폼양식 수정」 2026-09-04). 필수다 —
    // 언제 걸어야 받는지 모르면 담당자가 헛걸음한다.
    callTime: z.enum(CALL_TIMES, { message: "연락 가능한 시간대를 선택해 주세요" }),

    storeType: z.enum(STORE_TYPES, { message: "매장 업종을 선택해 주세요" }),

    sido: z.string().min(1, "시·도를 선택해 주세요"),
    sigungu: z.string().min(1, "시·군·구를 선택해 주세요"),

    storeCount: z.enum(STORE_COUNTS, { message: "운영 매장 수를 선택해 주세요" }),

    // 선택 항목 — 빈 문자열을 허용한다
    visits: z.union([z.enum(VISIT_OPTIONS), z.literal("")]).optional(),
    message: z.string().trim().max(500, "500자 이내로 입력해 주세요").optional(),
    referrer: z.union([z.enum(REFERRERS), z.literal("")]).optional(),
    // 유입 경로가 "기타"일 때만 쓰는 직접 입력. 개인정보가 아니라 채널 이름을 받는 칸이다
    referrerDetail: z.string().trim().max(50, "50자 이내로 입력해 주세요").optional(),

    // 필수 동의는 true 만 통과시킨다
    agreePrivacy: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요" }),
    // 선택 동의. 기본값은 반드시 false 다(개인정보보호법 — 사전 체크 금지)
    agreeMarketing: z.boolean().default(false),
  })
  // 시·도와 시·군·구의 조합이 실제로 존재하는지까지 본다.
  // 각각만 검사하면 "서울특별시 + 기장군" 같은 조합이 통과한다.
  .refine((v) => isValidRegion(v.sido, v.sigungu), {
    message: "선택하신 지역 조합을 확인해 주세요",
    path: ["sigungu"],
  })
  // 직접 입력은 "기타"를 골랐을 때만 의미가 있다. 화면에서 지워도 값이 남아
  // 넘어올 수 있으므로(선택을 되돌린 경우) 서버 파싱 단계에서 함께 버린다.
  .transform((v) => (v.referrer === "기타" ? v : { ...v, referrerDetail: undefined }));

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
