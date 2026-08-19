/**
 * 앱 스크린샷용 폰 프레임 (radius 24, 1px 보더, 플랫 카드 섀도우).
 * 실사 목업 그림자·베젤 렌더링은 쓰지 않는다.
 */
export interface PhoneFrameProps {
  /** 기본 280 — 390×844 비율로 높이가 계산된다 */
  width?: number;
  caption?: string;
  children?: React.ReactNode;
}
export declare function PhoneFrame(props: PhoneFrameProps): JSX.Element;
