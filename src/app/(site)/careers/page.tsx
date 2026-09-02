import type { Metadata } from "next";
import { ScreenShot } from "@/components/marketing/ScreenStack";
import { SCREENS } from "@/content/app-screens";
import { DummyBanner } from "@/components/marketing/DummyBanner";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DUMMY_CAREERS } from "@/content/dummy";
import { CareersForm } from "./CareersForm";
import { formatCopy } from "@/components/ui/Copy";

/**
 * `/careers` — 매장매니저 지원 (PRD §7.7). **2순위 전환**.
 *
 * ── 카피 축 ──
 * 초기안 히어로는 "앱이 알려주는 대로만 하시면 됩니다"였다. REVIEW-001 F-7 이
 * 이를 뒤집었다: 점주가 궁금해서 이 페이지를 눌러보는 일이 실제로 일어나는데,
 * 그때 "쉽습니다"를 보면 **앞서 쌓은 전문성 신뢰가 깎인다.** 두 페이지는 격리돼 있지 않다.
 *
 * 그래서 축을 **"쉽다" → "명확하다"** 로 옮겼다. 지원자의 실제 불안은 "어렵다"가
 * 아니라 "뭘 해야 할지 모른 채 던져진다"이므로 명확성으로도 해소되고,
 * 명확성은 점주에게 **전문성**으로 읽힌다.
 *
 * ⚠️ 근무 조건(급여·정산·시간)은 전부 미확정이라 샘플이다. 잘못 게시하면
 *    근로 분쟁이 되므로 배너로 밝힌다.
 */

export const metadata: Metadata = {
  title: "매장매니저 지원",
  description:
    "집 근처 무인매장을 정해진 체크리스트대로 관리하는 일입니다. 무엇을 해야 하는지 앱이 항목까지 알려드립니다.",
};

/** 실제 상시근무 항목 — 추상적 설명 대신 항목을 그대로 공개한다(PRD §7.7) */
const TASKS = [
  "장난감 및 자동차 정리 정돈",
  "정글짐 내부 정리정돈",
  "청소기&정전기포",
  "물걸레 청소",
  "휴게공간 테이블&의자 닦기",
  "매점매대 정돈",
  "휴지통 비우기",
  "창문 문 단속·조명·냉난방기 확인 및 소등",
];

const HOW = [
  {
    no: "01",
    title: "출근 인증",
    body: "GPS·Wi-Fi·단말기 화면 촬영 중 매장에 정해진 방식으로 인증합니다. 시각은 자동으로 기록됩니다.",
  },
  {
    no: "02",
    title: "체크리스트 확인",
    body: "그날 해야 할 항목이 앱에 순서대로 떠 있습니다. 위에서부터 하시면 됩니다.",
  },
  {
    no: "03",
    title: "사진 첨부",
    body: "항목을 끝내면 사진을 찍어 올립니다. 특이사항이 있으면 메모로 남깁니다.",
  },
  {
    no: "04",
    title: "퇴근 인증",
    body: "마지막 항목까지 완료하면 진행률이 100%가 됩니다. 퇴근도 같은 방식으로 인증합니다.",
  },
];

const STEPS = ["지원서 접수", "서류 확인", "면접 · 교육", "매장 배정"];

const FAQ = [
  {
    q: "경력이 없어도 되나요?",
    a: "괜찮습니다. 교육 후 배정되고, 현장에서는 앱이 항목까지 알려드립니다.",
  },
  {
    q: "하루에 몇 시간 일하나요?",
    a: "매장 규모에 따라 다르지만 1회 방문에 1~2시간 정도입니다. 방문 횟수는 협의합니다.",
  },
  {
    q: "여러 매장을 맡을 수 있나요?",
    a: "가능합니다. 이동 가능한 범위와 가능 시간대를 보고 배정합니다.",
  },
  {
    q: "무엇을 준비해야 하나요?",
    a: "스마트폰만 있으면 됩니다. 청소 도구는 매장에 있습니다.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* 급여·모집 지역은 2026-09-02 확정값으로 교체됐다(`매장 별 협의`·`전지역`).
          남은 잠정값은 근무 시간·횟수·1회 소요·정산 주기·우대 조건이다 */}
      <DummyBanner what="근무 조건" />

      {/* ══ 히어로 ═══════════════════════════════════════════════ */}
      <section className="from-brand-50 bg-gradient-to-b to-white">
        <div className="container-ba grid items-center gap-10 pt-12 pb-14 md:pt-20 md:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <SectionLabel className="mb-3">매장매니저 모집</SectionLabel>
            {/* REVIEW-001 F-7 — "쉽다"가 아니라 "명확하다" */}
            <h1 className="text-display text-ink mb-5">
              무엇을 해야 하는지,
              <br />
              앱이 항목까지 알려드립니다
            </h1>
            <p className="text-body-lg text-text-sub mb-8 max-w-[34rem]">
              집 근처 무인매장을, 정해진 시간에, 체크리스트대로. 교육 → 매뉴얼 → 앱 기록으로
              이어지므로 처음이어도 기준대로 하실 수 있습니다.
            </p>
            <a
              href="#apply"
              className="text-body text-brand font-semibold underline-offset-4 hover:underline"
            >
              지원서 바로 쓰기 →
            </a>
          </div>

          {/*
            매니저는 현장에서 **모바일로만** 일한다. PC 화면을 함께 보여주면
            지원자에게 없는 업무를 암시하게 되므로 모바일 한 장만 둔다.
            틀 없이 원본 비율 그대로 — 하단 탭바가 잘리지 않는다.
          */}
          <ScreenShot
            shot={SCREENS.checklistMobile}
            priority
            sizes="(max-width: 640px) 70vw, 300px"
            className="mx-auto max-w-[300px]"
          />
        </div>
      </section>

      {/* ══ 하는 일 ══════════════════════════════════════════════
          추상적 설명을 쓰지 않는다. 실제 항목을 그대로 보여주는 것이 가장 정확한 안내다. */}
      <section className="section-py">
        <div className="container-ba">
          <SectionHeader
            label="하는 일"
            title="이런 항목을 하십니다"
            lead="무인키즈카페 상시근무 항목입니다. 업종과 매장에 따라 항목은 달라집니다."
          />

          {/* 시안 각주 — 항목이 매장마다 다르다는 사실을 목록 앞에서 밝힌다 */}
          <p className="text-caption text-text-sub -mt-6 mb-6">
            매장별 권장 체크리스트 항목은 배정 시 함께 안내해 드립니다.
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {TASKS.map((t, i) => (
              <li key={t}>
                <Reveal delayMs={i * 40}>
                  <div className="border-border text-body text-ink flex items-center gap-3 rounded-lg border bg-white p-4 shadow-[var(--shadow-card)]">
                    <span className="bg-brand-100 text-brand text-caption flex size-7 shrink-0 items-center justify-center rounded-full font-semibold">
                      {i + 1}
                    </span>
                    {t}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 근무 조건 ════════════════════════════════════════════ */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <SectionHeader
            label="근무 조건"
            title="이렇게 일하십니다"
            lead="지역과 매장에 따라 조정될 수 있습니다. 자세한 내용은 면접에서 안내드립니다."
          />

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { k: "근무 시간", v: DUMMY_CAREERS.workHours },
              { k: "근무 횟수", v: DUMMY_CAREERS.workDays },
              { k: "1회 소요", v: DUMMY_CAREERS.perVisit },
              { k: "급여", v: DUMMY_CAREERS.pay },
              { k: "정산 주기", v: DUMMY_CAREERS.payCycle },
              { k: "모집 지역", v: DUMMY_CAREERS.regions },
            ].map((r, i) => (
              <Reveal key={r.k} delayMs={i * 50}>
                <div className="border-border h-full rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]">
                  <dt className="text-label text-text-sub mb-2">{r.k}</dt>
                  <dd className="text-h4 text-ink">{r.v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <div className="border-border mt-6 rounded-lg border bg-white p-6">
            <p className="text-label text-text-sub mb-3">필요한 것</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {DUMMY_CAREERS.requirements.map((r) => (
                <li key={r} className="text-body text-ink flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-brand)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ 앱으로 일하는 법 ═════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-ba">
          <SectionHeader
            label="일하는 방법"
            title="앱 하나로 끝납니다"
            lead="출근부터 퇴근까지 네 단계입니다."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h, i) => (
              <Reveal key={h.no} delayMs={i * 60}>
                <div className="border-border h-full rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]">
                  <p className="text-label text-brand mb-3">{h.no}</p>
                  <p className="text-h4 text-ink mb-2">{h.title}</p>
                  <p className="text-body-sm text-text-sub">{formatCopy(h.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 지원 절차 · FAQ ══════════════════════════════════════ */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader className="mb-6" title="지원 절차" />
            <ol className="flex flex-col gap-3">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className="border-border text-body text-ink flex items-center gap-3 rounded-lg border bg-white p-4"
                >
                  <span className="bg-brand text-caption flex size-7 shrink-0 items-center justify-center rounded-full font-semibold text-white">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionHeader className="mb-6" title="자주 묻는 질문" />
            <div className="border-border divide-border divide-y overflow-hidden rounded-lg border bg-white">
              {FAQ.map((f) => (
                <details key={f.q} className="group">
                  <summary className="text-body text-ink hover:bg-bg-subtle ease-standard flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold transition-colors duration-[160ms] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-brand)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="ease-standard shrink-0 transition-transform duration-[200ms] group-open:rotate-180"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="text-body-sm text-text-sub px-5 pb-5">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 지원서 ═══════════════════════════════════════════════ */}
      <section className="section-py" id="apply">
        <div className="container-ba max-w-[720px]">
          <SectionHeader
            title="지원서"
            lead="집 근처 매장으로 배정하기 위해 거주 지역과 희망 근무 지역을 함께 여쭙습니다."
          />
          <CareersForm />
        </div>
      </section>
    </>
  );
}
