/**
 * GA4 수집 게이트.
 *
 * ── 왜 빌드타임 환경변수가 아니라 런타임 호스트 검사인가 ─────────────
 * 같은 산출물이 여러 곳에 배포된다. Cloudflare Pages 는 브랜치마다
 * `<해시>.banauto.pages.dev` 프리뷰를 자동으로 띄우고, 로컬은 localhost,
 * Workers 프리뷰는 또 다른 호스트다. 빌드 시점 플래그로 끄면 "프리뷰용
 * 빌드"와 "운영용 빌드"를 사람이 구분해 만들어야 하는데, 그 구분은
 * 언젠가 어긋난다(이번 배포 404 가 정확히 그 사고였다).
 *
 * 호스트를 런타임에 보면 산출물이 하나여도 운영 도메인에서만 켜진다.
 *
 * ── 서브도메인을 왜 허용하지 않나 ────────────────────────────────────
 * `endsWith(".banauto.pages.dev")` 로 적으면 프리뷰 배포가 전부 통과한다.
 * 프리뷰에는 더미 요금표와 가짜 후기가 올라가 있어 그 트래픽이 섞이면
 * 리포트가 오염된다. 정확히 일치하는 호스트만 허용한다.
 */

/**
 * GA4 측정 ID. 페이지 소스에 그대로 노출되는 공개 값이라 시크릿이 아니다.
 *
 * 2026-09-03 uriggirikids@gmail.com 소유의 새 속성(계정 "반오토" › 속성
 * "반오토 홈페이지" › 스트림 "반오토 웹")으로 교체했다. 이전 속성
 * G-5TRWDY543B 는 소유 계정을 알 수 없게 되어 **폐기**했다 — 옛 문서·리포트에
 * 그 ID 가 남아 있어도 되살리지 않는다. 8/19~9/3 데이터는 새 속성으로
 * 이어지지 않는다(검색 차단 상태의 내부 트래픽 위주라 버리기로 결정).
 */
export const GA_MEASUREMENT_ID = "G-B6FESGW357";

/**
 * GTM 컨테이너 ID. 역시 공개 값이다.
 *
 * 2026-09-03 uriggirikids@gmail.com 소유로 새로 만든 컨테이너다(GTM 계정
 * "반오토" › 컨테이너 "www.bahnauto.kr"). 데모 시절 컨테이너 GTM-T73WDBVS 는
 * 소유 계정을 알 수 없게 되어 **사이트에 붙여보지도 못하고 폐기**했다 — 그
 * ID 가 옛 문서에 남아 있어도 쓰지 않는다.
 *
 * ⚠️ GA4 의 정본은 위 gtag 인라인 로더다. **GTM 컨테이너 안에 GA4 구성
 *    태그(Google 태그)를 만들지 않는다** — 만들면 page_view 가 두 번씩 잡힌다.
 *    컨테이너는 서드파티 픽셀과 전환 이벤트 태그 전용이다.
 */
export const GTM_CONTAINER_ID = "GTM-MWCWK27H";

/**
 * 수집을 허용하는 호스트. **정확히 일치**해야 한다.
 *
 * ── 운영 도메인으로 교체했다 (2026-08-19, X-05 확정) ──
 * 이전 값은 `["banauto.pages.dev"]` 하나였다. 운영이 `bahnauto.kr` 로 옮겨가면서
 * **pages.dev 를 목록에서 뺐다** — 같은 배포가 두 주소로 열려 있으므로 남겨 두면
 * 테스트·확인 트래픽이 운영 리포트에 섞인다. 이제 pages.dev 는 사실상 프리뷰다.
 *
 * `www.bahnauto.kr` 를 함께 넣은 것은 안전장치다. 정본은 apex 이고 www 는
 * apex 로 리다이렉트되므로 실제로는 발화하지 않는다 — 다만 리다이렉트 설정이
 * 빠진 날 www 유입이 통째로 집계에서 사라지는 것을 막는다.
 *
 * ⚠️ 도메인을 또 바꾸면 `lib/seo.ts` 의 `SITE_URL` 과 **함께** 고친다.
 *    한쪽만 고치면 사이트맵과 집계가 서로 다른 도메인을 말한다.
 */
export const ANALYTICS_HOSTS: readonly string[] = ["bahnauto.kr", "www.bahnauto.kr"];

/**
 * 지금 이 브라우저에서 GA4 를 로드해도 되는가.
 *
 * 서버 렌더 중에는 `window` 가 없으므로 항상 false 다. 이건 의도된 것이고,
 * 클라이언트에서 마운트된 뒤 다시 판정한다.
 */
export function isAnalyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  return ANALYTICS_HOSTS.includes(window.location.hostname);
}
