import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DummyBanner } from "@/components/marketing/DummyBanner";
import { PageHero } from "@/components/marketing/PageHero";
import { ProcessSteps, type Step } from "@/components/marketing/ProcessSteps";
import { Badge } from "@/components/ui/Badge";
import { ConditionalTag } from "@/components/marketing/ConditionalTag";
import { Mark } from "@/components/ui/Mark";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buttonClasses } from "@/components/ui/Button";
import { DUMMY_FIRST_CONTACT, DUMMY_PROCESS_DURATION } from "@/content/dummy";
import { formatCopy } from "@/components/ui/Copy";
import { ContactForm } from "../contact/ContactForm";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";

/**
 * `/process` — 도입 절차.
 *
 * 이 페이지가 답해야 하는 것은 "어떻게 시작하나"가 아니라
 * **"내가 뭘 해야 하나"** 다. 그래서 단계마다 `사장님이 하실 일` 과
 * `반오토가 할 일` 을 나눠 적는다 — 부담 인식을 낮추는 것이 전환에 직접 영향을 준다.
 *
 * ── 4단계에서 5단계로 ──
 * 기획 시안이 `계약` 과 `매니저 배정` 을 분리했다. 둘은 조건이 다르다 —
 * 매니저 배정은 **스탠다드 이상**에서만 일어난다. 한 단계로 묶으면 베이직
 * 점주가 오지 않을 절차를 기다린다.
 *
 * ⚠️ 소요 기간·조건은 미검증이라 샘플이다(`content/dummy.ts`). 상단 배너로 밝힌다.
 */

export const metadata: Metadata = {
  title: "무인매장 관리 도입 절차",
  // 화면 리드와 같은 문장을 쓰지 않는다 — 199행의 `lead` 는 화면에 보이는 글이라
  // 건드리지 않기로 했고(사용자 지시), 검색결과 문장은 키워드를 앞에 둔다.
  description:
    "무인매장 관리를 맡기는 절차입니다. 도입 상담, 매장 방문 진단, 계약과 매니저 배정, 관리 시작까지 각 단계에서 사장님이 하실 일을 나눠 안내합니다.",
};

const STEPS: readonly Step[] = [
  {
    no: "01",
    title: "도입 상담",
    desc: "매장 위치·업종·운영 상황을 확인하고 필요한 관리 범위를 정리합니다.",
    owner: "매장 정보만 알려주시면 됩니다.",
  },
  {
    no: "02",
    title: "매장 방문 진단",
    tag: "필요 시",
    desc: "직접 방문해 청결·기기·재고 상태를 점검하고 매장 전용 체크리스트를 설계합니다.",
    owner: "동석하지 않으셔도 진단은 진행됩니다.",
  },
  {
    no: "03",
    title: "계약",
    desc: "관리 횟수와 범위를 확정하고 계약서를 준비해 안내드립니다.",
    owner: "정리된 범위와 금액을 보고 결정하시면 됩니다.",
  },
  {
    no: "04",
    title: "매니저 배정",
    tag: "현장 운영 지원 옵션",
    desc: "계약일부터 채용을 진행하고, 지역 전담 매니저를 배정해 교육합니다.",
    owner: "따로 준비하실 일은 없습니다.",
  },
  {
    no: "05",
    title: "관리 시작",
    desc: "첫 방문부터 항목별 기록이 앱에 쌓이기 시작합니다.",
    owner: "앱으로 결과를 확인하시면 됩니다.",
  },
];

type Detail = {
  no: string;
  title: string;
  tag?: string;
  yours: readonly string[];
  ours: readonly string[];
};

/** 단계별 상세 — 누가 무엇을 하는지 */
const DETAILS: readonly Detail[] = [
  {
    no: "01",
    title: "도입 상담",
    yours: ["매장 위치와 업종을 알려주세요", "현재 가장 손이 많이 가는 일을 말씀해 주세요"],
    // 기간은 미검증 값이라 히어로 칩과 같은 게이트(`DUMMY_FIRST_CONTACT`)를 거친다.
    // 여기에 문장을 하드코딩하면 실제 값 교체 때 이 줄만 옛 약속으로 남는다.
    ours: [`${DUMMY_FIRST_CONTACT} 전문 상담가가 연락드립니다`, "필요한 관리 범위를 정리합니다"],
  },
  {
    no: "02",
    title: "매장 방문 진단",
    tag: "필요 시 진행",
    yours: ["출입 방법만 알려주시면 됩니다", "동석하지 않으셔도 됩니다"],
    ours: ["청결·기기·재고 상태를 직접 확인합니다", "매장 전용 체크리스트를 설계합니다"],
  },
  {
    no: "03",
    title: "계약",
    yours: ["정리된 범위와 금액을 보고 결정하시면 됩니다"],
    ours: ["관리 횟수와 범위를 확정합니다", "계약서를 준비해 안내드립니다"],
  },
  {
    no: "04",
    title: "매니저 배정",
    tag: "현장 운영 지원 옵션",
    yours: ["별도로 준비하실 일은 없습니다"],
    ours: ["계약일부터 채용을 진행합니다", "지역 전담 매니저를 배정하고 교육합니다"],
  },
  {
    no: "05",
    title: "관리 시작",
    yours: ["앱으로 결과를 확인하시면 됩니다"],
    ours: ["첫 방문부터 항목별 기록을 남깁니다"],
  },
];

/** 도입 이후 — 절차가 끝나고 무엇이 반복되는지 */
const AFTER: Detail = {
  no: "도입 이후",
  title: "리포트 수신",
  yours: [
    "한 달에 한 번, 리포트만 확인하시면 됩니다",
    "궁금하실 땐 앱에서 매니저의 데일리 관리 현황도 바로 살펴보실 수 있습니다",
  ],
  ours: [
    "계약 월부터 매달 운영 리포트를 발송합니다",
    "매니저의 체크리스트·출퇴근 등 데일리 기록을 앱에 쌓아둡니다",
  ],
};

function DetailCard({ d, duration, tone }: { d: Detail; duration?: string; tone?: "after" }) {
  return (
    /*
      `ba-flash-host` — 카드 어디에 커서·포커스가 들어오면 조건부 꼬리표의
      번쩍임이 멈춘다(globals.css). 무한 루프 예외의 안전장치다.
    */
    <article
      className={
        tone === "after"
          ? "ba-flash-host border-brand-200 bg-brand-50 rounded-lg border p-6 lg:p-8"
          : "ba-flash-host border-border rounded-lg border bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-label bg-brand rounded-full px-2.5 py-1 text-white">{d.no}</span>
        <h3 className="text-h3 text-ink">{d.title}</h3>
        {/* 상단 단계 카드와 **같은 컴포넌트**다(사용자 지시 2026-08-18).
            회색 `Badge` 였는데 강조 + 번쩍임이 붙으면서 갈라졌다 */}
        {d.tag && <ConditionalTag>{d.tag}</ConditionalTag>}
        {duration && (
          <span className="text-caption text-text-sub ml-auto shrink-0">{duration}</span>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-bg-subtle rounded-lg p-5">
          <p className="text-label text-text-sub mb-3">사장님이 하실 일</p>
          <ul className="flex flex-col gap-2.5">
            {d.yours.map((t) => (
              <li key={t} className="text-body-sm text-ink">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-brand-200 rounded-lg border bg-white p-5">
          <p className="text-label text-brand mb-3">반오토가 할 일</p>
          <ul className="flex flex-col gap-2.5">
            {d.ours.map((t) => (
              <li key={t} className="text-body-sm text-ink">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function ProcessPage() {
  return (
    <>
      <DummyBanner what="소요 기간" />

      {/* ══ 히어로 — 한 화면 꽉 참 · 강조는 밑줄 하나만 ═════════ */}
      <PageHero
        pageName="도입 절차"
        title={
          <>
            사장님이 하실 일은 <Mark tone="highlight">많지 않습니다</Mark>
          </>
        }
        lead="도입 상담부터 매장 방문 진단, 계약과 매니저 배정, 관리 시작까지. 각 단계에서 사장님이 하실 일과 반오토가 할 일을 나눠 안내합니다."
        aside={
          <ul className="flex flex-wrap justify-center gap-2">
            <li>
              <Badge tone="neutral">{DUMMY_FIRST_CONTACT} 첫 연락</Badge>
            </li>
            <li>
              <Badge tone="neutral">계약 즉시 관리 시작</Badge>
            </li>
          </ul>
        }
        scrollTargetId="steps"
      />

      {/* ══ 한눈에 보기 ══════════════════════════════════════════ */}
      <section id="steps" className="section-py">
        <div className="container-ba">
          <SectionHeader
            label="한눈에 보기"
            title="상담부터 관리 시작까지"
            lead="다섯 단계입니다. 단계를 누르면 그 단계에 머뭅니다."
          />
          <ProcessSteps steps={STEPS} />
        </div>
      </section>

      {/* ══ 단계별 상세 ══════════════════════════════════════════
          "내가 뭘 해야 하나"가 이 페이지의 진짜 질문이다. 두 열로 나눠 답한다. */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <SectionHeader
            label="단계별 상세"
            title="누가 무엇을 하는지 나눠서 보겠습니다"
            lead="왼쪽이 사장님, 오른쪽이 반오토입니다."
          />

          <div className="flex flex-col gap-5">
            {DETAILS.map((d, i) => (
              <Reveal key={d.no} delayMs={i * 60}>
                <DetailCard d={d} duration={DUMMY_PROCESS_DURATION[d.no]} />
              </Reveal>
            ))}

            <Reveal delayMs={DETAILS.length * 60}>
              <DetailCard d={AFTER} duration={DUMMY_PROCESS_DURATION.after} tone="after" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 도입 효과 ════════════════════════════════════════════ */}
      <section className="bg-ink section-py text-white">
        <div className="container-ba">
          <SectionLabel tone="onDark" className="mb-3">
            도입 효과
          </SectionLabel>
          <h2 className="text-h1 mb-8 max-w-[26ch]">
            상담부터 리포트 수신까지, 사장님은 결정만 하시면 됩니다
          </h2>

          <ul className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "빠른 첫 연결",
                body: "신청하시면 전문 상담가가 먼저 연락드립니다.",
              },
              {
                title: "즉시 관리 시작",
                body: "계약과 동시에 첫 방문 기록이 쌓이기 시작합니다.",
              },
            ].map((e) => (
              <li key={e.title} className="flex gap-3">
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
                  <p className="text-h4">{e.title}</p>
                  <p className="text-body-sm mt-1.5 leading-[1.7] text-white/80">
                    {formatCopy(e.body)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 자주 묻는 질문 — 하단 CTA 바로 위 (사용자 지시 2026-08-18) ═════ */}
      <FaqTeaser
        groupId="contract"
        offset={0}
        tone="white"
        title="계약 전에 많이 묻는 것들"
        lead="진행 속도와 계약 조건에 대한 질문입니다."
      />

      {/* ══ 최종 CTA ═════════════════════════════════════════════ */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <Reveal>
            <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">
              첫 단계는 매장 정보를 알려주시는 것뿐입니다
            </h2>
            <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
              상담은 무료이고, 안내받은 내용을 보고 결정하셔도 됩니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {/*
                `/contact` 가 아니라 **이 페이지 아래 폼**으로 보낸다. 바로 아래에
                같은 폼이 있는데 다른 페이지로 내보내면, 읽던 사람을 자기 페이지의
                폼에서 떼어내는 셈이다.
              */}
              <Link href="#consult" className={buttonClasses({ variant: "onDark", size: "lg" })}>
                무료 도입 상담 신청
              </Link>
              <Link
                href="/pricing"
                className={buttonClasses({
                  variant: "ghost",
                  size: "lg",
                  className: "text-white/85 hover:bg-white/12 hover:text-white",
                })}
              >
                요금 먼저 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/*
        ══ 도입 상담 ═════════════════════════════════════════════
        페이지 하단 상담 폼(사용자 지시 2026-08-18). `/contact` 와 홈 상담 섹션이
        쓰는 것과 **똑같은 `ContactForm`** 이다 — 폼을 새로 만들지 않았다. Zod 스키마·
        서버 재검증·저장소 미연결 플래그(`LEAD_SINK_CONFIGURED`)가 전부 그대로
        따라온다. 폼을 복제하면 그 장치들이 한쪽에만 남는다.

        `Suspense` 가 필요한 이유: `ContactForm` 이 `useSearchParams` 를 쓴다.
        정적 생성(`output: "export"`)에서 경계가 없으면 빌드가 막힌다 — 홈의
        상담 섹션도 같은 이유로 감싸고 있다.

        ⚠️ 이 페이지는 이미 라벨을 쓰는 섹션이 3개다(한눈에 보기 · 단계별 상세 ·
           도입 효과). `SectionLabel` 주석의 "섹션 3개당 최대 1개" 기준을 넘는다.
           첨부 시안에 라벨이 있어 그대로 넣었다 — 리듬이 단조로워지면 이 라벨을
           먼저 내린다.
      */}
      <section id="consult" className="section-py scroll-mt-[calc(var(--header-h)+24px)]">
        <div className="container-ba">
          <SectionHeader
            label="도입 상담 신청"
            title="궁금한 점, 편하게 여쭤보세요"
            lead="몇 가지만 남겨주시면 담당자가 매장 상황에 맞춰 편하게 답변드립니다. 상담은 무료이고, 지금 바로 결정하지 않으셔도 괜찮습니다."
          />

          <div className="border-border mx-auto max-w-[52rem] rounded-[24px] border bg-white p-6 shadow-[var(--shadow-card)] md:p-10">
            <Suspense fallback={<p className="text-body-sm text-text-sub">불러오는 중…</p>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
