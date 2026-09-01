/**
 * 검색 노출 관련 **단일 스위치**.
 *
 * ── 왜 한 곳에 모으는가 ──
 * 이전 판에서는 검색 차단 지시가 두 곳에서 서로 반대를 말했다 —
 * `layout.tsx` 는 "색인해라", Cloudflare 용 `public/_headers` 는 "하지 마라"
 * (SEO 감사 X-14 치명 항목). 헤더가 이겨서 실제로는 막혔지만, 어긋난 상태
 * 자체가 사고다. 오픈할 때 한쪽만 고치면 반대 결과가 나온다.
 *
 * 이제 `SEARCH_OPEN` 하나가 `robots.ts` 와 페이지 메타데이터를 동시에 정한다.
 *
 * ── GitHub Pages 에서는 이 상수가 **유일한** 차단 수단이다 ──
 * `public/_headers` 는 **Cloudflare Pages 전용 기능**이라 이 저장소에는 없다.
 * GitHub Pages 는 응답 헤더를 설정할 방법을 주지 않는다. 즉 `X-Robots-Tag` 로
 * 이중 방어를 할 수 없고, `robots.txt` + 페이지 `noindex` 가 전부다.
 * **그래서 이 상수를 켜는 순간이 곧 공개다** — 되돌릴 안전망이 하나 적다.
 */

/**
 * 운영 도메인. 2026-08-19 확정 (X-05 해소).
 *
 * 끝에 슬래시를 붙이지 않는다 — `new URL(path, SITE_URL)` 로 이어붙일 때
 * 이중 슬래시가 생긴다.
 *
 * ⚠️ `www.bahnauto.kr` 는 이 주소로 넘긴다(Cloudflare 리다이렉트). 정본은
 *    apex 다 — 두 주소가 다 열려 있으면 검색엔진이 평가를 나눠 갖는다.
 */
export const SITE_URL = "https://bahnauto.kr";

/**
 * 검색엔진에 열려 있는가. **오픈의 마지막 스위치다**(현황판 X-07).
 *
 * `false` 인 동안:
 *   · `robots.txt` 가 전 경로를 막는다
 *   · 모든 페이지 메타데이터가 `noindex, nofollow` 를 낸다
 *
 * ⚠️ 이 상수 하나만 바꾸면 `robots.txt` 와 전 페이지 메타데이터가 함께 열린다.
 *    따로 손댈 파일이 없다 — 그만큼 **한 줄의 무게가 크다.**
 *
 * 켜기 전에 끝나야 하는 것(현황판 X-01~06): 약관 개정 · 개인정보처리방침
 * 수집 항목 일치 · 국외이전 고지 · 실제 데이터 교체.
 * (통신판매업신고번호는 2026-09-01 확정·기재되어 목록에서 빠졌다)
 * 지금 켜면 검증되지 않은 샘플 요금·후기가 검색결과에 남는다.
 */
export const SEARCH_OPEN = false;

/** 페이지 메타데이터에 그대로 넣는 `robots` 값 */
export const ROBOTS_META = SEARCH_OPEN
  ? { index: true, follow: true }
  : { index: false, follow: false };

/**
 * 사이트맵·canonical 에 쓰는 절대 주소.
 *
 * `trailingSlash: true`(next.config.ts) 라 실제로 서빙되는 주소는 끝에 슬래시가
 * 붙는다. 사이트맵이 슬래시 없는 주소를 내면 **검색엔진이 리다이렉트를 한 번
 * 거치는 주소 목록**을 받게 된다. 여기서 맞춰 준다.
 */
export function absoluteUrl(path: string): string {
  if (path === "/") return `${SITE_URL}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean.endsWith("/") ? clean : `${clean}/`}`;
}

/**
 * 검색엔진 소유 확인 코드.
 *
 * ── 이게 없으면 어떻게 되나 ──
 * **네이버는 서치어드바이저에 등록하지 않으면 사실상 노출되지 않는다.** 구글은
 * 등록 없이도 언젠가 색인하지만 서치콘솔이 없으면 색인 요청도, 문제 확인도 못
 * 한다. `SEARCH_OPEN` 을 켜는 날 바로 색인을 요청할 수 있게 미리 확인만 끝내
 * 두는 자리다.
 *
 * ── 값은 비밀이 아니다 ──
 * 이 코드는 HTML 소스에 그대로 노출되는 **공개 식별자**다. 비밀번호나 API 키가
 * 아니므로 저장소에 커밋해도 된다(`CLAUDE.md` §1.1 S1 대상이 아니다). 다른
 * 사람이 이 값을 알아도 우리 검색 데이터에 접근할 수 없다 — 소유 확인은
 * "이 사이트에 태그를 넣을 권한이 있었다" 만 증명한다.
 *
 * ── 채우는 곳 ──
 * | 엔진 | 어디서 받나 |
 * |---|---|
 * | `naver` | 서치어드바이저 → 사이트 등록 → 소유확인 → **HTML 태그** 방식 |
 * | `google` | 서치콘솔 → 속성 추가 → URL 접두어 → **HTML 태그** 방식 |
 * | `bing` | 빙 웹마스터도구 → 가져오기(서치콘솔 연동) 또는 HTML 태그 |
 *
 * 태그 전체(`<meta ... />`)가 아니라 **`content` 안의 값만** 넣는다.
 *
 * ⚠️ 빈 문자열이면 그 메타태그를 아예 내지 않는다. `content=""` 인 태그는
 *    확인이 실패하고 소스만 지저분해진다.
 *
 * ⚠️ 파일 업로드 방식(`naverXXXX.html` 을 루트에 두기)도 있지만 쓰지 않는다.
 *    정적 빌드는 `public/` 에 둔 파일을 그대로 내보내므로 동작은 하지만,
 *    확인 수단이 코드와 파일 두 곳으로 갈라진다.
 */
export const SITE_VERIFICATION = {
  /** 네이버 서치어드바이저 — 한국 노출의 전제 조건 */
  naver: "",
  /** 구글 서치콘솔 */
  google: "",
  /** 빙 웹마스터도구 */
  bing: "",
} as const;

/**
 * 채워진 것만 골라 Next 의 `metadata.verification` 형태로 돌려준다.
 *
 * 전부 비어 있으면 `undefined` 를 돌려 `verification` 키 자체가 나가지 않게 한다.
 */
export function verificationMeta() {
  const other: Record<string, string> = {};
  if (SITE_VERIFICATION.naver) other["naver-site-verification"] = SITE_VERIFICATION.naver;
  // 빙은 표준 이름이 `msvalidate.01` 이다. Next 에 전용 필드가 없어 other 로 넣는다
  if (SITE_VERIFICATION.bing) other["msvalidate.01"] = SITE_VERIFICATION.bing;

  const hasGoogle = Boolean(SITE_VERIFICATION.google);
  if (!hasGoogle && Object.keys(other).length === 0) return undefined;

  return {
    ...(hasGoogle && { google: SITE_VERIFICATION.google }),
    ...(Object.keys(other).length > 0 && { other }),
  };
}
