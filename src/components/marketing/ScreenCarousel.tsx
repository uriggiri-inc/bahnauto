"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatCopy } from "@/components/ui/Copy";
import { ZoomableImage } from "@/components/marketing/ZoomableImage";
import type { Shot } from "@/components/marketing/ScreenStack";

/**
 * 앱 화면 슬라이드 — 한 주제의 **PC·모바일을 한 장면에 묶어** 보여주고, 좌우로
 * 넘기거나 자동으로 넘어간다 (사용자 지시 2026-08-26).
 *
 * ── 왜 캐러셀인가 ──
 * 기능 하나에 화면이 4~5개씩 들어오면 나란히 늘어놓을 자리가 없다. 게다가 같은
 * 기능의 PC 화면과 모바일 화면은 **한 쌍으로 읽혀야** 한다 — 떼어 놓으면 서로
 * 다른 기능처럼 보인다. 그래서 "주제 하나 = 슬라이드 하나" 로 묶고, 그 안에
 * PC·모바일을 함께 놓는다.
 *
 * ── 자동 넘김은 무한 루프 예외다 ──
 * `CLAUDE.md` §7 은 무한 루프를 금지하고, 예외에는 **안전장치 2종을 반드시** 함께
 * 붙이도록 한다. 여기서는
 *   ① 사용자 개입 시 정지 — hover · 키보드 포커스 · 터치 · 버튼 조작
 *   ② 모션 축소(`prefers-reduced-motion: reduce`) 시 **완전 정지** — 자동 넘김을
 *      아예 시작하지 않는다. 좌우 버튼과 탭으로만 넘긴다
 * 추가로 뷰포트를 벗어나면 멈춘다 — 화면에 없는 것이 계속 돌 이유가 없다.
 *
 * ── 높이를 고정하는 이유 ──
 * 1.5초마다 바뀌는데 슬라이드마다 높이가 다르면 페이지가 위아래로 튄다. 그래서
 * 줄 높이를 breakpoint 별로 **고정**하고, 이미지는 `max-h`/`max-w` 로만 줄인다.
 * 화면비를 건드리지 않으므로 어떤 캡처가 와도 잘리지 않는다.
 *
 * ── 좁은 화면 ──
 * PC 캡처와 폰 캡처를 나란히 두면 둘 다 못 읽을 만큼 작아진다. 그래서 **섞인
 * 슬라이드만** 세로로 쌓는다. 폰만 둘인 슬라이드는 좁은 화면에서도 나란히 둔다 —
 * 세로로 쌓으면 한 슬라이드가 화면 높이를 넘어간다.
 */

export type CarouselShot = {
  shot: Shot;
  /**
   * **폭·높이 계산용** 구분이다. `pc` 는 가로로 넓은 캡처, `mobile` 은 세로로 긴
   * 캡처. 실제 기기 이름과 어긋나는 경우가 있다 — PC 화면에 뜨는 채널톡 위젯은
   * 세로로 길어 `mobile` 로 계산해야 배치가 맞다. 그럴 때 배지 문구는 `badge` 로
   * 따로 준다.
   */
  kind: "pc" | "mobile";
  /** 배지에 쓸 문구. 없으면 `kind` 에서 만든다 */
  badge?: string;
  /** 이 한 장이 무엇을 보여주는지. 설명 줄에 붙는다 */
  note: string;
};

export type CarouselSlide = {
  id: string;
  /** 주제 이름 — 탭에 그대로 나온다 */
  title: string;
  /** 이 주제가 무엇인지 한 문장 */
  desc: string;
  shots: readonly CarouselShot[];
};

/** 사용자가 정한 간격 (2026-08-26) */
const INTERVAL_MS = 1500;
/** 조작 후 이만큼 조용하면 자동 넘김을 다시 켠다 — 터치는 hover 해제가 없다 */
const RESUME_MS = 4000;

/*
  크기 상한이 **두 군데로 나뉘어** 있다. 이유가 있다.

  폭(`max-w`)은 **감싸는 칸**에 준다. 퍼센트는 담는 상자의 폭을 기준으로 계산되는데,
  이미지에 직접 주면 그 상자가 곧 이미지 폭이라 순환이 되어 0 으로 수렴한다
  (실제로 모바일 캡처가 43px 로 찌그러졌다).

  높이(`max-h`)는 **이미지**에 픽셀로 준다. 퍼센트 높이는 부모 높이가 확정돼 있어야
  먹는데 칸의 높이는 내용에 따라 정해지므로 무효가 된다.

  둘 다 상한일 뿐이라 화면비는 그대로다 — 어떤 캡처가 와도 잘리지 않는다.
*/
/** 감싸는 칸의 폭 상한 — 한 줄에 함께 서는 장수를 고려한 값이다 */
function wrapClasses(kind: "pc" | "mobile", alone: boolean) {
  if (alone) return "max-w-full";
  if (kind === "mobile") return "max-w-[46%] sm:max-w-[38%] md:max-w-[26%]";
  return "max-w-full md:max-w-[66%]";
}
/** 이미지의 높이 상한 */
function imgClasses(kind: "pc" | "mobile", alone: boolean) {
  if (kind === "mobile") return "max-h-[270px] lg:max-h-[320px]";
  if (alone) return "max-h-[200px] sm:max-h-[260px] md:max-h-[280px] lg:max-h-[320px]";
  return "max-h-[150px] md:max-h-[215px] lg:max-h-[280px]";
}

export function ScreenCarousel({
  slides,
  className,
}: {
  slides: readonly CarouselSlide[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [recent, setRecent] = useState(false);
  const [inView, setInView] = useState(false);
  /* 확대 창이 열린 동안에는 넘기지 않는다 — 닫았을 때 다른 장면이면 혼란스럽다 */
  const [zoomOpen, setZoomOpen] = useState(false);
  /* 기본값을 "축소" 로 둔다 — 확인 전에 움직이기 시작하지 않는다 */
  const [reduceMotion, setReduceMotion] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<number | null>(null);

  const count = slides.length;
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  /* 조작이 있었음을 표시하고, 조용해지면 자동 넘김을 되살린다 */
  const bump = useCallback(() => {
    setRecent(true);
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setRecent(false), RESUME_MS);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = hover || recent || zoomOpen || !inView || reduceMotion || count < 2;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  useEffect(
    () => () => {
      if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    },
    [],
  );

  const slide = slides[index];
  const kinds = new Set(slide.shots.map((s) => s.kind));
  /* PC 와 폰이 섞인 슬라이드만 좁은 화면에서 세로로 쌓는다 */
  const mixed = kinds.size > 1;
  const alone = slide.shots.length === 1;
  /* 줄 높이는 캐러셀 전체에서 하나여야 한다 — 슬라이드마다 다르면 그게 곧 튀는 것이다 */
  const anyMixed = slides.some((s) => new Set(s.shots.map((x) => x.kind)).size > 1);

  return (
    <div
      ref={rootRef}
      className={cn("w-full", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
      onTouchStart={bump}
    >
      {/* ── 화면 ── */}
      <div
        className={cn(
          "flex items-center justify-center gap-3 md:items-end md:gap-5",
          mixed ? "flex-col md:flex-row" : "flex-row",
          anyMixed ? "h-[430px] md:h-[300px] lg:h-[340px]" : "h-[210px] md:h-[300px] lg:h-[340px]",
        )}
      >
        {slide.shots.map((s) => (
          <div
            key={s.shot.src ?? s.note}
            className={cn("flex min-w-0 justify-center", wrapClasses(s.kind, alone))}
          >
            <ZoomableImage
              shot={s.shot}
              label={s.badge ?? (s.kind === "pc" ? "PC" : "모바일")}
              onOpenChange={setZoomOpen}
              sizes={
                s.kind === "pc"
                  ? "(max-width: 768px) 92vw, 660px"
                  : "(max-width: 768px) 44vw, 180px"
              }
              imgClassName={cn(
                "border-border h-auto w-auto max-w-full rounded-xl border shadow-[var(--shadow-float)]",
                imgClasses(s.kind, alone),
              )}
            />
          </div>
        ))}
      </div>

      {/* ── 설명 ── 지금 무엇을 보고 있는지 글로도 남긴다 */}
      <div className="mt-4 text-center">
        <p className="text-h4 text-ink">{slide.title}</p>
        {/*
          `formatCopy` — 문장 끝에서 줄을 나눈다. 그대로 흘리면 「매니저가 매장에서 /
          확인하고」처럼 한 문장이 줄 끝에서 갈라져 두 문장이 뒤섞여 읽힌다.
        */}
        <p className="text-body-sm text-text-sub mx-auto mt-1.5 max-w-[62ch]">
          {formatCopy(slide.desc)}
        </p>
        <ul className="text-caption text-text-sub mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {slide.shots.map((s) => (
            <li key={s.note}>
              <b className="text-ink font-semibold">
                {s.badge ?? (s.kind === "pc" ? "PC" : "모바일")}
              </b>{" "}
              · {s.note}
            </li>
          ))}
        </ul>
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="이전 화면"
            onClick={() => {
              go(index - 1);
              bump();
            }}
            className="border-border text-text-sub hover:border-brand hover:text-brand ease-standard flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-[160ms] sm:size-9"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/*
            주제 이름을 그대로 노출한다 — 점만 있으면 무엇으로 넘어가는지 모른다.

            **가로 스크롤을 쓰지 않는다**(사용자 지시 2026-08-26). 스크롤로 두면 좁은
            화면에서 마지막 버튼이 잘리고 밑에 스크롤바가 따라 움직인다. 대신 버튼이
            **줄어들 수 있게** 두고(`min-w-0` · `shrink`) 좁아지면 이름이 두 줄로
            감싸이게 한다("재고 현황" → "재고 / 현황"). 네 개가 항상 한 화면에 들어온다.
          */}
          <ol className="flex min-w-0 flex-1 justify-center gap-1 sm:gap-1.5">
            {slides.map((s, i) => (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => {
                    go(i);
                    bump();
                  }}
                  className={cn(
                    /* 좁은 화면에서는 이름이 두 줄로 감싸인다("재고 현황" → "재고 / 현황").
                       그때 기본 줄 간격은 두 낱말이 떨어져 보이므로 `leading` 을 조인다
                       (사용자 지시 2026-08-26). 넓은 화면에서는 한 줄이라 영향이 없다. */
                    "text-caption ease-standard w-full rounded-full border px-2 py-1.5 text-center leading-[1.1] transition-colors duration-[160ms] sm:px-3",
                    i === index
                      ? "border-brand bg-brand font-semibold text-white"
                      : "border-border text-text-sub hover:text-brand",
                  )}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ol>

          <button
            type="button"
            aria-label="다음 화면"
            onClick={() => {
              go(index + 1);
              bump();
            }}
            className="border-border text-text-sub hover:border-brand hover:text-brand ease-standard flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-[160ms] sm:size-9"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
