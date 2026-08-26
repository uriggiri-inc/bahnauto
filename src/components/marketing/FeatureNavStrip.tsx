"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * 좁은 화면 목차 띠의 **가로 스크롤 위치를 지키는** 껍데기.
 *
 * ── 왜 필요한가 ──
 * 기능 하나가 곧 한 페이지(`/features/inventory`)다. 그래서 띠에서 06 을 고르면
 * 라우트가 바뀌고 목차 `<ol>` 이 새로 마운트된다 — 브라우저는 새 스크롤 상자를
 * `scrollLeft: 0` 으로 시작하므로 **오른쪽으로 밀어 둔 띠가 01 로 되돌아간다.**
 * 방금 누른 항목이 화면 밖으로 사라져 "어디를 눌렀는지" 를 잃는다.
 *
 * 그래서 스크롤 위치를 **모듈 스코프**에 남긴다. 페이지 이동으로 컴포넌트는
 * 사라지지만 모듈은 살아 있다. `useState` 나 ref 에 두면 함께 사라져 소용이 없다.
 *
 * ── 왜 `useLayoutEffect` 인가 ──
 * `useEffect` 는 브라우저가 한 번 그린 **뒤에** 돈다. 0 으로 그려진 띠가 한 프레임
 * 보였다가 제자리로 튀는 것이 눈에 띈다. 레이아웃 단계에서 되돌려 놓아야 깜빡임이
 * 없다. 서버 렌더에서는 부르지 않는다(경고가 난다).
 *
 * ── 이 껍데기만 클라이언트다 ──
 * `FeatureSideNav` 는 활성 판정을 라우트로 하므로 서버 컴포넌트다(JS 0바이트).
 * 그 성질을 지키려고 전체를 클라이언트로 바꾸지 않고, `<ol>` 한 겹만 여기로
 * 뺐다. 항목(`<li>`)은 그대로 서버에서 그려져 `children` 으로 들어온다.
 */

/** 라우트가 바뀌어도 남아야 하므로 컴포넌트 밖에 둔다 */
let savedLeft: number | null = null;

/** 서버 렌더에서 `useLayoutEffect` 는 경고만 내고 아무 일도 하지 않는다 */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** 활성 항목이 이 정도는 안쪽으로 들어와 있어야 "보인다" 로 본다 */
const EDGE = 16;

/**
 * 활성 항목이 띠 밖에 있으면 가운데로 끌어온다.
 *
 * `scrollIntoView` 를 쓰지 않는다 — 그쪽은 **세로 스크롤까지 건드려서** 페이지가
 * 위아래로 튄다(`block: "nearest"` 로도 조상 스크롤을 손댄다). 여기서는 띠의
 * `scrollLeft` 만 바꾼다. 범위를 넘는 값은 브라우저가 알아서 잘라 준다.
 */
function centerActive(el: HTMLElement) {
  const active = el.querySelector<HTMLElement>('[aria-current="page"]');
  if (!active) return;

  const box = el.getBoundingClientRect();
  const item = active.getBoundingClientRect();

  // 이미 온전히 보인다면 손대지 않는다 — 눌러서 옮겨온 자리를 그대로 지킨다
  if (item.left >= box.left + EDGE && item.right <= box.right - EDGE) return;

  el.scrollLeft += item.left - box.left - (box.width - item.width) / 2;
}

export function FeatureNavStrip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* lg 이상은 `overflow-visible` 세로 목록이라 스크롤할 것이 없다.
       폭이 넘치는지로 판정하면 화면 폭을 다시 계산하지 않아도 된다 */
    if (el.scrollWidth - el.clientWidth > 1) {
      if (savedLeft !== null) el.scrollLeft = savedLeft;
      /* 저장값이 없는 첫 진입(링크 공유 등)에서는 활성 항목을 보이게 한다.
         08 번 페이지를 열었는데 띠가 01 을 보여주고 있으면 길을 잃는다 */
      centerActive(el);
      savedLeft = el.scrollLeft;
    }

    const remember = () => {
      savedLeft = el.scrollLeft;
    };
    el.addEventListener("scroll", remember, { passive: true });
    return () => el.removeEventListener("scroll", remember);
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
