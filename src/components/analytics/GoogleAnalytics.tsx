import { ANALYTICS_HOSTS, GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * GA4 (gtag.js) 로더 — **호스트 검사를 브라우저의 평범한 JS 로 한다.**
 *
 * ── 허용된 호스트가 아니면 요청 자체가 나가지 않는다 ──
 * `gtag('config', ...)` 만 건너뛰는 방식으로 만들면 `googletagmanager.com` 요청은
 * 그대로 나가고, GA4 는 그 요청만으로도 세션을 만든다. 그래서 아래 스크립트는
 * **`if` 안에서 `<script>` 를 만들어 붙인다** — 호스트가 맞지 않으면 그 줄에
 * 도달하지 않으므로 네트워크 요청이 생기지 않는다.
 *
 * ── React 를 경유하지 않는 이유 (2026-08-31 재작성) ──
 * 이전 판은 클라이언트 컴포넌트에서 `useSyncExternalStore` 로 호스트를 읽고,
 * 허용될 때만 `next/script`(`afterInteractive`)를 렌더했다. 그러면 GA 로드가
 * **하이드레이션에 매달린다.**
 *   · 하이드레이션이 끝나기 전에 떠난 방문자는 집계에 아예 잡히지 않는다.
 *     이탈이 빠른 랜딩에서 그 구간이 제일 아깝다
 *   · 서버 스냅샷이 `false` 라 정적 HTML 에는 태그가 없고, 실제로
 *     **`bahnauto.kr` 라이브에서 `dataLayer`·`gtag`·스크립트 태그가 모두
 *     없는 상태**를 확인했다
 *   · 같은 훅 패턴(알리지 않는 `subscribe`)이 소개서 다운로드에서도 화면을
 *     초기 상태에 멈추게 한 적이 있다
 *
 * 지금은 **정적 HTML 에 인라인 스크립트가 그대로 실려** 파싱 즉시 실행된다.
 * React·하이드레이션·번들과 무관하므로 실패할 지점이 없다.
 *
 * ⚠️ `dangerouslySetInnerHTML` 을 쓰지만 넣는 값은 **빌드 시점 상수**다
 *    (측정 ID와 호스트 목록). `CLAUDE.md` §1.1 S5 가 금지하는 것은 **사용자
 *    입력**을 여기 넣는 것이다 — 사용자 입력은 이 경로에 들어오지 않는다.
 *    `next/script` 를 쓰지 않은 이유: `afterInteractive` 는 Next 클라이언트
 *    런타임이 주입하므로 다시 하이드레이션에 의존하게 된다.
 *
 * ⚠️ 라우트 이동에서 `page_view` 를 직접 보내지 않는다. GA4 향상된 측정의
 *    "브라우저 기록 이벤트 기반 페이지 변경"이 기본으로 켜져 있어 수동으로 쏘면
 *    조회수가 두 배로 잡힌다.
 *
 * ⚠️ 측정 ID·허용 호스트의 정본은 `lib/analytics.ts` 하나다. 여기에 값을 직접
 *    적지 않는다 — 두 곳에 적으면 도메인을 바꿀 때 한쪽만 고쳐진다.
 *
 * ── 전환 이벤트 계측 (2026-09-04) ──
 * 이벤트 이름과 GA4 등록이 짝을 이룬다 — 이름을 바꾸면 GA4 관리 화면의
 * 키 이벤트·맞춤 측정기준도 함께 바꿔야 한다.
 *   · phone_click / cta_click — 아래 위임 클릭 리스너
 *   · contact_submit 등 4종 — 코드가 아니라 GA4 이벤트 생성 규칙
 *     (완료 페이지 page_view → *_submit)이 만든다
 *   · 매개변수: link_text(버튼 문구)·link_location(data-ga-loc 속성)·
 *     form_id — 셋 다 이벤트 범위 맞춤 측정기준으로 등록돼 있다
 * 카카오 상담·채널톡은 2026-09-04 폐기 확인 — 계측하지 않는다.
 */

/*
  `JSON.stringify` 로 직렬화한다. 문자열을 손으로 이어 붙이면 값에 따옴표가
  섞이는 순간 스크립트가 깨진다 — 지금 값에는 없지만 도메인이 늘어날 때를 위한
  안전장치다.
*/
const SNIPPET = `
(function(){
  if (${JSON.stringify(ANALYTICS_HOSTS)}.indexOf(location.hostname) === -1) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)});
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${JSON.stringify(GA_MEASUREMENT_ID)};
  document.head.appendChild(s);

  /*
    전환 이벤트 — 위임 리스너 하나로 사이트 전체를 덮는다.
    tel: 링크와 폼 진입 링크는 여러 컴포넌트에 흩어져 있고 앞으로도 늘어난다.
    컴포넌트마다 onClick 을 다는 대신 문서 레벨에서 잡으면 새 링크가 생겨도
    계측이 저절로 따라온다.

    link_text 만으로는 같은 문구의 버튼(모바일 메뉴 CTA 와 하단 고정 바 CTA 가
    둘 다 "무료 방문 진단")이 구분되지 않는다 — 그래서 가장 가까운 조상의
    data-ga-loc 속성을 link_location 으로 함께 보낸다. 위치를 구분해야 하는
    컨테이너에만 붙인다(하단 고정 바, 모바일 메뉴).
  */
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var label = (a.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 100);
    var locEl = a.closest('[data-ga-loc]');
    var params = { link_text: label };
    if (locEl) params.link_location = locEl.getAttribute('data-ga-loc');
    if (href.indexOf('tel:') === 0) {
      params.link_url = href;
      gtag('event', 'phone_click', params);
      return;
    }
    /*
      4대 폼 진입 클릭 — 도입 상담(/contact)·소개서(/brochure)·매니저 지원
      (/careers)·무료체험(/trial) 페이지로 들어가는 모든 내부 링크를 잡는다.
      완료 페이지(/contact/complete 등)로 가는 링크는 폼 진입이 아니므로
      정확 일치·하위 경로 없는 형태만 본다.
    */
    var m = href.match(/^\\/(contact|brochure|careers|trial)\\/?(?:[?#]|$)/);
    if (m) {
      params.form_id = m[1];
      gtag('event', 'cta_click', params);
    }
  }, true);
})();
`;

export function GoogleAnalytics() {
  return <script id="ga4" dangerouslySetInnerHTML={{ __html: SNIPPET }} />;
}
