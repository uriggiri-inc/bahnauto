"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * 홈 원페이지 SNB — 좌측 고정 레일.
 *
 * ── 첫 화면에는 뜨지 않는다 ──
 * 히어로에서는 같은 목차가 **떠 있는 칩**(`HeroChips`)으로 이미 보이고 있다.
 * 둘이 동시에 있으면 같은 목차가 화면에 두 번 있는 셈이다. 그래서 히어로가
 * 화면에서 완전히 벗어난 뒤에야 이 레일이 페이드·슬라이드로 들어온다 —
 * 칩이 가운데로 모여 사라지고, 그 역할을 레일이 이어받는 흐름이다.
 *
 * ── 겹침을 "숨김"으로 막는다 ──
 * 이전 판은 `left-4` 로 화면 끝에 붙여 두고 `lg`(1024px)부터 띄웠다. 그 폭에서
 * 본문은 화면 왼쪽 41px 지점에서 시작하므로 레일이 본문 위에 올라앉았다.
 *
 * 지금은 **자리가 나올 때만** 띄운다. 계산 근거(실측):
 *
 *   컨테이너(`container-ba`) 최대 폭 `--container-max` = 1440px
 *   컨테이너 안쪽 좌우 여백  `--gutter`               =   56px (넓은 화면 상한값)
 *   레일 폭                                 RAIL_W    =  112px
 *     └ 좌패딩 12 + 번호 18 + 간격 8 + 라벨 최대 62 + 우패딩 8 = 108 → 112 (여유 4)
 *        라벨 최대치는 "도입 절차"·"상담 신청"(한글 4자 + 공백 1)
 *        = 4 × 14.5px(`text-body-sm`) + 3.6px ≈ 62px
 *   레일과 **본문 글자** 사이 최소 간격      GAP       =   32px
 *   화면 왼쪽 끝 최소 여백                  EDGE      =   16px
 *
 *   쓸 수 있는 자리 = (레이아웃 폭 − 1440) / 2 + 56
 *   필요한 자리     = 112 + 32 + 16 = 160
 *   → (레이아웃 폭 − 1440) / 2 ≥ 104  →  레이아웃 폭 ≥ 1648px
 *
 * ── 레이아웃 폭 ≠ 화면 폭 (2026-08-27 화면 축소 이후) ──
 * `globals.css` 가 넓은 화면에서 `html { zoom: 0.9 }` 를 걸었다. 그래서 레이아웃이
 * 쓸 수 있는 폭은 화면 폭보다 **1/0.9 배 넓다**(`--screen-w`). 계산도 임계값도
 * 그 폭을 기준으로 다시 잡았다.
 *
 *   레이아웃 폭 = 100vw ÷ 0.9 ≥ 1648  →  100vw ≥ 1483px  →  **`min-[1485px]`**
 *
 * ⚠️ 미디어쿼리는 축소와 무관하게 **실제 화면 폭**을 본다. 그래서 임계값은 실제
 *    폭(1485)으로 적고, 자리 계산은 레이아웃 폭(`--screen-w`)으로 한다 — 둘의
 *    기준이 다르다는 것을 놓치면 레일이 본문 위로 올라앉는다.
 *
 * ── 컨테이너 1120 → 1440px 확대에 따른 재계산 (2026-08-18) ──
 * 이전 판은 컨테이너 **바깥**만 자리로 셌다(= 1120 + 2 × 160 = 1440px 임계값).
 * 그 방식을 그대로 두고 폭만 1440 으로 바꾸면 임계값이 1760px 으로 올라가
 * 1536·1600·1680px 노트북·모니터에서 레일이 통째로 사라진다 — 폭을 넓힌
 * 목적과 반대 방향이다. 그래서 **컨테이너 안쪽 여백(거터)까지 자리로 센다.**
 * 거터는 글자를 화면 끝에서 떼어놓기 위한 빈 공간이므로, 그 자리에 레일을
 * 넣어도 **글자와의 간격 32px 과 화면 끝 여백 16px 은 그대로 지켜진다** —
 * 지켜야 할 것은 컨테이너 상자가 아니라 글자와의 거리다.
 *
 * 그래서 `min-[1485px]` 미만에서는 아예 렌더 자리를 주지 않는다. 그 이상에서는
 * 레일 오른쪽 끝이 본문 글자 시작점에서 정확히 GAP 만큼 떨어진다.
 *
 * ⚠️ `--screen-w` 의 밑값인 `100vw` 는 세로 스크롤바 폭을 포함한다(데스크톱에서
 *    보통 15px 안팎).
 *    그만큼 레일이 오른쪽으로 밀려 실제 간격은 GAP 보다 ~8px 줄어든다.
 *    32px 로 잡아 둔 이유가 이것이다 — 16px 였다면 스크롤바가 있는 환경에서
 *    간격이 8px 까지 좁아진다.
 *
 * ── 대비 ──
 * 불투명도로 흐리게 만들지 않는다. `#5A6070` 을 70% 로 낮추면 실효 대비가
 * 4.5:1 아래로 떨어진다(CLAUDE.md §4 와 같은 취지). 비활성 `#5A6070`(7.2:1)
 * 정상 굵기 / 활성 `#262B3C`(12:1) 세미볼드로만 위계를 만든다.
 *
 * ── 왜 IntersectionObserver 인가 ──
 * 스크롤 이벤트로 `getBoundingClientRect()` 를 매 프레임 재는 구현은 섹션이
 * 여러 개면 프레임마다 그만큼 레이아웃을 강제한다. 관찰자는 브라우저가
 * 교차 시점에만 알려주므로 스크롤 중 비용이 0 이다.
 * 뷰포트 위아래를 잘라 **화면 중앙의 좁은 띠**만 판정 영역으로 쓴다(rootMargin).
 * 이게 없으면 섹션 두 개가 걸쳐 있을 때 활성 항목이 위아래로 떨린다.
 *
 * ── 접근성 ──
 * · 진짜 `<a href="#id">` 다. JS 가 죽어도 이동한다
 * · 현재 위치는 `aria-current="location"` — 색만으로 알리면 색각 이상
 *   사용자에게는 아무 정보가 아니다. 굵기와 표시 바가 두 번째·세 번째 신호다
 * · 숨어 있는 동안에는 `inert` 로 키보드·스크린리더에서도 뺀다
 * · 스크롤 이동은 CSS `scroll-behavior` 에 맡긴다. 모션 축소 설정이 자동으로
 *   존중된다(JS `scrollTo({behavior:'smooth'})` 는 그렇지 않다)
 * · 전환 시간은 `--dur-*` 토큰이라 모션 축소에서 1ms 로 내려간다
 */

export type HomeSection = { id: string; label: string };

/** 화면 중앙 ±20% 띠만 판정에 쓴다 */
const ROOT_MARGIN = "-40% 0px -40% 0px";

/** 위 주석의 계산에 쓰인 값들 — 바꾸면 노출 임계값(1485px)도 함께 다시 잡는다 */
const RAIL_W = 112;
const GAP = 32;
/**
 * 컨테이너 왼쪽 끝에서 거터만큼 더 안쪽(= 본문 글자 시작점)을 기준으로 잡고,
 * 거기서 GAP + RAIL_W 를 왼쪽으로 물러난다. `--gutter` 를 더하는 항이 이번
 * 확대(1120 → 1440px)에서 추가된 부분이다.
 */
const RAIL_LEFT = `calc((var(--screen-w) - var(--container-max)) / 2 + var(--gutter) - ${GAP}px - ${RAIL_W}px)`;

export type HomeSideNavProps = {
  sections: readonly HomeSection[];
  /**
   * 이 섹션이 화면에서 완전히 벗어난 뒤에 레일이 나타난다(보통 히어로).
   * 없으면 처음부터 보인다.
   */
  revealAfterId?: string;
};

export function HomeSideNav({ sections, revealAfterId }: HomeSideNavProps) {
  const [active, setActive] = useState<string | null>(null);
  const [passedHero, setPassedHero] = useState(false);

  /**
   * 기준 섹션이 지정되지 않았으면 처음부터 보인다. 지정됐으면 그것이 화면에서
   * 벗어난 뒤에만 보인다.
   *
   * 이 값을 `useState` + 이펙트로 만들지 않는다 — 이펙트 본문에서 곧바로
   * `setState` 를 부르면 렌더가 한 번 더 돌고 `react-hooks/set-state-in-effect`
   * 에도 걸린다. 렌더 중에 계산할 수 있는 값은 렌더 중에 계산한다.
   */
  const shown = !revealAfterId || passedHero;

  // ── 활성 섹션 판정 ──
  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);

    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sections]);

  // ── 히어로를 지났는가 ──
  useEffect(() => {
    if (!revealAfterId) return;

    const hero = document.getElementById(revealAfterId);

    if (hero) {
      // 히어로가 화면에서 완전히 사라지면 등장한다. 다시 올라가면 함께 사라진다
      const io = new IntersectionObserver(([e]) => setPassedHero(!e.isIntersecting), {
        threshold: 0,
      });
      io.observe(hero);
      return () => io.disconnect();
    }

    /*
      기준 섹션이 화면에 없는 경우(설정에서 껐거나 id 가 바뀐 경우)의 폴백.
      관찰할 대상이 없다고 레일을 영영 숨기면 목차가 통째로 사라진다.
      한 화면만큼 내려왔는지로 대신 판정한다.
    */
    const onScroll = () => setPassedHero(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealAfterId]);

  return (
    <nav
      aria-label="홈 섹션 바로가기"
      style={{ left: RAIL_LEFT, width: RAIL_W }}
      inert={!shown}
      className={cn(
        "pointer-events-none fixed top-1/2 z-30 hidden -translate-y-1/2",
        // 자리가 나오는 폭에서만 존재한다(위 계산 참조)
        "min-[1485px]:block",
        "ease-brand transition-[opacity,translate] duration-[var(--dur-menu)]",
        shown ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0",
      )}
    >
      {/* 세로 트랙 — 활성 표시 바가 이 선 위에 얹힌다. "목차" 머리글은 없앴다:
          레일이 히어로를 지난 뒤에만 나타나므로 무엇인지 이미 문맥으로 읽힌다 */}
      <ul
        className={cn(
          "border-border flex flex-col border-l",
          shown ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {sections.map((s, i) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "group ease-standard relative flex items-baseline gap-2 py-2 pr-2 pl-3",
                  "transition-colors duration-[var(--dur-fast)]",
                  on ? "text-ink" : "text-text-sub hover:text-ink",
                  "focus-visible:outline-brand rounded-r-sm focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
              >
                {/* 활성 표시 바 — 색 외의 신호. 트랙 선을 덮는 위치에 둔다 */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1 bottom-1 -left-px w-[2px] rounded-full",
                    "ease-brand transition-[opacity,transform] duration-[var(--dur-fast)]",
                    on
                      ? "bg-brand scale-y-100 opacity-100"
                      : "bg-brand-300 scale-y-50 opacity-0 group-hover:opacity-100",
                  )}
                />

                <span
                  aria-hidden
                  className={cn(
                    "text-caption w-[18px] shrink-0 tabular-nums",
                    on ? "text-brand font-semibold" : "text-text-sub",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "text-body-sm whitespace-nowrap",
                    on ? "font-semibold" : "font-normal",
                  )}
                >
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
