"use client";

import { useEffect, useRef } from "react";

/**
 * 시그니처 브랜드 서사 — 무의존성 스크롤 스크럽.
 *
 * motion 의 useScroll 판(ScrollStory.tsx)은 gzip 42.1KB 를 추가해
 * 라우트를 210KB 로 밀어올렸다. PRD §11.1 초기 JS 예산 200KB 초과.
 *
 * 이 버전의 JS 가 하는 일은 **딱 하나** — 스크롤 진행도를 CSS 변수 `--p`(0~1)로
 * 써 넣는 것뿐이다. 나머지 시각 표현은 전부 CSS 가 계산한다.
 *
 * 씬 페이드는 abs() 없이 구현한다(CSS abs() 는 지원이 고르지 않음):
 *   바깥 요소 = 페이드인 램프, 안쪽 요소 = 페이드아웃 램프.
 *   중첩 opacity 는 곱해지므로 둘의 곱이 삼각형 윈도우가 된다.
 *
 * 네이티브 animation-timeline 은 MDN 기준 Baseline "Limited availability" 라
 * 단독 수단으로 쓰지 않는다. 이 방식은 스크롤 이벤트만 쓰므로 전 브라우저 동작.
 */

const SCENES = [
  {
    key: "auto",
    headline: "무인매장은 절반만 자동입니다",
    body: "결제와 입장은 자동으로 돌아갑니다.",
  },
  {
    key: "half",
    headline: "나머지 절반은 여전히 사람의 일입니다",
    body: "청소 · 재고 · 응대 · 점검 · 행정. 사람이 없어도 할 일은 그대로 남습니다.",
  },
  {
    key: "bahnauto",
    headline: "그 절반을, 반오토가 맡습니다",
    body: "무엇을 했는지는 매일 사진과 기록으로 확인하실 수 있습니다.",
  },
] as const;

export function ScrollStoryLite() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      // 0(구간 진입) → 1(구간 이탈)
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };

    const onScroll = () => {
      if (!visible || raf) return;
      raf = requestAnimationFrame(update);
    };

    // 화면 밖일 때는 스크롤 계산 자체를 하지 않는다
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) update();
      },
      { rootMargin: "0px" },
    );
    io.observe(el);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      aria-label="반오토 브랜드 서사"
      className="ba-story bg-bg-subtle relative"
      style={{ "--n": SCENES.length } as React.CSSProperties}
    >
      <div className="ba-story__stage">
        {/* 링 — 스크롤에 따라 궤도가 채워진다 */}
        <svg
          width="112"
          height="112"
          viewBox="0 0 140 140"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <defs>
            <linearGradient
              id="ba-story-grad"
              gradientUnits="userSpaceOnUse"
              x1="15"
              y1="0"
              x2="125"
              y2="0"
            >
              <stop offset="0" stopColor="#004ACC" />
              <stop offset="1" stopColor="#A3C3FF" />
            </linearGradient>
          </defs>
          <circle cx="70" cy="70" r="55" stroke="#EDF2FD" strokeWidth="30.26" />
          <circle
            className="ba-story__ring"
            cx="70"
            cy="70"
            r="55"
            stroke="url(#ba-story-grad)"
            strokeWidth="30.26"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            transform="rotate(-90 70 70)"
          />
          <g className="ba-story__dot">
            <circle cx="125" cy="70" r="8.73" fill="#FFFFFF" />
          </g>
        </svg>

        {/* 씬 — 텍스트는 항상 DOM 에 있다(크롤러·스크린리더). 시각적으로만 페이드된다. */}
        <div className="ba-story__scenes">
          {SCENES.map((s, i) => (
            <div
              key={s.key}
              className="ba-story__scene"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="ba-story__scene-inner">
                <h2 className="text-display text-ink mx-auto max-w-[22ch]">{s.headline}</h2>
                <p className="text-body-lg text-text-sub mx-auto mt-5 max-w-[38ch]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 진행 표시 — 남은 길이를 예측할 수 있게 한다 */}
        <div className="ba-story__dots" aria-hidden>
          {SCENES.map((s, i) => (
            <span
              key={s.key}
              className="ba-story__pip"
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
