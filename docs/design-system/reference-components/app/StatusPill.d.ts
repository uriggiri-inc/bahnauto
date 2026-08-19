/** 매장관리 앱의 상태 라벨 — 재고 상태, 출퇴근 상태, 발주 단계. */
export interface StatusPillProps {
  status?: "normal" | "working" | "soon" | "discard" | "done" | "pending";
  /** 기본 라벨을 덮어쓸 때 */
  label?: string;
}
export declare function StatusPill(props: StatusPillProps): JSX.Element;
