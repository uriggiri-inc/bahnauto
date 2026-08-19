import { AppScreen } from "@/components/marketing/AppScreen";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import type { FeatureDetail } from "@/content/feature-details";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 기능 하나의 상세 본문 — 그룹별 카드 · 실제 화면 자리 · 도입 효과.
 *
 * 원래 `/features` 한 페이지 안의 섹션이었는데, 기능별 페이지 8개로 분리되면서
 * (2026-08-14 사용자 확정) `/features/[key]` 가 이 컴포넌트를 그린다.
 * 문구는 전부 `content/feature-details.ts` 에서 온다 — 여기 JSX 에는 적지 않는다.
 *
 * ⚠️ **도입부(번호·영문 라벨·h1·리드·칩)는 여기 없다.** `FeatureIntro` 가 그린다
 *    (2026-08-18 전면 교체 전에는 `FeatureHero` 였다). 페이지의 `h1` 은 그쪽에
 *    있다 — 여기에 `h1` 을 다시 만들면 문서에 h1 이 둘이 된다.
 */
export function FeatureDetailSection({ detail, title }: { detail: FeatureDetail; title: string }) {
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
        캡처는 아직 없다. 자리를 먼저 만들어 두고 `feature-details.ts` 의
        `screens[].src` 가 채워지면 그대로 끼워 넣는다(§13-C6).
        `AppScreen` 은 `src` 가 없으면 그럴듯한 가짜 UI 대신 "[실제 앱 캡처 대기]"
        자리표시자를 그린다 — 더미가 그대로 오픈되는 사고를 막는 장치다.
      */}
      {detail.screens.length > 0 && (
        <div className="mt-10">
          <SectionLabel className="mb-2">실제 화면</SectionLabel>
          <h2 className="text-h3 text-ink">{title} 화면은 이렇게 생겼습니다</h2>

          {/* 아이폰 틀(사용자 확정 2026-08-14) — 캡처가 오면 feature-details.ts 의
              `screens[].src` 만 채우면 폰 화면 안에 들어간다 */}
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {detail.screens.map((s, i) => (
              <li key={s.caption}>
                <Reveal delayMs={i * 60}>
                  <AppScreen src={s.src} alt={s.alt} caption={s.caption} frame="phone" />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 도입 효과 ── */}
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
    </section>
  );
}
