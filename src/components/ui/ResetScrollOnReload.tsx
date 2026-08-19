"use client";

import { useEffect } from "react";

/**
 * 새로고침으로 다시 열렸을 때 브라우저가 복원한 스크롤 위치를 무시하고
 * 맨 위(히어로)에서 시작하게 한다 — 사용자 확정(2026-08-14, 홈).
 *
 * `navigation.type === "reload"` 일 때만 동작하므로 링크 이동·뒤로가기의
 * 스크롤 복원에는 관여하지 않는다.
 */
export function ResetScrollOnReload() {
  useEffect(() => {
    const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (nav?.type === "reload") window.scrollTo(0, 0);
  }, []);

  return null;
}
