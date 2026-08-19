/** 체크리스트 진행률 표시. 항목 완료 시 자동 반영된다. */
export interface ProgressBarProps {
  /** 0–100 */
  value?: number;
  label?: string;
  showValue?: boolean;
  height?: number;
  tone?: "brand" | "success";
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
