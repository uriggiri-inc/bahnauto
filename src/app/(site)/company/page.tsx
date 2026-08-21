import type { Metadata } from "next";
import Link from "next/link";
import { DummyBanner } from "@/components/marketing/DummyBanner";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Stat } from "@/components/ui/Stat";
import { buttonClasses } from "@/components/ui/Button";
import { DUMMY_COMPANY, DUMMY_STATS } from "@/content/dummy";
import { formatCopy } from "@/components/ui/Copy";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";

/**
 * `/company` — 회사 소개 (PRD §7.8).
 *
 * 메시지 하우스의 필러 3 "운영해본 사람이 만든 시스템"을 담당한다.
 * 경쟁사도 "체계적 관리"는 말할 수 있지만 **직접 매장을 운영한 이력**은 말할 수 없다.
 * 그래서 이 페이지의 중심은 회사 연혁이 아니라 **우리도 점주라는 사실**이다.
 *
 * ⚠️ 실적 수치와 연혁은 샘플이다(`content/dummy.ts`). 상단 배너로 밝힌다.
 *    사업자 정보는 푸터에서 `[확정 필요]` 로 노출된다(§13-A).
 */

export const metadata: Metadata = {
  title: "무인매장 직영 운영사 소개",
  description:
    "반오토는 우리끼리(주)가 직영 무인매장을 운영하며 만든 관리 체계입니다. 체크리스트도 앱도 현장에서 나왔습니다.",
};

export default function CompanyPage() {
  return (
    <>
      <DummyBanner what="실적 수치와 연혁" />

      {/* ══ 히어로 ═══════════════════════════════════════════════ */}
      <section className="from-brand-50 bg-gradient-to-b to-white">
        <div className="container-ba pt-12 pb-12 md:pt-20 md:pb-16">
          <SectionLabel className="mb-3">회사 소개</SectionLabel>
          <h1 className="text-display text-ink mb-5">우리도 매장을 합니다</h1>
          <p className="text-body-lg text-text-sub max-w-[46rem]">
            반오토는 우리끼리(주)가 직영 {DUMMY_COMPANY.ownStoreType}를 운영하며 만든 관리
            체계입니다. 매장을 맡기는 쪽의 걱정을 저희도 같은 자리에서 했습니다.
          </p>
        </div>
      </section>

      {/* ══ 직영 운영 이력 ═══════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-ba">
          <SectionHeader
            title="이 체크리스트는 책상에서 나오지 않았습니다"
            lead={`${DUMMY_COMPANY.ownStoreOpenedAt}부터 직영 ${DUMMY_COMPANY.ownStoreType}를 운영하고 있습니다. 매일 문을 열고 닫으면서 빠뜨린 것들을 하나씩 적어 만든 것이 지금의 체크리스트입니다.`}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "직접 겪은 문제만 넣었습니다",
                body: "상상해서 만든 항목이 아닙니다. 손님이 불편해했던 것, 놓쳐서 손해 본 것을 항목으로 옮겼습니다.",
              },
              {
                title: "앱도 직접 만들었습니다",
                body: "기성 도구로는 사진 기록과 출퇴근 인증을 원하는 방식으로 묶을 수 없어 자체 개발했습니다.",
              },
              {
                title: "직영점에 먼저 적용합니다",
                body: "새 항목이나 기능은 저희 매장에서 먼저 써 보고 문제가 없을 때 위탁 매장에 적용합니다.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delayMs={i * 60}>
                <div className="border-border h-full rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]">
                  <p className="text-h4 text-ink mb-3">{c.title}</p>
                  <p className="text-body-sm text-text-sub">{formatCopy(c.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 실적 ═════════════════════════════════════════════════
          REVIEW-001 F-1 — 실적은 히어로 직후가 아니라 이미 설득된 다음에 둔다. */}
      <section className="section-py bg-ink text-white">
        <div className="container-ba">
          <SectionHeader
            onDark
            title="숫자로 보면 이렇습니다"
            lead="관리 매장이 늘어난 만큼 기록도 함께 쌓였습니다."
          />
          {/* 홈 "출시 이유" 와 같은 격자다 — 좁은 화면 2열(사용자 지시 2026-08-18).
              같은 데이터를 두 화면이 다른 배치로 보여주면 같은 실적인지 알기 어렵다 */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {DUMMY_STATS.map((s, i) => (
              <Reveal key={s.label} delayMs={i * 60}>
                <Stat value={s.value} unit={s.unit} label={s.label} tone="onDark" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 연혁 ═════════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-ba">
          <SectionHeader title="지나온 길" lead="매장 하나에서 시작했습니다." />

          <ol className="border-border-light flex flex-col border-l pl-6 sm:pl-8">
            {DUMMY_COMPANY.history.map((h, i) => (
              <li key={h.year} className="relative pb-8 last:pb-0">
                <Reveal delayMs={i * 60}>
                  {/* 선 위의 점 — 왼쪽 보더에 걸치게 둔다 */}
                  <span
                    aria-hidden
                    className="bg-brand border-bg absolute top-2 -left-[31px] size-3 rounded-full border-4 sm:-left-[39px]"
                    style={{ borderColor: "var(--color-bg)" }}
                  />
                  <p className="text-label text-brand mb-2">{h.year}</p>
                  <p className="text-body-lg text-ink max-w-[46rem]">{formatCopy(h.text)}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ 자주 묻는 질문 — 하단 CTA 바로 위 (사용자 지시 2026-08-18) ═════ */}
      <FaqTeaser
        groupId="roles"
        offset={0}
        tone="subtle"
        title="매니저와 점주에 대해 많이 묻는 것들"
        lead="누가 무엇을 보고 무엇을 하는지에 대한 질문입니다."
      />

      {/* ══ 최종 CTA ═════════════════════════════════════════════ */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <Reveal>
            <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">같은 고민을 하고 계시다면</h2>
            <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
              매장을 직접 보고, 지금 가장 손이 많이 가는 것부터 정리해 드립니다. 진단까지는 비용이
              발생하지 않습니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={buttonClasses({ variant: "onDark", size: "lg" })}>
                무료 방문 진단 신청
              </Link>
              <Link
                href="/system"
                className={buttonClasses({
                  variant: "ghost",
                  size: "lg",
                  className: "text-white/85 hover:bg-white/12 hover:text-white",
                })}
              >
                운영 시스템 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
