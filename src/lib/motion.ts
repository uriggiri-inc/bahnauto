/**
 * JS 애니메이션이 CSS 토큰의 지속시간을 그대로 쓰기 위한 헬퍼.
 *
 * ── 왜 matchMedia 로 분기하지 않는가 ──
 * `globals.css` 는 `prefers-reduced-motion: reduce` 에서 `--dur-*` 를 1ms 로
 * 내린다(`CLAUDE.md` §7 — "모션 축소 대응은 토큰 층에서 끝난다"). rAF 애니메이션도
 * 같은 토큰을 읽으면 컴포넌트마다 `matchMedia` 분기를 두지 않아도 되고, 나중에
 * 토큰 값만 바꿔도 CSS 와 JS 가 함께 따라온다.
 *
 * 반환값이 `REDUCED_MS` 이하면 "모션 축소" 로 보고 최종값을 즉시 찍으면 된다.
 */

/** 이 값 이하로 내려온 지속시간은 애니메이션하지 않는다 (토큰은 1ms 로 떨어진다) */
export const REDUCED_MS = 40;

/**
 * 요소에 적용된 CSS 커스텀 속성을 밀리초로 읽는다.
 * 값이 없거나 해석되지 않으면 `fallback` 을 돌려준다.
 */
export function readDurationMs(el: Element | null, name: string, fallback: number): number {
  if (!el) return fallback;

  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  if (!raw) return fallback;

  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;

  return raw.endsWith("ms") ? n : raw.endsWith("s") ? n * 1000 : fallback;
}

/** 카운트업·자리 이동에 쓰는 감속 곡선. `--ease-brand` 와 같은 성격(끝에서 부드럽게 멈춘다) */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
