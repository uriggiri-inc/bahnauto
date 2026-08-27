import Image from "next/image";
import Link from "next/link";
import { FeatureNavStrip } from "./FeatureNavStrip";
import { cn } from "@/lib/cn";

/**
 * 주요기능 사이드바 — 8기능 목차. **기능별 상세 페이지 공통**으로 붙는다.
 *
 * ── 왜 `FeatureNav` 를 대체하는가 (사용자 확정 2026-08-18) ──
 * 이전 판은 본문 격자의 240px 칸에 들어가는 세로 목록이었다. 참고 시안은
 * **화면 높이를 다 쓰는 사이드바**이고 그 안에 로고가 들어 있다. 그래서
 *   · 화면 높이 전체(`h-svh`) + 오른쪽 테두리로 본문과 분리된다
 *   · 로고를 품는다 → 상단 GNB 는 알약으로 접혀 우측 상단으로 간다(`Header.tsx`)
 *   · 활성 항목이 **브랜드 컬러로 채워진 알약**이다(이전엔 왼쪽 2px 바)
 *
 * ── `fixed` 가 아니라 `sticky` 다 ──
 * `fixed` 로 띄우면 페이지 맨 아래 푸터 위에 그대로 얹혀 겹친다. `sticky` +
 * `h-svh` 는 같은 "화면 꽉 찬 패널" 로 보이면서도 부모 섹션 안에 갇히므로
 * 푸터 영역까지 따라 내려가지 않는다.
 *
 * ── 활성 판정 ──
 * 스크롤 위치가 아니라 "지금 어느 페이지인가"로 정해진다. IntersectionObserver
 * 가 필요 없어 이 컴포넌트는 **서버 컴포넌트**다. 링크를 공유하면 그 기능
 * 페이지가 바로 열린다(`/features/dispatch`).
 *
 * 완전히 JS 0바이트는 아니다 — 좁은 화면 띠의 스크롤 위치를 지키려고 `<ol>` 한
 * 겹만 클라이언트(`FeatureNavStrip`)로 뺐다. 항목은 그대로 서버에서 그린다.
 *
 * ── 좁은 화면 ──
 * lg 미만에서는 사이드바가 설 자리가 없다. 헤더 바로 아래 붙는 **가로 스크롤
 * 띠**로 바뀐다. 배경 없이 붙이면 본문 글자가 목차 뒤로 비쳐 보이므로 좁은
 * 화면에만 배경을 깐다. 로고는 이 폭에서 렌더하지 않는다 — 그 자리는
 * 헤더가 계속 로고를 들고 있다(`Header.tsx` 의 접힘은 lg 이상 전용).
 *
 * 이 띠는 **페이지 끝까지 헤더 아래에 붙어 따라온다**(사용자 지시 2026-08-25).
 * 그 범위는 여기가 아니라 부모가 정한다 — `features/[key]/page.tsx` 는 div 를 두 겹
 * 두고, 좁은 화면에서 **안쪽 div 만 `display: contents`** 로 만들어 `sticky` 의 기준
 * 상자를 페이지 전체를 감싼 겉 div 로 올린다. 안쪽에서 `contents` 를 지우면 띠는
 * 본문이 끝나는 지점(FAQ 직전)에서 멈춘다. 겉 div 를 없애면(또는 겉을 `contents` 로
 * 만들면) Next 의 스크롤 기준점이 어긋나 페이지를 옮겨도 맨 위로 가지 않는다 —
 * 그쪽 주석에 이유가 있다.
 *
 * 가로로 밀어 둔 위치는 라우트가 바뀌어도 유지된다 — `FeatureNavStrip` 참고.
 * `FaqTabs` 는 반대로 `sticky` 를 **일부러 뺐다**(2026-08-18, "따라오지 않고
 * 제자리에 있다"). 두 판단이 달라 보이는 것은 각각 명시적으로 정한 것이다.
 */

export type FeatureSideNavItem = {
  key: string;
  label: string;
  /**
   * 상태 꼬리표. 지금은 아직 열지 않은 기능에 "오픈 예정" 을 붙인다
   * (사용자 지시 2026-08-27).
   *
   * 목록에서 먼저 보여야 하는 이유: 들어가서야 오픈 예정임을 알면 헛걸음이 된다.
   * 값의 정본은 `feature-details.ts` 의 `notice.badge` 이고, 페이지가 넘겨준다.
   */
  badge?: string;
};

export function FeatureSideNav({
  items,
  activeKey,
}: {
  items: readonly FeatureSideNavItem[];
  activeKey?: string;
}) {
  return (
    <div
      className={cn(
        "sticky z-20 self-start",
        // 좁은 화면: 헤더 바로 아래 가로 띠
        "border-border-light top-[var(--header-h)] border-b bg-white/95 backdrop-blur",
        // 넓은 화면: 화면 높이를 다 쓰는 왼쪽 패널
        "lg:top-0 lg:h-svh lg:w-[300px] lg:shrink-0 lg:border-r lg:border-b-0 lg:bg-white lg:backdrop-blur-none xl:w-[332px]",
      )}
    >
      {/* 로고 — lg 이상에서만. 그 아래 폭에서는 헤더가 로고를 들고 있다 */}
      <Link href="/" aria-label="반오토 홈" className="hidden shrink-0 px-6 pt-6 pb-7 lg:block">
        {/* 헤더와 같은 규칙 — 라이트·다크 자산을 둘 다 심고 CSS 가 고른다.
            선언 크기 61×26 은 자산 viewBox(610×260)와 같은 비율이다 */}
        <Image
          src="/brand/logo-horizontal.svg"
          alt="반오토"
          width={61}
          height={26}
          className="ba-logo-light h-[26px] w-auto"
        />
        <Image
          src="/brand/logo-horizontal-dark.svg"
          alt=""
          aria-hidden
          width={61}
          height={26}
          className="ba-logo-dark h-[26px] w-auto"
        />
      </Link>

      <nav aria-label="주요기능 목차">
        {/* 좁은 화면에서는 가로로 흘린다 — 세로 목록이 본문보다 길어진다 */}
        <FeatureNavStrip
          className={cn(
            "flex gap-2 overflow-x-auto px-4 py-3",
            "lg:flex-col lg:gap-1 lg:overflow-visible lg:px-3 lg:py-0",
          )}
        >
          {items.map((s, i) => {
            const on = activeKey === s.key;
            return (
              <li key={s.key} className="shrink-0 lg:shrink">
                <Link
                  href={`/features/${s.key}`}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "ease-standard flex items-center gap-3 transition-colors duration-[160ms]",
                    // 좁은 화면은 알약, 넓은 화면은 카드형 행
                    "rounded-full border px-3.5 py-2 lg:rounded-[14px] lg:border-0 lg:px-4 lg:py-3",
                    on
                      ? // 활성 — 브랜드 컬러로 채운다(시안 그대로)
                        "border-brand bg-brand lg:bg-brand text-white lg:text-white"
                      : "border-border text-text-sub hover:text-brand lg:hover:bg-bg-subtle lg:border-0",
                  )}
                >
                  <span
                    className={cn(
                      "text-caption shrink-0 tabular-nums",
                      on ? "text-white/75" : "text-text-sub",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-body-sm whitespace-nowrap lg:whitespace-normal",
                      on ? "font-semibold text-white" : "lg:text-ink font-normal",
                    )}
                  >
                    {s.label}
                  </span>
                  {s.badge && (
                    /* 색만으로 말하지 않는다 — 글자를 넣는다(`../../CLAUDE.md` §4) */
                    <span
                      className={cn(
                        "text-caption shrink-0 rounded-full border px-1.5 py-px leading-[1.5]",
                        on
                          ? "border-white/35 text-white/90"
                          : "border-border-light text-text-sub bg-bg-subtle",
                      )}
                    >
                      {s.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </FeatureNavStrip>
      </nav>
    </div>
  );
}
