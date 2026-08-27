"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { Shot } from "@/components/marketing/ScreenStack";

/**
 * 앱 캡처를 **눌러서 크게 보는** 이미지 (사용자 지시 2026-08-26).
 *
 * ── 왜 필요한가 ──
 * 캡처를 원본 비율로 넣으면 잘리지는 않지만, 지면에 맞추느라 작아진다. 특히 폰
 * 캡처는 폭 150~200px 로 들어가 글자를 읽을 수 없다. 화면 자체를 키우면 한 화면에
 * 안 들어오므로, **평소에는 작게 두고 필요할 때만 크게** 보여준다.
 *
 * ── 배율 버튼을 두지 않는다 (사용자 지시 2026-08-27) ──
 * `− 100% +` 조작 줄을 뒀다가 "필요 없다" 는 지적을 받아 **닫기 하나만** 남겼다.
 * 화면 높이의 90%까지 키워 주므로 대부분의 캡처는 그대로 읽힌다. 더 크게 봐야 하면
 * 브라우저 확대(`Ctrl` + 휠)를 쓰면 된다 — 그 입력은 가로채지 않는다.
 *
 * ── 확대 창은 `<body>` 로 내보낸다 (2026-08-27 버그 수정) ──
 * `position: fixed` 는 조상에 `transform`·`filter`·`backdrop-filter`·`contain` 이
 * 하나라도 있으면 **뷰포트가 아니라 그 조상을 기준**으로 잡힌다. 기능 상세의 한 줄
 * 배치 이미지는 `Reveal`(스크롤 등장 애니메이션) 안에 있고, 그 애니메이션이
 * `transform` 을 쓴다. 그래서 확대 창이 폭 157px 짜리 상자 안에 갇혀, 어두운 바탕도
 * 없이 이미지가 본문 위로 삐져나왔다. 캐러셀은 `Reveal` 로 감싸지 않아 정상이었고,
 * 그래서 "다른 섹션은 되는데 여기만" 이 됐다.
 *
 * `createPortal` 로 `document.body` 에 직접 붙이면 조상이 무엇이든 영향을 받지
 * 않는다. 모달을 포털로 빼는 것은 이 문제를 근본에서 없애는 표준 방법이다.
 *
 * ── 열린 모습 ──
 * 틀(흰 패널·제목 줄)을 쓰지 않는다. **이미지만** 정중앙에 뜨고, 조작 버튼은
 * 이미지 우측 상단에 얹힌다. 뒷배경은 블러로 남겨 보던 화면 위에 떠 있는 것처럼
 * 보이게 한다 (사용자 지시 2026-08-27).
 *
 * ── 접근성 ──
 * 이미지 자체가 버튼이고(`확대해서 보기`), 모서리에 아이콘 표시도 함께 둔다 —
 * 이미지를 누를 수 있다는 것을 알려주는 표시가 필요하다. 열린 뒤에는 `Esc` 로
 * 닫히고, 바탕을 눌러도 닫힌다. 열려 있는 동안 뒤 페이지는 스크롤되지 않는다.
 */

export function ZoomableImage({
  shot,
  /** 배지·설명에 쓰이는 짧은 이름. 확대 화면 제목에 함께 보여준다 */
  label,
  className,
  imgClassName,
  sizes,
  priority = false,
  /** 열림/닫힘을 알려 준다 — 캐러셀은 이때 자동 넘김을 멈춘다 */
  onOpenChange,
}: {
  shot: Shot;
  label?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const show = useCallback(() => {
    setOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  /* 열려 있는 동안: Esc 로 닫고, 뒤 페이지 스크롤을 막는다 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!shot.src) return null;

  return (
    <>
      {/*
        ── 이미지를 버튼으로 **감싸지 않는다** (2026-08-27 버그 수정) ──
        처음에는 `<button>` 안에 이미지를 넣었다. 그런데 `<button>` 은 폼 컨트롤이라
        `width: auto` 일 때 **내용 크기로 줄어든다(shrink-to-fit)**. 크롬은
        `display: block` 을 주면 부모 폭을 채우지만 그렇지 않은 브라우저에서는
        버튼 폭이 곧 **이미지 원본 폭**(예: 1910px)이 되고, 이미지의 `w-full` 은 그
        원본 폭의 100% 가 된다 → 원본 크기로 커진 뒤 `overflow-hidden` 상자에
        잘려 나갔다. 크롬에서만 정상이라 재현이 안 됐다.

        그래서 버튼을 **이미지 위에 덮는 투명 레이어**로 바꿨다. 이미지는 예전처럼
        바로 이 div 의 자식이므로 폭 계산 경로가 확대 기능 도입 전과 같다.
      */}
      <div className={cn("relative", className)}>
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes={sizes}
          priority={priority}
          className={imgClassName}
        />

        <button
          type="button"
          onClick={show}
          /* `label` 에 이미 "화면" 이 붙어 오는 경우가 많아 중복을 피한다 */
          aria-label={`${label ? `${label} ` : ""}확대해서 보기`}
          className="absolute inset-0 cursor-zoom-in"
        />

        {/*
          누를 수 있다는 표시일 뿐이다. **`pointer-events-none` 이 빠지면** 이 표시가
          이미지 위에 얹혀 클릭을 삼켜, 하필 눌러 보고 싶은 모서리에서 아무 일도
          일어나지 않는다(실제로 그 상태로 한 번 내보냈다).
        */}
        <span
          aria-hidden
          className="border-border/70 text-ink pointer-events-none absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full border bg-white/90 shadow-sm"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
          </svg>
        </span>
      </div>

      {open &&
        createPortal(
          /*
          ── 틀을 쓰지 않는다 (사용자 지시 2026-08-27) ──
          이전에는 흰 패널 안에 제목 줄과 이미지를 넣었다. "너무 딱딱하다" 는
          지적을 받아 **이미지만** 정중앙에 띄운다. 뒷배경은 지우지 않고 **블러**로
          남겨, 보던 화면 위에 이미지가 떠 있는 것처럼 보이게 한다.

          `overflow-auto` 는 확대했을 때를 위한 것이다. 배율이 1 을 넘으면 이미지가
          화면보다 커지므로 이 바탕이 스크롤 상자가 되어 원하는 부분으로 옮겨 본다.
        */
          <div
            role="dialog"
            aria-modal="true"
            aria-label={shot.alt}
            className="bg-ink/35 fixed inset-0 z-[100] flex p-4 backdrop-blur-md md:p-6"
            onClick={close}
          >
            <div className="relative m-auto" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 원본을 그대로 띄운다 */}
              <img
                src={shot.src}
                alt={shot.alt}
                className="block max-h-[calc(var(--screen-h)*0.9)] max-w-[calc(var(--screen-w)*0.92)] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
              />

              {/* 닫기 — 이미지 위에 얹어 우측 상단에 둔다 */}
              <button
                type="button"
                onClick={close}
                aria-label="닫기"
                className="bg-ink/75 ease-standard absolute top-2 right-2 flex size-9 items-center justify-center rounded-full text-white backdrop-blur transition-colors duration-[160ms] hover:bg-white/25"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
