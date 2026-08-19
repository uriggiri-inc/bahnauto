import type { MetadataRoute } from "next";
import { FEATURES } from "@/content/features";
import { absoluteUrl } from "@/lib/seo";

/**
 * `sitemap.xml` — 검색엔진에 줄 페이지 목록.
 *
 * 정적 내보내기(`output: "export"`)에서도 빌드 때 파일로 생성된다.
 *
 * ── 무엇을 넣지 않는가 ──
 * 사이트맵은 "이 주소들을 색인해 달라"는 요청이다. 색인되면 안 되는 것을 넣으면
 * 요청과 차단이 서로를 부정한다.
 *
 * | 제외 | 이유 |
 * |---|---|
 * | `/design-system` · `/lab/*` | 내부 검증 화면. 링크로 연결돼 있지도 않다 |
 * | 완료 화면 (`/contact/complete` 등 4곳) | 폼 제출 후 감사 화면. 검색으로 들어올 자리가 아니다 |
 * | `/features` | 1번 기능으로 넘기는 통로다. 8개 상세를 따로 넣는다 |
 * | `/company` | **지금 어디에서도 링크되지 않는다** — 푸터·홈 버튼이 모두 운영사
 *   홈페이지(uriggiri.kr)로 나가면서 끊겼다(2026-08-18). 링크 없는 페이지를
 *   사이트맵으로만 밀어 넣으면 품질 신호가 나빠진다. 다시 링크하면 여기 넣는다 |
 *
 * ── `priority` · `changeFrequency` 를 쓰지 않는 이유 ──
 * 구글은 두 값을 무시한다고 공개적으로 밝혔다. 적어 두면 관리 대상만 늘고
 * "우선순위를 조정했다" 는 착각을 준다. `lastModified` 만 둔다.
 *
 * ⚠️ `SEARCH_OPEN` 이 `false` 인 동안 `robots.txt` 가 전 경로를 막으므로 이
 *    사이트맵은 읽히지 않는다. 그래도 만들어 둔다 — 오픈 스위치를 켜는 순간
 *    바로 동작해야 하고, 그때 급하게 만들면 빠뜨리는 경로가 생긴다.
 */

/** 기능 상세를 뺀 공개 경로. 이 목록에 없는 페이지는 사이트맵에 나가지 않는다 */
const STATIC_PATHS = [
  "/",
  "/pricing",
  "/process",
  "/system",
  "/service",
  "/cases",
  "/faq",
  "/news",
  "/careers",
  "/contact",
  "/trial",
  "/brochure",
  "/app",
  "/terms",
  "/privacy",
];

/*
  ⚠️ **정적 내보내기에 필수다.** 없으면 `output: "export"` 빌드가
     `export const dynamic = "force-static" ... not configured on route` 로 **실패**한다.
     Next 는 메타데이터 라우트를 기본적으로 동적으로 보기 때문이다.

     일반 `next build` 는 이것 없이도 통과한다 — 그래서 로컬에서만 확인하면
     놓친다. Cloudflare Pages 는 `CF_PAGES=1` 을 넣어 정적 모드로 빌드하므로
     **배포가 깨진다.** 반드시 `npm run build:static` 으로 함께 확인한다.
*/
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  /*
    빌드 시각을 그대로 쓴다. 페이지별 실제 수정일을 넣으려면 git 이력을
    읽어야 하는데, 정적 내보내기 빌드 컨테이너에는 얕은 클론만 있어 신뢰할 수
    없다. 잘못된 날짜를 주는 것보다 빌드 날짜가 정직하다.
  */
  const lastModified = new Date();

  return [...STATIC_PATHS, ...FEATURES.map((f) => `/features/${f.key}`)].map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));
}
