"use client";

import { cn } from "@/lib/cn";

/**
 * 다크/화이트 모드 토글 — 사용자 확정(2026-08-14).
 *
 * 상태를 React 로 들지 않는다. `<html data-theme>` 속성이 유일한 진실이고,
 * 아이콘 표시는 CSS(`.ba-light-only` / `.ba-dark-only`, globals.css)가 그
 * 속성을 보고 정한다 — 서버 HTML 과 첫 클라이언트 렌더가 항상 같아
 * hydration 불일치가 없다.
 *
 * 선택은 localStorage(`ba-theme`)에 남고, 루트 레이아웃의 인라인 스크립트가
 * 첫 페인트 전에 속성을 복원한다(새로고침 시 번쩍임 방지).
 */

const STORAGE_KEY = "ba-theme";

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="다크 모드 전환"
      onClick={() => {
        const root = document.documentElement;
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        if (next === "dark") root.dataset.theme = "dark";
        else delete root.dataset.theme;
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* 시크릿 모드 등 저장 불가 — 이번 방문 동안만 적용된다 */
        }
      }}
      className={cn(
        "tap text-text-sub hover:text-brand hover:bg-bg-subtle ease-standard flex shrink-0 items-center justify-center rounded-sm transition-colors duration-[160ms]",
        className,
      )}
    >
      {/* 라이트 모드에서 보임 — 달 (다크로 전환) */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="ba-light-only"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      {/* 다크 모드에서 보임 — 해 (라이트로 전환) */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="ba-dark-only"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
      </svg>
    </button>
  );
}
