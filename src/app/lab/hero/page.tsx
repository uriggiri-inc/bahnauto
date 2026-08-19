import type { Metadata } from "next";
import { RingMark } from "@/components/brand/RingMark";
import { ScrollCue } from "@/components/ui/ScrollCue";

export const metadata: Metadata = {
  title: "히어로 가설검증",
  robots: { index: false, follow: false },
};

/**
 * 반응형 가설검증용 히어로 시안.
 * /lab 의 뷰포트 시뮬레이터가 이 라우트를 iframe 으로 여러 폭에서 동시에 띄운다.
 */
export default function LabHeroPage() {
  return (
    <main className="from-brand-50 bg-gradient-to-b to-white">
      {/* GNB 축약 — 실제 헤더 컴포넌트 포팅 전 자리 */}
      <header className="border-border/60 sticky top-0 z-20 h-[72px] border-b bg-[var(--scrim-nav)] backdrop-blur-[10px]">
        <div className="container-ba flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <RingMark size={26} animate={false} />
            <span className="text-h4 text-ink">반오토</span>
          </div>
          <a
            href="#cta"
            className="text-body-sm bg-brand hover:bg-brand-hover ease-standard rounded-sm px-4 py-2.5 font-semibold whitespace-nowrap text-white transition-colors duration-[160ms]"
          >
            무료 방문 진단
          </a>
        </div>
      </header>

      <section className="container-ba grid items-center gap-10 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* ── 좌: 카피 ── */}
        <div>
          <div className="border-brand-200 text-label text-brand mb-6 inline-flex items-center gap-2 rounded-full border bg-white py-2 pr-4 pl-2 shadow-[var(--shadow-card)]">
            <RingMark size={24} animate={false} />
            무인매장 위탁 관리
          </div>

          {/* REVIEW-001 F-5 · C안 카피 */}
          <h1 className="text-display text-ink mb-5">
            매장에 나가는 날을,
            <br />
            사장님이 정하시게 됩니다
          </h1>

          <p className="text-body-lg text-text-sub mb-8 max-w-[34rem]">
            청소·재고·응대·점검. 자동화되지 않고 남은 절반을 반오토가 맡습니다. 무엇을 했는지는 매일
            사진과 기록으로 확인하실 수 있습니다.
          </p>

          {/* REVIEW-001 F-4 · 전환 사다리 */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="#cta"
              className="text-body bg-brand hover:bg-brand-hover active:bg-brand-active ease-standard inline-flex min-h-[52px] items-center justify-center rounded-sm px-7 font-semibold text-white shadow-[var(--shadow-cta)] transition-[background,transform] duration-[160ms] hover:-translate-y-px active:translate-y-0"
            >
              무료 방문 진단 신청
            </a>
            <a
              href="#pricing"
              className="text-body text-ink border-border-strong ease-standard inline-flex min-h-[52px] items-center justify-center rounded-sm border bg-white px-7 font-semibold transition-colors duration-[160ms] hover:bg-[var(--color-bg-subtle)]"
            >
              1분 만에 예상 견적 보기
            </a>
          </div>

          <p className="text-body-sm text-text-sub">
            진단은 무료입니다. 상담 후 결정하셔도 됩니다.
          </p>
        </div>

        {/* ── 우: 앱 실화면 자리 (REVIEW-001 F-9) ── */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="border-border rounded-2xl border bg-white p-2 shadow-[var(--shadow-float)]">
            <div className="bg-bg-subtle flex aspect-[9/17] items-center justify-center rounded-[18px]">
              <div className="px-6 text-center">
                <RingMark size={64} />
                <p className="text-body-sm text-text-sub mt-4">
                  실제 앱 체크리스트 화면
                  <br />
                  <span className="text-caption text-text-muted">
                    (마스킹 처리본 대기 · §13-C6)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 플로팅 카드 — 모바일에서는 문서 흐름으로 내려온다 */}
          <div className="border-border mt-3 flex items-center gap-3 rounded-[14px] border bg-white p-4 shadow-[var(--shadow-float)] lg:absolute lg:bottom-10 lg:-left-8 lg:mt-0">
            <span className="bg-success size-2 shrink-0 rounded-full" aria-hidden />
            <div>
              <div className="text-body-sm text-ink font-semibold">오늘 관리 완료</div>
              <div className="text-caption text-text-sub">상시근무 10개 항목 · 사진 12장</div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 스크롤 유도 — 다음 섹션(브랜드 서사)이 스크롤 잠금 구간이라
          무엇을 해야 할지 명시적으로 알려준다 */}
      <div className="flex justify-center pb-10">
        <ScrollCue />
      </div>
    </main>
  );
}
