"use client";

/**
 * "스크롤하여 내리기" 유도 버튼.
 *
 * 스크롤 잠금 구간(브랜드 서사)이 바로 아래에 오면 사용자가 무엇을 해야 할지
 * 모른 채 멈추는 일이 생긴다. 명시적 어포던스를 준다.
 *
 * 장식이 아니라 **실제 동작하는 버튼**이다 — 키보드로 접근 가능하고,
 * 누르면 다음 섹션으로 스무스 스크롤한다.
 */

type Props = {
  /** 이동할 대상 요소의 id (예: "story"). 없으면 한 화면 아래로 이동 */
  targetId?: string;
  label?: string;
  className?: string;
};

export function ScrollCue({ targetId, label = "스크롤하여 내리기", className }: Props) {
  const handleClick = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior, block: "start" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight * 0.9, behavior });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "group text-body-sm text-text-sub hover:text-brand ease-standard",
        "inline-flex flex-col items-center gap-2 rounded-sm px-4 py-2 font-medium",
        "transition-colors duration-[160ms]",
        className ?? "",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "border-border-strong group-hover:border-brand group-hover:bg-brand-50 ease-standard",
          "flex size-9 items-center justify-center rounded-full border bg-white",
          "shadow-[var(--shadow-card)] transition-colors duration-[160ms]",
          "motion-safe:animate-[ba-cue_2s_ease-in-out_infinite]",
        ].join(" ")}
        aria-hidden
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </span>
    </button>
  );
}
