"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Before / After 슬라이더 — REVIEW-001 F-6 의 최우선 호기심 장치.
 *
 * 왜 이게 강한가: 무인매장 관리는 **결과가 물리적으로 눈에 보이는** 서비스인데
 * 설명형 섹션만으로는 그 이점을 전혀 쓰지 못한다. 손잡이를 끄는 순간 이해되고,
 * 사진이 없는 경쟁사는 따라 할 수 없다.
 *
 * ── 좌우 배치 ──
 * **왼쪽이 관리 전, 오른쪽이 관리 후다.** 한국어 읽기 방향이 좌→우이므로
 * 시간 순서도 좌→우여야 한다. 그래서 잘라내는 쪽은 `after` 이고,
 * `inset(0 0 0 pos%)` 로 **오른쪽만** 남긴다.
 *
 * ── 자동 재생 ──
 * 손잡이가 있다는 걸 모르면 아무도 끌지 않는다. 그래서 커서가 닿기 전까지
 * 스스로 관리 전 → 관리 후를 왕복하며 조작 가능함을 알린다.
 * 커서가 올라오면 멈추고, 한 번이라도 직접 움직이면 자동 재생을 영구히 끈다 —
 * 사용자가 맞춘 위치를 애니메이션이 빼앗으면 안 된다.
 *
 * ── 접근성 ──
 * 조작의 실체는 `<input type="range">` 다. 보이는 손잡이는 장식이고 포인터를
 * 받지 않는다. 덕분에 드래그·클릭·키보드(←/→)가 전부 공짜로 동작하고
 * 스크린리더에는 값이 읽힌다. div + onPointerMove 로 만들면 이걸 전부 잃는다.
 *
 * 사진은 §13-D 확보 대기다. 미확보 시 가짜 이미지를 그리지 않는다 —
 * 연출된 결과물을 실적처럼 보이게 하면 표시광고법 문제가 된다.
 */

type Shot = { src: string; alt: string };

export type BeforeAfterProps = {
  before?: Shot;
  after?: Shot;
  beforeLabel?: string;
  afterLabel?: string;
  /** 어느 매장·어느 시점인지. 사진의 출처를 밝히는 자리 */
  caption?: string;
  className?: string;
};

/** 자동 왕복 구간(%) — 양 끝을 완전히 붙이지 않아야 두 사진이 다 보인다 */
const SWEEP_MIN = 12;
const SWEEP_MAX = 88;
/** 왕복 1회 주기(ms) */
const PERIOD = 5600;

export function BeforeAfter({
  before,
  after,
  beforeLabel = "관리 전",
  afterLabel = "관리 후",
  caption,
  className,
}: BeforeAfterProps) {
  // 시작은 "관리 전"이 거의 다 보이는 상태 — 변화가 일어나는 방향을 보여준다
  const [pos, setPos] = useState(SWEEP_MAX);
  const [hovering, setHovering] = useState(false);
  const [taken, setTaken] = useState(false);
  const id = useId();

  const auto = !taken && !hovering;

  // 현재 위치를 이펙트가 "재시작 없이" 읽기 위한 통로.
  // pos 를 의존성에 넣으면 매 프레임 이펙트가 재실행된다.
  // 렌더 중에는 건드리지 않는다 — 값을 바꾸는 두 지점(rAF·직접 조작)에서만 갱신한다.
  const posRef = useRef(SWEEP_MAX);

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    // 멈췄던 위치에서 이어지도록 그 지점의 위상으로 시작한다.
    // 0 부터 시작하면 커서를 뗄 때마다 손잡이가 튄다.
    const mid = (SWEEP_MIN + SWEEP_MAX) / 2;
    const amp = (SWEEP_MAX - SWEEP_MIN) / 2;
    const clamped = Math.min(1, Math.max(-1, (posRef.current - mid) / amp));
    const phase0 = Math.acos(clamped);
    const t0 = performance.now();

    const tick = (now: number) => {
      const t = phase0 + ((now - t0) / PERIOD) * Math.PI * 2;
      // 코사인은 양 끝에서 자연스럽게 감속한다 — 별도 이징이 필요 없다.
      // 정수로 반올림해 값이 같은 프레임에서는 React 가 리렌더를 건너뛰게 한다.
      const v = Math.round(mid + amp * Math.cos(t));
      posRef.current = v;
      setPos(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [auto]);

  // 사용자가 직접 움직이면 자동 재생을 영구히 끈다
  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    posRef.current = v;
    setTaken(true);
    setPos(v);
  }, []);

  const rounded = Math.round(pos);

  return (
    <figure className={cn("w-full", className)}>
      <div
        className="border-border relative overflow-hidden rounded-lg border bg-white shadow-[var(--shadow-card)]"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10]">
          {/* ── 아래층: 관리 전. 전체를 덮는다 ── */}
          <Layer shot={before} pending="관리 전 사진" tone="before" />

          {/* ── 위층: 관리 후. 손잡이 오른쪽만 남긴다 ── */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            aria-hidden
          >
            <Layer shot={after} pending="관리 후 사진" tone="after" />
          </div>

          {/* ── 라벨 ──
              잘라내는 컨테이너 **바깥**에 둔다. 안에 두면 손잡이 위치에 따라
              라벨이 통째로 잘려 어느 쪽이 어느 쪽인지 알 수 없게 된다. */}
          <span className="text-label text-ink absolute top-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-[6px]">
            {beforeLabel}
          </span>
          <span className="text-label bg-brand absolute top-3 right-3 z-10 rounded-full px-3 py-1.5 text-white">
            {afterLabel}
          </span>

          {/* ── 손잡이 (장식) ── */}
          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgba(38,43,60,0.18)]"
            style={{ left: `${pos}%` }}
            aria-hidden
          >
            <span className="border-border-strong absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-[var(--shadow-float)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
              </svg>
            </span>
          </div>

          {/* 조작 가능함을 알리는 힌트 — 직접 만지면 사라진다 */}
          <span
            className={cn(
              "text-caption text-ink pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2",
              "rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-[6px]",
              "ease-standard transition-opacity duration-[240ms]",
              taken ? "opacity-0" : "opacity-100",
            )}
            aria-hidden
          >
            좌우로 끌어보세요
          </span>

          {/* ── 조작의 실체 ──
              투명하게 전체를 덮는다. 트랙 아무 지점을 눌러도 손잡이가 그리로 점프하고
              드래그가 이어지므로, thumb 은 보이지 않아도 된다(폭만 터치하기 좋게 남김). */}
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            step={1}
            value={rounded}
            onChange={onInput}
            aria-label="관리 전후 비교 슬라이더"
            aria-valuetext={`관리 후 사진이 오른쪽에서 ${100 - rounded}% 보입니다`}
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
          />
        </div>
      </div>

      <figcaption className="text-body-sm text-text-sub mt-3">
        {caption ?? (
          <span className="text-warning">[실제 매장 Before/After 사진 대기 · §13-D]</span>
        )}
      </figcaption>
    </figure>
  );
}

function Layer({
  shot,
  pending,
  tone,
}: {
  shot?: Shot;
  pending: string;
  tone: "before" | "after";
}) {
  return (
    <div className={cn("absolute inset-0", tone === "after" ? "bg-brand-50" : "bg-bg-subtle")}>
      {shot ? (
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
        />
      ) : (
        <div className="text-body-sm text-text-sub absolute inset-0 flex items-center justify-center">
          {pending}
        </div>
      )}
    </div>
  );
}
