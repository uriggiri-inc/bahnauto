import { ScreenCarousel } from "@/components/marketing/ScreenCarousel";
import { ScreenShot } from "@/components/marketing/ScreenStack";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import type { FeatureDetail } from "@/content/feature-details";
import { FEATURE_CAROUSELS } from "@/content/app-screens";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 기능 하나의 상세 본문 — 그룹별 카드 · 실제 화면 자리 · 도입 효과.
 *
 * 원래 `/features` 한 페이지 안의 섹션이었는데, 기능별 페이지로 분리되면서
 * (2026-08-14 사용자 확정) `/features/[key]` 가 이 컴포넌트를 그린다.
 * 문구는 전부 `content/feature-details.ts` 에서 온다 — 여기 JSX 에는 적지 않는다.
 *
 * ⚠️ **도입부(번호·영문 라벨·h1·리드·칩)는 여기 없다.** `FeatureIntro` 가 그린다
 *    (2026-08-18 전면 교체 전에는 `FeatureHero` 였다). 페이지의 `h1` 은 그쪽에
 *    있다 — 여기에 `h1` 을 다시 만들면 문서에 h1 이 둘이 된다.
 */
export function FeatureDetailSection({ detail, title }: { detail: FeatureDetail; title: string }) {
  /*
    화면이 여러 장 들어온 기능은 **슬라이드**로 보여준다(사용자 지시 2026-08-26).
    같은 주제의 PC·모바일을 한 장면에 묶어야 서로 다른 기능처럼 읽히지 않는다.
    슬라이드가 정의되지 않은 기능은 아래의 한 줄 배치를 그대로 쓴다.
  */
  const slides = FEATURE_CAROUSELS[detail.key];

  return (
    <section id={`${detail.key}-detail`} className="scroll-mt-[calc(var(--header-h)+24px)]">
      {/* ── 그룹별 카드 ── */}
      {detail.groups.map((g, gi) => (
        <div key={g.title} className={gi === 0 ? "" : "mt-14"}>
          {/*
            눈썹 라벨 — 참고 시안은 `FOR MANAGER` 처럼 **영문 대문자**를 쓴다
            (사용자 확정 2026-08-18). 영문 표기가 확인된 그룹만 `labelEn` 을
            가지고 있고, 없으면 기존 한글 라벨로 떨어진다. 임의로 영문을 만들지
            않는다 — 시안 확인 후 채운다.
          */}
          {(g.labelEn ?? g.label) && (
            <SectionLabel className={cn("mb-2", g.labelEn && "tracking-[0.14em] uppercase")}>
              {g.labelEn ?? g.label}
            </SectionLabel>
          )}

          {/*
            제목 — 시안은 `매니저용 — 현장을 기록하는 4가지 기능` 처럼 한글
            라벨을 제목 앞에 붙여 한 줄로 읽는다. 라벨이 눈썹으로 영문화되면서
            한글 라벨이 갈 자리가 여기다.
          */}
          <h2 className="text-h3 text-ink">
            {g.labelEn && g.label ? `${g.label} — ${g.title}` : g.title}
          </h2>
          <p className="text-body text-text-sub mt-2">{formatCopy(g.lead)}</p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.cards.map((c, i) => (
              <li key={c.title} className="h-full">
                <Reveal delayMs={i * 60}>
                  <Card padding={24} className="h-full">
                    <h3 className="text-h4 text-ink">{c.title}</h3>
                    <p className="text-body-sm text-text-sub mt-2 leading-[1.7]">
                      {formatCopy(c.body)}
                    </p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/*
        ── 실제 화면 ──
        **틀을 쓰지 않는다**(사용자 확정 2026-08-25). 아이폰 베젤 틀에 넣었더니
        모바일 캡처(756×1466)가 9:19.5 와 어긋나 하단 탭바 양끝이 잘렸다.
        지금은 원본 비율 그대로 그리므로 잘리지 않는다.

        ── lg 이상: 한 줄에 다 들어간다 (사용자 지시 2026-08-26) ──
        이전에는 PC 를 `62%`, 모바일을 `200px` 고정으로 두었다. 대시보드처럼
        모바일 2 + PC 1 인 페이지에서 합이 100% 를 넘어 **세 번째 장이 다음 줄로
        떨어지고 오른쪽 절반이 비었다.**

        지금은 **화면비만큼 폭을 나눈다** — `flex: <비율> 1 0%`. 기본 폭이 0 이라
        넘칠 수가 없고, 폭이 비율에 비례하면 **높이가 저절로 같아진다**
        (높이 = 남은폭 ÷ 비율합, 모든 장에서 같은 값). 장수나 방향 조합이 바뀌어도
        규칙 하나로 처리된다 — PC 1장, PC 2장, 모바일 2 + PC 1 전부.

        `max-w` 는 장이 하나뿐일 때만 걸린다. 안 걸어 두면 PC 한 장이 폭 전체를
        먹어 세로 460px 짜리 덩어리가 된다.

        ── lg 미만: 폰 먼저, PC 나중 (사용자 지시 2026-08-26) ──
        한 줄에 셋을 넣으면 아무것도 안 보이므로 감싸 내려간다. 이때 **폰 2장이
        위에 나란히, PC 가 그 아래 한 줄 전체**로 놓인다.

        `max-lg:order-1` 로 PC 만 뒤로 보낸다. `order` 는 **배치 순서만** 바꾸므로
        DOM 순서(콘텐츠에 적은 순서)는 그대로다 — 캡션이 각 이미지에 붙어 있어
        읽는 순서가 바뀌어도 무엇의 화면인지 잃지 않는다. 이 재배치가 없으면
        PC 가 폰 사이에 끼어 한 줄씩 세 줄이 되고 양옆이 빈다.

        `src` 가 없으면 "[실제 앱 캡처 대기]" 자리표시자가 뜬다 — 더미가 그대로
        오픈되는 사고를 막는 장치다(§13-C6).
      */}
      {(slides || detail.screens.length > 0) && (
        <div className="mt-10">
          <SectionLabel className="mb-2">실제 화면</SectionLabel>
          <h2 className="text-h3 text-ink">{title} 화면은 이렇게 생겼습니다</h2>

          {slides ? (
            <ScreenCarousel slides={slides} className="mt-8" />
          ) : (
            <ul
              className={cn(
                "mt-8 flex flex-wrap items-start justify-center gap-5 md:gap-6",
                "lg:flex-nowrap lg:justify-start lg:gap-5",
              )}
            >
              {detail.screens.map((s, i) => {
                /* 가로세로 비 — 폭 배분과 방향 판별에 함께 쓴다 */
                const ratio = s.width / s.height;
                const wide = ratio > 1;
                return (
                  <li
                    key={s.caption}
                    style={{ "--ratio": ratio } as React.CSSProperties}
                    className={cn(
                      /* `min-w-0` 이 없으면 이미지 기본 폭이 하한이 되어 줄이 넘친다 */
                      "min-w-0",
                      /* 좁은 화면에서만 PC 를 뒤로 — 폰 두 장이 먼저 나란히 선다 */
                      wide ? "w-full max-lg:order-1" : "w-[calc(50%-0.625rem)] max-w-[240px]",
                      "lg:w-auto lg:flex-[var(--ratio)_1_0%]",
                      wide ? "lg:max-w-[720px]" : "lg:max-w-[240px]",
                    )}
                  >
                    <Reveal delayMs={i * 60}>
                      <ScreenShot
                        shot={s}
                        caption={s.caption}
                        zoomable
                        sizes={
                          wide
                            ? "(max-width: 1024px) 92vw, 720px"
                            : "(max-width: 640px) 46vw, 200px"
                        }
                      />
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/*
        ── 도입 효과 ──
        **없을 수 있다.** ⑦ A/S 바로출동서비스는 담당자 문서에 "준비 중" 두 줄뿐이라
        효과를 적으면 지어내는 것이 된다(`feature-details.ts` 의 `effect` 주석).
        그럴 때 이 검은 상자를 빈 채로 그리면 미완성으로 보이므로 통째로 뺀다.
      */}
      {detail.effect && (
        <div className="bg-ink mt-10 rounded-[24px] p-7 text-white md:p-9">
          <SectionLabel tone="onDark" className="mb-3">
            도입 효과
          </SectionLabel>
          <h2 className="text-h3">{detail.effect.title}</h2>

          <ul className="mt-7 grid gap-6 sm:grid-cols-2">
            {detail.effect.items.map((it) => (
              <li key={it.title} className="flex gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-brand-300)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="mt-1 shrink-0"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
                <div>
                  <p className="text-h4">{it.title}</p>
                  <p className="text-body-sm mt-1.5 leading-[1.7] text-white/80">
                    {formatCopy(it.body)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
