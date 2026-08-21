import type { Metadata, Viewport } from "next";
import { ROBOTS_META, SITE_URL, verificationMeta } from "@/lib/seo";
import "./globals.css";

const SITE_NAME = "반오토 BAHNAUTO";
const SITE_TITLE = `${SITE_NAME} — 무인매장 위탁 관리 서비스`;
const SITE_DESC =
  "자동화되지 않은 나머지 절반, 그 절반을 반오토가 맡습니다. 표준 체크리스트와 사진 기록으로 관리 결과를 매일 증명하는 무인매장 위탁 관리 서비스.";

/**
 * 공유 미리보기 카드 — 카카오톡·네이버·페이스북·X (SEO 감사 X-14).
 *
 * 1200×630 은 카카오톡이 **큰 카드**로 띄우는 규격이다. 더 작으면 제목 옆
 * 작은 정사각 썸네일로 떨어진다.
 *
 * ⚠️ 값은 상대경로다. 절대 주소로 바꿔 주는 것은 위의 `metadataBase` 다 —
 *    **카카오톡은 상대경로 og:image 를 무시한다.** 두 값은 한 묶음이라
 *    `metadataBase` 가 사라지면 이 카드도 함께 죽는다.
 *
 * ⚠️ 카카오톡은 og 값을 캐시한다. 카드를 교체해도 이미 공유된 주소는 옛
 *    이미지를 계속 보여준다. 카카오 개발자센터 → 도구 → **캐시 초기화** 에
 *    주소를 넣어 한 번 비워야 새 카드가 나간다.
 *
 * ⚠️ `SEARCH_OPEN = false` 로 검색이 막혀 있어도 **공유 미리보기는 동작한다** —
 *    카카오·페이스북 크롤러는 `robots.txt` 와 무관하게 og 를 읽는다. 검색
 *    공개(X-07)와 이 항목은 별개다.
 *
 * 자산 생성: `public/brand/logo-slogan-dark.svg`(전부 흰색 락업)를 브랜드
 * 단색 #004ACC 배경 위에 올려 구웠다. 단색인 이유는 카카오톡이 카드를
 * 200~500px 로 줄이는데 그 크기에서 단색이 가장 또렷하고 흰 로고와 대비
 * 8.6:1 이 전면에서 유지되기 때문이다. 로고가 바뀌면 다시 굽는다.
 * 굽는 데 쓴 `sharp` 는 직접 의존성이 아니라 Next 가 끌고 온 것이므로
 * **빌드 단계에 넣지 않았다** — 결과 PNG 만 자산으로 커밋한다.
 */
const OG_IMAGE = {
  url: "/brand/og-cover.png",
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
  type: "image/png",
};

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  /*
    운영 도메인. 2026-08-19 확정(X-05 해소) — 이게 없으면 OG·canonical 이
    상대경로로 나가 공유 미리보기가 깨지고 중복 URL 처리가 안 된다.
    값의 정본은 `lib/seo.ts` 다.
  */
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },
  /*
    `og:url` 은 일부러 넣지 않았다. 여기는 루트 레이아웃이라 값을 넣으면 **전
    페이지의 공유 대상이 홈으로 고정**된다. 비워 두면 카카오·페이스북이 공유된
    주소 자체를 쓰므로 그게 맞는 동작이다.
  */
  /*
    X(구 트위터)만 `twitter:*` 를 먼저 본다 — 없으면 큰 이미지 대신 작은
    썸네일로 떨어진다. 카카오톡·네이버·페이스북은 위 `openGraph` 를 읽는다.
  */
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [OG_IMAGE.url],
  },
  // 아이콘은 Next 파일 컨벤션이 처리한다 — `src/app/favicon.ico`(16/32/48)와
  // `src/app/apple-icon.png`(180). 여기서 `icons` 를 다시 선언하면 그 자동 링크를
  // 덮어쓴다.
  //
  // 예전에는 `icon: "/brand/symbol.svg"` 였는데, 새 로고의 symbol.svg 에는
  // 링 그라디언트가 래스터로 들어 있어 20KB 다. 파비콘은 전 페이지에서
  // 요청되므로 4KB 짜리 .ico 로 돌린다.
  /*
    ⚠️ 값을 여기 직접 적지 않는다. `lib/seo.ts` 의 `SEARCH_OPEN` 이 정본이고
       `robots.ts` 도 같은 상수를 읽는다 — 이전에는 여기가 `index: true` 인데
       Cloudflare 용 `_headers` 는 `noindex` 라 두 지시가 반대였다(X-14 치명).
  */
  robots: ROBOTS_META,
  /*
    검색엔진 소유 확인. 값은 `lib/seo.ts` 의 `SITE_VERIFICATION` 에 넣는다.
    비어 있으면 태그가 아예 나가지 않으므로 지금은 아무것도 추가되지 않는다.

    ⚠️ 확인만 미리 해 두는 것이고 **색인이 시작되는 것은 아니다.** 지금
       `robots.txt` 가 전 경로를 막고 있어 네이버·구글은 "수집 불가" 로 본다.
       `SEARCH_OPEN` 을 켠 뒤에 사이트맵을 제출한다.
  */
  verification: verificationMeta(),
};

export const viewport: Viewport = {
  themeColor: "#004ACC",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: 아래 인라인 스크립트가 하이드레이션 전에
    // data-theme 속성을 붙일 수 있다 — <html> 속성 차이만 무시한다
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        {/* 다크 모드 복원 — 첫 페인트 전에 실행돼야 라이트로 번쩍이지 않는다.
            고정 문자열 상수만 주입한다(사용자 입력 없음 — CLAUDE.md §1.1 S5 무관) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("ba-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`,
          }}
        />
        {/* Pretendard dynamic subset — 사용된 글자의 서브셋만 내려받는다.
            preconnect 로 DNS/TLS 를 미리 열어 폰트 요청을 병렬화한다.
            CSP 적용 시 style-src / font-src 에 cdn.jsdelivr.net 허용 필요 (ADR-001 §6.2 L4) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
