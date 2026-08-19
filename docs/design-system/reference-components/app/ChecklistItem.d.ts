/**
 * 체크리스트 한 행. 사진 첨부가 필수이므로 사진 0장이면 danger 색으로 경고한다.
 */
export interface ChecklistItemProps {
  /** 항목 번호 — 2자리로 패딩된다 */
  index?: number;
  title: string;
  done?: boolean;
  /** 첨부된 사진 수 (복수 가능) */
  photos?: number;
  /** 특이사항 메모 */
  note?: string;
  onToggle?: () => void;
}
export declare function ChecklistItem(props: ChecklistItemProps): JSX.Element;
