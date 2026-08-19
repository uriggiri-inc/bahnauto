/**
 * 모바일 하단 고정 CTA 가 등장하는 스크롤 임계값(px).
 *
 * Header 와 MobileStickyCTA 가 이 값을 공유한다.
 * 이 지점을 넘으면 하단 바가 올라오고, **동시에 헤더의 CTA 는 사라진다** —
 * 같은 전환 경로가 화면에 두 번 있으면 안 되기 때문이다.
 * 반대로 이 지점 전에는 헤더 CTA 가 유일한 전환 경로이므로 반드시 보여야 한다.
 */
export const STICKY_CTA_THRESHOLD = 400;
