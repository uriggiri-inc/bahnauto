import type { Metadata } from "next";
import Link from "next/link";
import { DummyBanner } from "@/components/marketing/DummyBanner";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buttonClasses } from "@/components/ui/Button";
import { DUMMY_CASES } from "@/content/dummy";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";

/**
 * `/cases` — 도입 사례 (PRD §7.9 · §13-D).
 *
 * ⚠️⚠️ **이 페이지가 법적으로 가장 위험하다.**
 * 후기는 실제 고객의 **동의를 받은 것만** 게시할 수 있고, 성과를 암시하는 문장은
 * 근거를 갖춰야 한다(표시광고법). 지금 실린 사례는 전부 지어낸 샘플이므로
 * 상단 배너로 밝히고, 실제 사례를 받기 전까지 **오픈하면 안 된다.**
 *
 * 그래서 문장도 "매출이 30% 올랐다" 같은 성과 주장이 아니라 **관리 방식의 변화**로
 * 썼다. 실제 사례로 바꿀 때도 이 틀을 유지하는 편이 안전하다.
 */

export const metadata: Metadata = {
  title: "무인매장 관리 도입 사례",
  description:
    "무인매장 관리 도입 사례입니다. 업종과 매장 조건별로 반오토가 어떻게 관리하고 있는지, 도입 전후 무엇이 달라졌는지 정리했습니다.",
};

export default function CasesPage() {
  return (
    <>
      <DummyBanner what="사례와 후기" />

      {/* ══ 히어로 ═══════════════════════════════════════════════ */}
      <section className="from-brand-50 bg-gradient-to-b to-white">
        <div className="container-ba pt-12 pb-12 md:pt-20 md:pb-16">
          <SectionLabel className="mb-3">도입 사례</SectionLabel>
          <h1 className="text-display text-ink mb-5 max-w-[20ch]">
            비슷한 매장은 어떻게 하고 있을까요
          </h1>
          <p className="text-body-lg text-text-sub max-w-[46rem]">
            업종과 면적, 방문 횟수까지 함께 적었습니다. 내 매장과 조건이 비슷한 사례를 보시면 어느
            정도가 필요한지 가늠하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* ══ 사례 ═════════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-ba flex flex-col gap-6">
          {DUMMY_CASES.map((c, i) => (
            <Reveal key={c.id} delayMs={i * 60}>
              <article className="border-border rounded-lg border bg-white p-6 shadow-[var(--shadow-card)] lg:p-8">
                {/* 조건을 먼저 보여준다 — 방문자는 자기 매장과 비교하러 왔다 */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <Badge>{c.storeType}</Badge>
                  <Badge tone="neutral">{c.region}</Badge>
                  <Badge tone="neutral">{c.area}</Badge>
                  <Badge tone="neutral">{c.visits}</Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                  <div>
                    <p className="text-label text-text-sub mb-2">도입 전</p>
                    <p className="text-body-lg text-ink mb-6">{c.problem}</p>

                    <p className="text-label text-brand mb-2">도입 후</p>
                    <p className="text-body-lg text-ink">{c.result}</p>
                  </div>

                  <blockquote className="bg-bg-subtle border-brand rounded-lg border-l-4 p-6">
                    <p className="text-h4 text-ink mb-4">&ldquo;{c.quote}&rdquo;</p>
                    <footer className="text-body-sm text-text-sub">
                      {c.storeType} · {c.owner}
                    </footer>
                  </blockquote>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ Before / After ═══════════════════════════════════════ */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeader
            className="mb-0"
            label="관리 전후"
            title={
              <>
                설명보다 빠른 건
                <br />
                직접 보시는 겁니다
              </>
            }
            lead="왼쪽이 관리 전, 오른쪽이 관리 후입니다. 가운데 손잡이를 좌우로 밀어보세요."
          />
          <BeforeAfter />
        </div>
      </section>

      {/* ══ 자주 묻는 질문 — 하단 CTA 바로 위 (사용자 지시 2026-08-18) ═════ */}
      <FaqTeaser
        groupId="operation"
        offset={1}
        tone="white"
        title="운영 방식에 대해 많이 묻는 것들"
        lead="다른 매장은 어떻게 관리되는지 궁금하실 때 함께 보시면 됩니다."
      />

      {/* ══ 최종 CTA ═════════════════════════════════════════════ */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <Reveal>
            <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">내 매장은 어느 정도가 필요할까요</h2>
            <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
              방문 진단에서 매장 상태를 보고 필요한 만큼만 정리해 드립니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={buttonClasses({ variant: "onDark", size: "lg" })}>
                무료 방문 진단 신청
              </Link>
              <Link
                href="/pricing"
                className={buttonClasses({
                  variant: "ghost",
                  size: "lg",
                  className: "text-white/85 hover:bg-white/12 hover:text-white",
                })}
              >
                예상 견적 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
