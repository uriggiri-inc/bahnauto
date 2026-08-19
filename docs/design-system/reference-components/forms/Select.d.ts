/** 네이티브 select 기반 드롭다운 — 업종·지역·매장 수 등. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<string | { value: string; label: string }>;
  placeholder?: string;
  invalid?: boolean;
}
export declare function Select(props: SelectProps): JSX.Element;
