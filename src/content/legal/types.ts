/**
 * 법정 문서(이용약관·개인정보처리방침) 표현 형식.
 *
 * ⚠️ **원본 문서의 문장을 고치지 않는다.** 읽기 좋게 다듬고 싶어도 안 된다 —
 * 법무 검토를 거친 문장이고, 화면에서만 달라지면 어느 쪽이 진본인지 알 수 없게 된다.
 * 여기서는 구조(조·항·표)만 표현하고 텍스트는 그대로 옮긴다.
 */

/** 문단, 들여쓴 호 목록, 또는 표 */
export type LegalBlock =
  | string
  | { list: readonly string[] }
  | { table: { head: readonly string[]; rows: readonly (readonly string[])[] } };

/** 조(條) 하나 */
export type LegalSection = {
  /** 예: "제1조 (목적)" */
  heading: string;
  blocks: readonly LegalBlock[];
};

/** 장(章) — 약관에만 있다 */
export type LegalChapter = {
  /** 예: "제1장 총칙". 장 구분이 없는 문서는 생략한다 */
  heading?: string;
  sections: readonly LegalSection[];
};

export type LegalDoc = {
  title: string;
  /** 본문 앞 도입 문단 */
  intro?: readonly string[];
  chapters: readonly LegalChapter[];
  /** 부칙·시행일 등 문서 끝 블록 */
  appendix?: { heading: string; blocks: readonly LegalBlock[] };
};
