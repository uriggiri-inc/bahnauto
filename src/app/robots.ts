import type { MetadataRoute } from "next";
import { SEARCH_OPEN, SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * `robots.txt` — 크롤러에게 무엇을 읽어도 되는지 알린다.
 *
 * `SEARCH_OPEN`(`lib/seo.ts`) 하나가 열림·닫힘을 정한다. 페이지 메타데이터의
 * `robots` 값도 같은 상수를 읽으므로 **두 지시가 어긋날 수 없다** — 이전에는
 * 메타데이터는 "색인해라", 헤더는 "하지 마라" 였다(SEO 감사 X-14).
 *
 * ── 닫혀 있을 때 왜 `Disallow: /` 인가 ──
 * 이미 색인된 페이지를 **빼는** 상황이라면 크롤링을 막으면 안 된다 — 크롤러가
 * `noindex` 를 읽지 못해 색인에 남는다. 지금은 그 반대다. **아직 아무것도
 * 색인되지 않았으므로** 아예 들어오지 못하게 막는 것이 맞다.
 *
 * ── 닫혀 있어도 `sitemap` 을 적는 이유 ──
 * 적어 두면 오픈 스위치 하나로 끝난다. 막혀 있는 동안 크롤러는 이 줄을 읽고도
 * `Disallow` 때문에 사이트맵을 가져가지 않는다.
 *
 * ── 내부 화면 ──
 * 열려 있을 때도 `/design-system` 과 `/lab` 은 막는다. 링크로 연결돼 있지
 * 않지만 주소를 알면 열리고, 두 화면은 검증용이라 검색결과에 있을 이유가 없다.
 */
/*
  ⚠️ **정적 내보내기에 필수다.** 없으면 `output: "export"` 빌드가
     `export const dynamic = "force-static" ... not configured on route` 로 **실패**한다.
     Next 는 메타데이터 라우트를 기본적으로 동적으로 보기 때문이다.

     일반 `next build` 는 이것 없이도 통과한다 — 그래서 로컬에서만 확인하면
     놓친다. Cloudflare Pages 는 `CF_PAGES=1` 을 넣어 정적 모드로 빌드하므로
     **배포가 깨진다.** 반드시 `npm run build:static` 으로 함께 확인한다.
*/
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!SEARCH_OPEN) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: absoluteUrl("/sitemap.xml").replace(/\/$/, ""),
      host: SITE_URL,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design-system/", "/lab/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml").replace(/\/$/, ""),
    host: SITE_URL,
  };
}
