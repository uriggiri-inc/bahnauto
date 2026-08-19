/** 모바일 하단 고정 2분할 CTA — 스크롤 400px 이후 등장. 채널톡 위젯과 겹치지 않게 오프셋한다. */
export interface MobileStickyCTAProps {
  telLabel?: string;
  ctaLabel?: string;
  onTel?: () => void;
  onCta?: () => void;
  visible?: boolean;
}
export declare function MobileStickyCTA(props: MobileStickyCTAProps): JSX.Element;
