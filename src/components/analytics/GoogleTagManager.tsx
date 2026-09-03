import { ANALYTICS_HOSTS, GTM_CONTAINER_ID } from "@/lib/analytics";

/**
 * GTM (gtm.js) 로더 — `GoogleAnalytics.tsx` 와 같은 구조다.
 * 정적 HTML 에 인라인으로 실려 파싱 즉시 실행되고, 허용 호스트가 아니면
 * `googletagmanager.com` 요청 자체가 나가지 않는다. 그 이유들(하이드레이션
 * 의존 금지, 호스트 가드 방식)은 GoogleAnalytics.tsx 상단 주석이 정본이다.
 *
 * ── GA4 와의 역할 분담 ──
 * GA4 기본 수집은 옆의 gtag 인라인 로더가 담당한다(2026-09-01 검증 완료).
 * 이 컨테이너는 **서드파티 픽셀(네이버·메타·카카오)과 전환 이벤트 태그 전용**이다.
 * 컨테이너 안에 GA4 구성 태그를 만들면 page_view 가 두 번씩 잡힌다 — 만들지
 * 않는다(`lib/analytics.ts` 의 GTM_CONTAINER_ID 주석 참조).
 *
 * ── 표준 스니펫의 noscript iframe 을 넣지 않는 이유 ──
 * noscript 는 HTML 이라 호스트 가드를 걸 수 없다 — 넣으면 프리뷰·로컬에서도
 * (JS 꺼진 방문에 한해) GTM 요청이 나가 "허용 호스트 밖에서는 요청 자체가
 * 없다"는 이 사이트의 수집 원칙이 깨진다. noscript 가 하는 일은 JS 꺼진
 * 브라우저에서의 픽셀 발화뿐인데, 우리가 실을 태그는 전부 JS 기반이라 잃는
 * 것이 없다.
 */

const SNIPPET = `
(function(){
  if (${JSON.stringify(ANALYTICS_HOSTS)}.indexOf(location.hostname) === -1) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + ${JSON.stringify(GTM_CONTAINER_ID)};
  document.head.appendChild(s);
})();
`;

export function GoogleTagManager() {
  return <script id="gtm" dangerouslySetInnerHTML={{ __html: SNIPPET }} />;
}
