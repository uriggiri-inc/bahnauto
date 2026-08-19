/**
 * 반오토 주요기능 8종 — **확정본**이다.
 *
 * 명칭은 기획서(`페이지 별 포함 내용`)의 표를 그대로 옮겼다. 같은 문서 안에
 * 옛 명칭("즉시대응", "B2C 고객센터", "프로그램 사용")이 남아 있지만 그쪽은
 * 이전 판이다. **화면에는 이 파일의 이름만 쓴다** — 섹션마다 다르게 부르면
 * 같은 기능인지 알 수 없다.
 *
 * ⚠️ 여기 값은 더미가 아니다. `dummy.ts` 게이트와 무관하게 항상 노출된다.
 *    금액은 이 파일에 두지 않는다 — 요금은 `plans.ts` 가 정본이다.
 */

import type { ServiceIconName } from "@/components/marketing/serviceIcons";

export type Feature = {
  /** 요금제 구성과 SNB 앵커가 이 키로 기능을 가리킨다 */
  key: string;
  /** 기획서 표의 "메뉴" 열 */
  title: string;
  /** 카드 한 줄 요약 */
  summary: string;
  /** 기획서 표의 "포함 항목" 열 */
  bullets: readonly string[];
  icon: ServiceIconName;
};

export const FEATURES: readonly Feature[] = [
  {
    key: "dashboard",
    title: "운영 대시보드(PC/모바일)",
    summary: "매장에서 일어난 일이 한 화면에 모입니다",
    bullets: ["업무 체크리스트", "직원 출퇴근 관리", "재고 관리", "매장 게시판"],
    icon: "checklist",
  },
  {
    key: "manager-support",
    title: "매니저 지원센터",
    summary: "매니저가 막히면 본사가 받습니다",
    bullets: ["챗봇 1차 응대", "본사 고객센터 연결"],
    icon: "manager",
  },
  {
    key: "docs",
    title: "인허가·서류 관리",
    summary: "기한을 놓쳐 과태료가 나오는 일을 막습니다",
    bullets: [
      "인허가 만료 알림",
      "소방·안전·시설·보험 서류 관리",
      "근로계약서·보건증 등 직원 서류 관리",
    ],
    icon: "admin",
  },
  {
    key: "ops-support",
    title: "경영지원",
    summary: "매니저를 뽑고 관리하는 일까지 맡습니다",
    bullets: ["매니저 관리", "발주 지원"],
    icon: "stock",
  },
  {
    key: "dispatch",
    /*
      사용자 지시(2026-08-19) — `바로출동서비스` → `방문관리 서비스`.
      화면에 보이는 이름만 바꾼다. `key` 는 주소(`/features/dispatch`)이자
      요금표·아이콘·더미데이터의 참조 키다. 바꾸면 이미 나간 링크가 죽고
      sitemap 도 어긋난다.
    */
    title: "방문관리 서비스",
    summary: "고장 났을 때 부를 곳을 찾지 않아도 됩니다",
    bullets: [
      "외부 전문 관리 업체와 협업",
      "정기 시설관리 및 유지보수",
      "비수기 냉난방시설 점검 지원",
    ],
    icon: "dispatch",
  },
  {
    key: "b2c",
    title: "매장 고객 응대센터",
    summary: "매장 이용고객의 문의를 대신 받습니다",
    bullets: ["매장 이용고객 대상 고객센터"],
    icon: "support",
  },
  {
    key: "revenue",
    title: "매출관리·홍보지원",
    summary: "숫자를 보고 다음 달에 무엇을 바꿀지 알려드립니다",
    bullets: ["월간 운영 제안 리포트 제공"],
    icon: "report",
  },
  {
    key: "place",
    title: "네이버 플레이스 관리",
    summary: "검색으로 들어오는 손님을 놓치지 않습니다",
    bullets: ["네이버플레이스 예약 셋팅 및 운영 관리", "마케팅·홍보 지원"],
    icon: "place",
  },
];

/** 기능 키로 빠르게 찾는다 — 요금제 카드가 기능 목록을 그릴 때 쓴다 */
export const FEATURE_BY_KEY = Object.fromEntries(FEATURES.map((f) => [f.key, f])) as Record<
  string,
  Feature
>;
