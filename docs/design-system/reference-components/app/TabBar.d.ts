/**
 * 앱 하단 탭 바 — 홈 / 체크리스트 / 출퇴근 / 재고관리 / 게시판 / 발주요청.
 * 아이콘은 Lucide 형태를 인라인 path로 가져온 대체 구현이다 (원본 앱 아이콘 세트 미제공).
 */
export interface TabBarProps {
  items?: Array<{
    id: string;
    label: string;
    icon: "home" | "checklist" | "attendance" | "inventory" | "board" | "order";
  }>;
  value?: string;
  onChange?: (id: string) => void;
}
export declare function TabBar(props: TabBarProps): JSX.Element;
