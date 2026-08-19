/** 카드형 라디오 그룹 — 이동 수단, 관련 경력 등 짧은 배타 선택. */
export interface RadioProps {
  name: string;
  options?: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** 그리드 열 수 */
  columns?: number;
}
export declare function Radio(props: RadioProps): JSX.Element;
