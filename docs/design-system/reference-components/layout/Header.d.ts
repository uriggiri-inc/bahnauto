/**
 * Sticky GNB. 높이 72px, rgba(255,255,255,.9) + blur(10px).
 * [도입 문의] 버튼은 모바일에서도 햄버거 안에 숨기지 않는다 (1순위 전환).
 * @startingPoint section="Layout" subtitle="Sticky GNB — 데스크톱 + 모바일 오버레이" viewport="1120x120"
 */
export interface HeaderProps {
  /** 워드마크형 로고 경로. 다크 배경에는 -dark 버전. 높이 24px 이상, 가로 36px 미만 축소 금지 */
  logoSrc: string;
  nav?: Array<{ label: string; href: string }>;
  util?: Array<{ label: string; href: string }>;
  /** 현재 경로 — 해당 nav 항목이 브랜드 컬러로 표시된다 */
  active?: string;
  onNavigate?: (href: string) => void;
  /** 모바일 레이아웃 (햄버거 + 풀스크린 오버레이) */
  compact?: boolean;
}
export declare function Header(props: HeaderProps): JSX.Element;
