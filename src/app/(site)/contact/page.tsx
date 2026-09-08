import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatCopy } from "@/components/ui/Copy";
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
          {/* 홈 상담 섹션(`home.config.ts`)과 **같은 문장**을 쓴다 — 기획 확정 B안.
              제목·리드 **양쪽 모두** 해당한다. 한쪽만 고치면 두 화면이 갈라진다. */}
          <SectionLabel className="mb-3">도입 상담</SectionLabel>
          <h1 className="text-display text-ink mb-5 max-w-[20ch]">
            반오토에 맡기고 싶으시다면, 확인해드리겠습니다.
          </h1>
          {/*
            2026-09-07 A안으로 교체했다(X-20). 옛 문장은 "전화, 카카오톡, 채널톡 어디로든"
            이었는데 **카카오 채널·채널톡은 2026-09-04 폐기 확정**이라 사이트에 그 경로가 없다.
            이제 실재하는 두 경로만 말한다 — ① 신청서를 내면 고른 `연락 가능 시간대`(`callTime`)에
            전화, ② 대표번호 1899-3635 직통.

            **렌더 텍스트는 `home.config.ts` 의 `contact` 섹션 `lead` 와 글자까지 같아야 한다.**
            번호 정본은 `content/company.ts` 의 `COMPANY.tel` — 바뀌면 두 곳을 함께 고친다.

            2026-09-08 `formatCopy` 를 걸었다(사용자 지시). 홈 상담 섹션은 `SectionShell` 을
            거쳐 이미 문장마다 줄이 나뉘는데 이 히어로만 한 줄로 흘러 **같은 문장이 두 화면에서
            다르게 조판되고 있었다.** "같은 문장" 규칙은 원문·렌더 텍스트 기준이고 마크업이
            아니므로, 조판을 맞추는 것이 규칙을 지키는 쪽이다. 문자열은 한 글자도 바꾸지 않았다.
            ⚠️ 리드를 **순수 문자열**로 유지한다 — JSX 가 섞이면 `formatCopy` 가 그대로
               통과시켜 줄바꿈이 조용히 사라진다(`components/ui/Copy.tsx` 주석).
          */}
          <p className="text-body-lg text-text-sub max-w-[46rem]">
            {formatCopy(
              "신청서를 남기시면 고르신 시간대에 전화드립니다. 급하시면 1899-3635로 바로 걸어 주셔도 됩니다. 매장 규모와 운영 상황을 알려주시면 필요한 관리 범위와 옵션 구성을 안내해 드립니다. 상담은 무료이며, 도입을 강요하지 않습니다.",
            )}
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

          {/* ── 이후 절차 ──
              "폼 작성이 번거로우시면"(전화·카카오톡 상담) 상자는 **2026-09-03 지웠다**
              (사용자 지시). 두 항목 모두 값이 없어 `[대표번호 확정 필요]`·`[채널 확정 필요]`
              라는 자리표시자만 띄우고 있었다 — 누를 것이 없는 상자였다.

              전화 경로가 사라지는 것은 아니다. 대표번호는 푸터에 상시 있고, 모바일에서는
              하단 고정 바의 `전화 상담` 이 같은 날 실제 번호로 연결됐다. */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
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
