/**
 * 주요기능 아이콘 — 홈 기능 섹션과 `/service` 탭이 함께 쓴다.
 *
 * 인라인 SVG 다. 아이콘 라이브러리를 쓰면 이 몇 곳 때문에 클라이언트 번들이
 * 늘어나는데, 아홉 개뿐이라 경로를 직접 들고 있는 편이 싸다.
 *
 * ⚠️ `place` 는 **2026-08-27 기능 7종 재편 이후 쓰는 곳이 없다**(옛 "네이버 플레이스
 *    관리" 카드가 ③ 경영지원으로 합쳐졌다). 지우지 않는 이유는 `Mark.tsx` 의
 *    `underline` 과 같다 — 구성이 다시 바뀔 때 되살리려면 경로를 새로 그려야 한다.
 *    새 카드에 붙일 때는 이 주석을 함께 지운다.
 *    (`report` 는 계속 쓰인다 — `/service` 탭의 "리포트" 영역이 참조한다.)
 *
 * 디자인 시스템 규정: stroke 1.8 / 24×24 viewBox / round cap / 색은 currentColor.
 * **면(fill) 아이콘은 쓰지 않는다.**
 */

export type ServiceIconName =
  | "checklist"
  | "manager"
  | "support"
  | "stock"
  | "admin"
  | "report"
  | "dispatch"
  | "place"
  | "emergency";

const PATHS: Record<ServiceIconName, string> = {
  // 체계적인 매장 관리 — 체크리스트
  checklist:
    "M9 6h11|M9 12h11|M9 18h11|m3 6 1.5 1.5L7.5 4.5|m3 12 1.5 1.5L7.5 10.5|m3 18 1.5 1.5L7.5 16.5",
  // 전담 매니저 — 지정된 사람
  manager:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8|M17 7h5|M19.5 4.5v5",
  // 실시간 고객센터 — 헤드셋
  support:
    "M4 14v-3a8 8 0 0 1 16 0v3|M4 14a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2z|M20 14a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z|M18 16v1a4 4 0 0 1-4 4h-2",
  // 재고·발주 — 상자
  stock: "M21 10V7l-9-5-9 5v10l9 5 9-5v-3|M3 7l9 5 9-5|M12 12v10|M16 15h6",
  // 행정 업무 — 일정
  admin:
    "M8 2v4|M16 2v4|M3 10h18|M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z|m9 16 2 2 4-4",
  // 데일리 리포트 — 막대 그래프
  report:
    "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z|M8 17v-4|M12 17V8|M16 17v-6",
  // 방문관리 서비스 — 공구(스패너)
  dispatch:
    "M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.8 2.8 0 0 1-4-4z|M14.7 6.3 18 3l3 3-3.3 3.3|M7 17h.01",
  // 네이버 플레이스 관리 — 위치 핀
  place: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z|M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  // A/S 바로출동 — 번개 (수정안 목업의 아이콘)
  emergency: "M13 2 4 14h6l-1 8 9-12h-6z",
};

export function ServiceIcon({ name, size = 24 }: { name: ServiceIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name].split("|").map((seg) => (
        <path key={seg} d={seg} />
      ))}
    </svg>
  );
}
