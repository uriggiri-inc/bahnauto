import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactForm } from "./ContactForm";

/**
 * `/contact` — 도입 상담 신청. **1순위 전환**(PRD §7.6).
 *
 * 사이트의 모든 CTA 가 여기로 모인다. 그래서 이 페이지의 목표는 설득이 아니라
 * **이미 설득된 사람을 놓치지 않는 것**이다. 새 정보를 늘어놓아 다시 고민하게
 * 만들지 않고, 폼과 대안 접점만 남긴다.
 *
 * 폼을 꺼리는 점주를 위한 **대안 접점**을 같은 화면에 둔다(§7.6). 전화가 편한
 * 사람에게 폼만 내밀면 그 사람은 그냥 나간다.
 */

export const metadata: Metadata = {
  title: "무인매장 관리 상담 신청",
  description:
    "무인매장 관리 도입 상담입니다. 매장 규모와 운영 상황을 알려주시면 관리 범위와 옵션 구성을 안내해 드립니다. 상담은 무료이며 도입을 강요하지 않습니다.",
};

/** PRD §7.4 — 상담 이후 절차. 무엇이 이어질지 알면 제출 부담이 줄어든다 */
const NEXT_STEPS = [
  { no: "01", text: "담당자가 연락드려 매장 상황을 확인합니다" },
  { no: "02", text: "방문 일정을 잡고 직접 매장을 점검합니다" },
  { no: "03", text: "필요한 관리 범위와 금액을 정리해 드립니다" },
];

export default function ContactPage() {
  return (
    <>
      <section className="from-brand-50 bg-gradient-to-b to-white">
        <div className="container-ba pt-12 pb-10 md:pt-20 md:pb-14">
          {/* 홈 상담 섹션(`home.config.ts`)과 **같은 문장**을 쓴다 — 기획 확정 B안 */}
          <SectionLabel className="mb-3">도입 상담</SectionLabel>
          <h1 className="text-display text-ink mb-5 max-w-[20ch]">
            반오토에 맡기고 싶으시다면, 확인해드리겠습니다.
          </h1>
          <p className="text-body-lg text-text-sub max-w-[46rem]">
            전화, 카카오톡, 채널톡 어디로든 편하게 문의하실 수 있습니다. 매장 규모와 운영 상황을
            알려주시면 필요한 관리 범위와 옵션 구성을 안내해 드립니다. 상담은 무료이며, 도입을
            강요하지 않습니다.
          </p>
        </div>
      </section>

      <section className="section-py">
        <div className="container-ba grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            {/* useSearchParams 는 정적 렌더에서 Suspense 경계를 요구한다 */}
            <Suspense
              fallback={
                <div className="border-border text-body-sm text-text-sub rounded-lg border p-6">
                  신청서를 불러오는 중입니다.
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>

          {/* ── 대안 접점 · 이후 절차 ── */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <div className="border-border rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-h4 text-ink mb-4">폼 작성이 번거로우시면</h2>
              <p className="text-body-sm text-text-sub mb-5">
                전화나 카카오톡으로 연락 주셔도 됩니다. 같은 절차로 진행됩니다.
              </p>

              <div className="flex flex-col gap-3">
                {/* 대표번호·카카오 채널은 §13-A1 · §13-F3 확정 대기 */}
                <div className="border-border-light flex items-center justify-between gap-3 rounded-sm border px-4 py-3">
                  <span className="text-body-sm text-ink font-semibold">전화 상담</span>
                  <span className="text-caption text-warning">[대표번호 확정 필요]</span>
                </div>
                <div className="border-border-light flex items-center justify-between gap-3 rounded-sm border px-4 py-3">
                  <span className="text-body-sm text-ink font-semibold">카카오톡 상담</span>
                  <span className="text-caption text-warning">[채널 확정 필요]</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-subtle border-border rounded-lg border p-6">
              <h2 className="text-h4 text-ink mb-4">신청 후 이렇게 진행됩니다</h2>
              <ol className="flex flex-col gap-4">
                {NEXT_STEPS.map((s) => (
                  <li key={s.no} className="flex gap-3">
                    <span className="text-label text-brand bg-brand-100 flex size-7 shrink-0 items-center justify-center rounded-full">
                      {s.no}
                    </span>
                    <span className="text-body-sm text-ink">{s.text}</span>
                  </li>
                ))}
              </ol>
              <p className="text-caption text-text-sub border-border mt-5 border-t pt-4">
                방문 진단에 사장님이 동석하지 않으셔도 진행됩니다.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
