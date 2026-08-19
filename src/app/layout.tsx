import type { Metadata, Viewport } from "next";
import { ROBOTS_META, SITE_URL } from "@/lib/seo";
import "./globals.css";

const SITE_NAME = "반오토 BAHNAUTO";
const SITE_DESC =
  "자동화되지 않은 나머지 절반, 그 절반을 반오토가 맡습니다. 표준 체크리스트와 사진 기록으로 관리 결과를 매일 증명하는 무인매장 위탁 관리 서비스.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — 무인매장 위탁 관리 서비스`,
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
    title: `${SITE_NAME} — 무인매장 위탁 관리 서비스`,
    description: SITE_DESC,
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
