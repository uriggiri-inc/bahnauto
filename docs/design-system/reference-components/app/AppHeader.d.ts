/** 앱 화면 상단 바 — 제목 + 보조 문구 + 우측 액션. */
export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}
export declare function AppHeader(props: AppHeaderProps): JSX.Element;
