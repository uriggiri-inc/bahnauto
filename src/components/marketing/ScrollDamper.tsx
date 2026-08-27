"use client";

import { useEffect } from "react";

/**
 * 휠 한 칸당 내려가는 거리를 줄인다 (사용자 지시 2026-08-26).
 *
 * ── 왜 필요한가 ──
 * 기능 상세 페이지는 섹션 하나가 곧 읽을 단위인데, 휠 한 칸이 화면의 상당 부분을
 * 지나가 원하는 위치에 세우기 어렵다. 스크롤 스냅으로 맞춰 보려 했더니 이번에는
 * "끊긴다"는 문제가 생겼다(2026-08-26 되돌림). 그래서 **멈추는 위치를 강제하지
 * 않고 한 번에 가는 거리만** 줄인다 — 어디서든 그대로 멈추고, 조금씩 움직인다.
 *
 * ── 손대지 않는 입력 ──
 * 키보드(Page Down·화살표) · 터치 · 스크롤바 끌기는 그대로다. 브라우저 기본 동작을
 * 가로채는 범위를 휠로만 좁힌다.
 *
 * 아래 세 경우는 기본 동작에 맡긴다. 하나라도 빠뜨리면 다른 기능이 망가진다:
 *   · `Ctrl`/`Cmd` + 휠 — 브라우저 확대. 막으면 확대가 안 된다
 *   · **자기 스크롤이 있는 상자 안** — 이미지 확대 창, 좁은 화면의 목차 띠가
 *     여기 걸린다. 막으면 그 안에서 스크롤이 죽는다
 *   · `deltaMode` 가 픽셀이 아닐 때(Firefox 는 줄 단위로 준다) — 줄 수에 배율을
 *     곱하면 1~2px 씩 움직여 사실상 멈춘 것처럼 된다
 *
 * 모션 축소 설정에서는 아무것도 하지 않는다 — 기본 스크롤이 그 사람의 기준이다.
 *
 * 배율을 바꿀 일이 생기면 `ratio` 하나만 만진다. 1 이면 기본 동작과 같다.
 */

/**
 * 기본값 — **1 = 브라우저 기본** (사용자 지시 2026-08-27).
 *
 * 0.5 → 0.7 → 1 로 올려 왔다. 1 이 되었으므로 아래 `useEffect` 가 **휠에 아무
 * 장치도 걸지 않는다.** 배율만 1 로 두고 가로채기는 남겨 두면, 매번
 * `preventDefault` 후 같은 거리를 다시 스크롤하는 셈이라 트랙패드의 관성·부드러운
 * 스크롤을 잃고 기본보다 오히려 나빠진다. 그래서 1 이상이면 손을 뗀다.
 *
 * 다시 줄일 일이 생기면 이 숫자만 만진다. 한 칸(보통 `deltaY` 100~120px) 기준:
 *   0.5 → 50~60px (약 1.3~1.6cm) · 0.7 → 70~84px (약 1.9~2.2cm) · 1 → 기본
 */
const RATIO = 1;

/** 조상 중에 스스로 스크롤하는 상자가 있는지 */
function insideScrollable(target: EventTarget | null): boolean {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
    el = el.parentElement;
  }
  return false;
}

export function ScrollDamper({ ratio = RATIO }: { ratio?: number }) {
  useEffect(() => {
    /* 1 이상이면 브라우저 기본이 답이다 — 듣지도 않는다 */
    if (ratio >= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (e.deltaMode !== 0 || e.deltaY === 0) return;
      if (insideScrollable(e.target)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY * ratio, behavior: "auto" });
    };

    /* `passive: false` 여야 `preventDefault` 가 먹는다 */
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [ratio]);

  return null;
}
