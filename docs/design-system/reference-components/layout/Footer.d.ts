/**
 * 4단 푸터 + 법정 사업자 정보 블록. 개인정보처리방침 링크는 굵게 강조한다(법적 권고).
 */
export interface FooterProps {
  /** 슬로건형 dark 로고 경로 */
  logoSrc: string;
  columns?: Array<{ title: string; links: string[] }>;
  /** 상호명·대표자·사업자등록번호·주소·개인정보보호책임자·대표전화 등 */
  business?: Array<{ label: string; value: string }>;
  copyright?: string;
}
export declare function Footer(props: FooterProps): JSX.Element;
