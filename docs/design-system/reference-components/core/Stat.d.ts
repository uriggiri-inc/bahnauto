/**
 * 단일 수치 지표. 검증된 실측값에만 쓴다 (표시광고법).
 */
export interface StatProps {
  /** 이미 3자리 구분 포맷된 문자열 — Intl.NumberFormat('ko-KR') */
  value: string | number;
  unit?: string;
  label: string;
  tone?: "default" | "onDark";
  align?: "left" | "center";
}
export declare function Stat(props: StatProps): JSX.Element;
