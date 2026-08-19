"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { GA_MEASUREMENT_ID, isAnalyticsAllowed } from "@/lib/analytics";

/**
 * 호스트 이름은 페이지가 살아 있는 동안 바뀌지 않는다(바뀌려면 전체 내비게이션이
 * 일어나고 그 시점에 앱이 다시 뜬다). 그래서 구독은 아무 일도 하지 않는다.
 *
 * 모듈 스코프에 두어 렌더마다 새 함수가 만들어지지 않게 한다 —
 * `useSyncExternalStore` 는 subscribe 가 바뀌면 재구독한다.
 */
const subscribe = () => () => {};

/** 서버 렌더에는 `window` 가 없다. 정적 HTML 에는 GA 태그가 들어가지 않는다. */
const getServerSnapshot = () => false;

/**
 * GA4 (gtag.js) 로더.
 *
 * 허용된 호스트가 아니면 **스크립트 태그 자체를 렌더하지 않는다.**
 * `gtag('config', ...)` 만 건너뛰는 방식으로 만들면 googletagmanager.com
 * 요청은 그대로 나가고, GA4 는 그 요청만으로도 세션을 만든다.
 * 로컬·프리뷰 트래픽을 정말로 0 으로 만들려면 로드 자체를 막아야 한다.
 *
 * 정적 내보내기라 서버에서 호스트를 알 수 없다. 그래서 호스트를 "외부 저장소"로
 * 보고 `useSyncExternalStore` 로 읽는다 — 서버 스냅샷은 false, 클라이언트
 * 스냅샷은 실제 호스트 판정이다. `useEffect` + `setState` 로 짜면 하이드레이션
 * 직후 불필요한 리렌더가 한 번 더 돌고, 린트 규칙에도 걸린다.
 *
 * 정적 HTML 에는 GA 태그가 들어가지 않고 하이드레이션 후에 붙는다.
 * GA4 는 이 정도 지연을 문제 삼지 않는다.
 *
 * ⚠️ 라우트 이동은 여기서 직접 보내지 않는다. GA4 향상된 측정의
 *    "브라우저 기록 이벤트 기반 페이지 변경"이 기본값으로 켜져 있어
 *    수동으로 page_view 를 쏘면 조회수가 두 배로 잡힌다.
 */
export function GoogleAnalytics() {
  const allowed = useSyncExternalStore(subscribe, isAnalyticsAllowed, getServerSnapshot);

  if (!allowed) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
