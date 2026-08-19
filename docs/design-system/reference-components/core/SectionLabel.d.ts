/** 섹션 상단의 짧은 명사구 레이블 (13.5px / 600 / 0.06em). */
export interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "brand" | "muted" | "onDark";
  children?: React.ReactNode;
}
export declare function SectionLabel(props: SectionLabelProps): JSX.Element;
