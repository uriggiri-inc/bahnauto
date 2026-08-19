"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * 스크롤 진입 시 fade-up. PRD §7.2 의 모션 규정(24px / 400ms / ease-brand)을 따른다.
 * 실제 값은 `--reveal-distance` · `--dur-reveal` · `--ease-brand` 토큰에 있고,
 * 모션 축소 시 토큰 쪽에서 거리 0 · 1ms 로 내려가므로 여기서 따로 분기하지 않는다.
 *
 * ⚠️ **초기 렌더는 보이는 상태다.** 흔한 구현은 `opacity-0` 을 서버 렌더에 박아두고
 * JS 가 걷어내는데, 그러면 JS 가 실패한 순간 콘텐츠가 통째로 사라진다.
 * 여기서는 관찰을 시작할 때 IntersectionObserver 가 즉시 한 번 발화하는 성질을 이용해
 * **화면 밖일 때만** 숨긴다. 서버 HTML 은 항상 보이는 상태로 나간다.
 *
 * 한 번 나타나면 다시 숨기지 않는다 — 되감을 때마다 사라지면 읽던 사람을 방해한다.
 */

type Phase = "initial" | "hidden" | "shown";

export function Reveal({
  children,
  /** 형제 요소와 순차로 등장시킬 때. 60ms 안팎이 적당하다 */
  delayMs = 0,
  className,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("initial");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // observe 직후 한 번 발화한다. 그때 화면 밖이면 숨기고, 안이면 바로 보여준다.
        if (entry.isIntersecting) {
          setPhase("shown");
          io.disconnect();
        } else {
          setPhase("hidden");
        }
      },
      // 아래쪽 8% 를 잘라 두면 화면에 완전히 들어오기 직전에 시작한다
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        phase === "hidden" && "opacity-0",
        phase === "shown" && "motion-safe:animate-reveal",
        className,
      )}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
