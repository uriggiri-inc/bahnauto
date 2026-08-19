/**
 * 동의 체크박스 및 복수 선택.
 * 마케팅 수신 동의는 반드시 필수 동의와 분리하고 초기 상태 해제 (개인정보보호법).
 */
export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label: string;
  /** 수집 항목 / 이용 목적 / 보유 기간 요약을 같은 화면에서 보여줄 때 */
  description?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  id?: string;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
