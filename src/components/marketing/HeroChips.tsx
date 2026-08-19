"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * 히어로에 떠 있는 섹션 칩 — litt.ly 식 스티커 레이어.
 *
 * 홈의 섹션 목차를 **좌측 레일이 아니라 히어로 위에 흩어 놓는다.** 첫 화면에서
 * "이 페이지에 무엇이 있는지"를 목록이 아니라 풍경으로 먼저 보여주는 연출이다.
 * 사용자가 처음 스크롤을 내리면 칩들이 가운데로 모이며 사라지고, 그 역할을
 * 좌측 레일(`HomeSideNav`)이 이어받는다 — 같은 목차가 화면에 두 번 있지 않다.
 *
 * ── 히어로는 LCP 다 ──
 * 모션 라이브러리를 쓰지 않는다(CLAUDE.md §4 · §7). 움직임은 전부 CSS
 * transition 이고 JS 가 하는 일은 **상태 한 번 뒤집기**뿐이다.
 * `left`/`top` 퍼센트를 그대로 전환한다 — 칩이 여덟 개뿐이라 컴포지터 부담이
 * 없고, 좌표를 실측해 delta 를 계산하는 코드를 두지 않아도 된다.
 *
 * ── 사용자를 가두지 않는다 ──
 * 스크롤 잠금도, `wheel` 의 `preventDefault` 도 쓰지 않는다. **내려가려는 의도를
 * 한 번 감지해 smooth scroll 을 한 번 호출**하고 그걸로 끝이다. 그 뒤로는 어떤
 * 스크롤에도 개입하지 않는다(`done` 플래그, 되돌아 올라와도 재발동 없음).
 * 이미 히어로를 지난 위치에서 복원된 경우(새로고침·앵커 진입)에는 발동 자체를
 * 하지 않는다 — 읽던 자리에서 갑자기 튕기는 것이 가장 나쁘다.
 *
 * ── 켜지지 않는 경우 ──
 * · `prefers-reduced-motion: reduce` — 모임 연출도 자동 전환도 없다. 칩은
 *   그냥 링크로 남는다
 * · lg 미만 — 칩 자체를 렌더하지 않는다. 좁은 화면에서 가장자리에 띄우면
 *   히어로 문구와 겹친다(겹침 금지가 연출보다 우선)
 */

export type HeroChipItem = { id: string; label: string };

/**
 * 칩 자리 — 히어로 기준 퍼센트. **가운데 세로 띠(25~75%)를 비워 둔다.**
 * 히어로 문구·CTA 가 그 자리에 있어 겹치면 안 된다.
 * 하단 가운데도 비운다(`ScrollCue` 자리).
 * 회전은 스티커처럼 보이게 하는 장치이고, 값이 크면 글자가 읽기 어려워진다.
 */
const SPOTS = [
  { left: "4%", top: "17%", rot: -6 },
  { left: "11%", top: "44%", rot: 4 },
  { left: "5%", top: "70%", rot: -3 },
  { left: "80%", top: "14%", rot: 5 },
  { left: "85%", top: "42%", rot: -5 },
  { left: "78%", top: "68%", rot: 3 },
  { left: "15%", top: "88%", rot: -2 },
  { left: "81%", top: "88%", rot: 4 },
] as const;

export type HeroChipsProps = {
  items: readonly HeroChipItem[];
  /** 첫 스크롤에서 넘어갈 섹션. 보통 히어로 다음으로 켜져 있는 섹션이다 */
  targetId?: string;
};

export function HeroChips({ items, targetId }: HeroChipsProps) {
  const [gathered, setGathered] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (!targetId) return;
    // 모션 축소 — 모임도 자동 전환도 하지 않는다. 일반 스크롤 그대로 둔다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 칩이 렌더되지 않는 폭에서는 연출도 자동 전환도 없다
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    // 새로고침 복원·앵커 진입 등으로 이미 내려와 있으면 발동하지 않는다
    if (window.scrollY > 4) return;

    const onScroll = () => {
      if (done.current) return;
      const y = window.scrollY;
      if (y <= 4) return;
      done.current = true;

      // 한참 내려간 뒤에 이벤트를 받았다면(빠른 스크롤·점프) 개입하지 않는다.
      // 읽고 있는 자리에서 튕겨 올리는 것이 연출보다 나쁘다.
      if (y > window.innerHeight * 0.6) return;

      setGathered(true);
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetId]);

  if (items.length === 0) return null;

  return (
    /*
      레이어 자체는 클릭을 먹지 않는다(`pointer-events-none`). 칩만 되살린다 —
      그러지 않으면 히어로 전면을 덮는 투명 상자가 CTA 버튼을 가로챈다.
      모인 뒤에는 보이지 않으므로 키보드·스크린리더에서도 뺀다.
    */
    <div
      className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      aria-hidden={gathered}
      inert={gathered}
    >
      {items.map((it, i) => {
        const s = SPOTS[i % SPOTS.length];
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            style={{
              left: gathered ? "50%" : s.left,
              top: gathered ? "50%" : s.top,
            }}
            className={cn(
              "pointer-events-auto absolute",
              "ease-brand transition-[left,top,opacity,transform] duration-[var(--dur-reveal)]",
              gathered
                ? "-translate-x-1/2 -translate-y-1/2 scale-50 opacity-0"
                : "translate-x-0 translate-y-0 scale-100 opacity-100",
              "focus-visible:outline-brand rounded-full focus-visible:outline-2 focus-visible:outline-offset-2",
            )}
          >
            {/* 회전은 안쪽에 건다 — 바깥 transform 은 모임 연출이 쓴다 */}
            <span
              style={{ transform: `rotate(${s.rot}deg)` }}
              className={cn(
                "border-brand-200 text-caption text-brand inline-flex items-center gap-1.5 rounded-full border",
                "bg-white/95 py-2 pr-4 pl-3 font-semibold shadow-[var(--shadow-card)] backdrop-blur-[6px]",
                "ease-standard transition-[box-shadow,border-color] duration-[var(--dur-fast)]",
                "hover:border-brand hover:shadow-[var(--shadow-float)]",
              )}
            >
              <span aria-hidden className="bg-brand size-1.5 shrink-0 rounded-full" />
              {it.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
