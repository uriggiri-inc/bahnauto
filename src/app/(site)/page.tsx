import { Suspense } from "react";
import Link from "next/link";
import { RingMark } from "@/components/brand/RingMark";
import { DummyBanner } from "@/components/marketing/DummyBanner";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { PlanCards } from "@/components/marketing/PlanCards";
import { ProblemStory } from "@/components/marketing/ProblemStory";
import { ProcessSteps, type Step } from "@/components/marketing/ProcessSteps";
import { ReviewSlider } from "@/components/marketing/ReviewSlider";
import { TypingHeadline } from "@/components/marketing/TypingHeadline";
import { SectionShell, COLS_CLASS } from "@/components/marketing/SectionShell";
import { ResetScrollOnReload } from "@/components/ui/ResetScrollOnReload";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { Stat } from "@/components/ui/Stat";
import { buttonClasses } from "@/components/ui/Button";
import { DUMMY_STATS, DUMMY_COMPANY } from "@/content/dummy";
import { activeSections, type HomeSection } from "@/content/home.config";
import { ContactForm } from "./contact/ContactForm";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 홈 — **`content/home.config.ts` 를 위에서부터 그린다.**
 *
 * 섹션 순서·표시 여부·문구·크기 토큰은 이 파일에 없다. 전부 설정에 있고,
 * `/lab/editor` 가 그 설정을 고쳐 쓴다. 그래서 구성을 바꾸는 데 JSX 를
 * 건드릴 필요가 없다.
 *
 * 이 파일이 아직 들고 있는 것은 **설정으로 뽑아낼 수 없는 것**뿐이다 —
 * 어떤 종류에 어떤 컴포넌트가 붙는지(`renderBody`), 그리고 페인 카드·도입
 * 절차처럼 구조가 고정된 데이터다. 이것들까지 설정으로 밀어 넣으면 설정이
 * 두 번째 코드베이스가 된다.
 *
 * ⚠️ 실적 수치·후기·요금은 전부 잠정값이다. `DummyBanner` 가 상단에서
 *    그 사실을 밝힌다. 개별 섹션에서 배너 조건을 바꾸지 않는다.
 */

/*
 * 4대 페인 상수(`PAINS`)를 걷어냈다. 기획 확정(2026-08-14)으로 문제제기 섹션이
 * 카드 네 장에서 **핀 스크롤 서사**로 전면 교체됐고, 장면 데이터는
 * `ProblemStory.tsx` 안에 있다(`ScrollStory*` 전례를 따름).
 *
 * ⚠️ `PainCard.tsx` 컴포넌트와 `/public/pains/*.webp` 는 지우지 않았다.
 *    카드형으로 되돌릴 가능성이 남아 있다. (한때 `FeatureGrid` 가 이 카드의
 *    hover 덮개 패턴을 따랐지만, 2026-08-27 목업 교체로 그 덮개가 없어졌다 —
 *    이제 두 컴포넌트는 서로를 참조하지 않는다.)
 */

/** 도입 4단계 (PRD §7.4). 소요 기간은 미검증이라 싣지 않는다 */
const STEPS: readonly Step[] = [
  {
    no: "01",
    title: "도입 상담",
    desc: "매장 위치·업종·운영 시간을 확인하고 필요한 관리 범위를 정리합니다.",
    owner: "사장님은 매장 정보만 알려주시면 됩니다.",
  },
  {
    no: "02",
    title: "매장 방문 진단",
    desc: "직접 방문해 청결·기기·재고 상태를 점검하고 매장 전용 체크리스트를 설계합니다.",
    owner: "동석하지 않으셔도 진단은 진행됩니다.",
  },
  {
    no: "03",
    title: "계약 및 매니저 배정",
    desc: "관리 횟수와 범위를 확정하고, 지역 전담 매니저를 배정합니다.",
    owner: "확정된 범위와 금액을 보고 결정하시면 됩니다.",
  },
  {
    no: "04",
    title: "관리 시작 · 리포트 수신",
    desc: "첫 방문부터 기록이 쌓이고, 매일 리포트가 발송됩니다.",
    owner: "앱으로 결과를 확인하시면 됩니다.",
  },
];

/** 서비스 출시 이유 — 직영 운영 이력이 근거다 */
const WHY = [
  {
    title: "우리가 먼저 겪었습니다",
    body: `${DUMMY_COMPANY.ownStoreOpenedAt}부터 직영 ${DUMMY_COMPANY.ownStoreType}를 운영했습니다. 밤에 다시 매장에 나가고, 유통기한을 놓치고, 손님 전화를 받는 일을 전부 직접 했습니다.`,
  },
  {
    title: "기준을 문서로 만들었습니다",
    body: "사람이 바뀌어도 매장 상태가 같으려면 기준이 머리가 아니라 문서에 있어야 했습니다. 매장별 체크리스트는 그렇게 나왔습니다.",
  },
  {
    title: "우리 매장에 먼저 썼습니다",
    body: "관리 앱을 직접 만들어 직영점에 먼저 적용했습니다. 여기서 굴러간 뒤에야 외부 매장에 제공하기로 했습니다.",
  },
];

/** 번호가 붙은 카드 — why 섹션과 generic `cards` 가 함께 쓴다 */
function NumberedCards({
  items,
  cols,
}: {
  items: { title: string; body: string }[];
  cols: 2 | 3 | 4;
}) {
  return (
    <ol className={`grid gap-5 ${COLS_CLASS[cols]}`}>
      {items.map((w, i) => (
        <Reveal key={w.title} delayMs={i * 70}>
          <li className="border-border h-full rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]">
            <span className="text-label text-brand tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-h4 text-ink mt-3">{w.title}</h3>
            <p className="text-body-sm text-text-sub mt-2 leading-[1.7]">{formatCopy(w.body)}</p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

/**
 * 히어로만 껍데기를 쓰지 않는다 — 배경 그라디언트와 스크롤 큐가 붙고,
 * 제목이 `<h2>` 가 아니라 타이핑 `<h1>` 이기 때문이다.
 *
 * 목차 장치(떠 있는 칩 `HeroChips`, 좌측 레일 `HomeSideNav`)는 사용자 확정
 * (2026-08-14)으로 홈에서 전부 뺐다 — 컴포넌트 파일은 되살릴 가능성이 있어
 * 남겨 두었다.
 */
function Hero({ section, firstAnchor }: { section: HomeSection; firstAnchor?: string }) {
  return (
    // 한 화면을 꽉 채운다(사용자 확정 2026-08-14) — 다음 섹션이 걸쳐 보이지 않는다.
    // 높이는 "뷰포트 − 상단 고정 헤더". 내용은 가운데, 스크롤 큐는 바닥에 붙는다.
    <section
      className="from-brand-50 relative flex min-h-[calc(var(--screen-h)-var(--header-h))] flex-col bg-gradient-to-b to-white"
      id={section.id}
    >
      <div className="container-ba flex flex-1 flex-col items-center justify-center py-14 text-center">
        {section.text.label && (
          <p className="border-brand-200 text-label text-brand mb-7 inline-flex items-center gap-2 rounded-full border bg-white py-2 pr-4 pl-2 shadow-[var(--shadow-card)]">
            {/* 24px — 브랜드 최소 노출 크기. 18px 로 들어가 있어 링이 뭉쳐
                보였다(사용자 지적 2026-08-18). `RingMark` 가 이제 그 아래를
                자동으로 올리지만, 호출부에도 실제 값을 적어 둔다 */}
            <RingMark size={24} animate={false} />
            {section.text.label}
          </p>
        )}

        <TypingHeadline className="text-display text-ink max-w-[24ch]" />

        {section.text.lead && (
          <p className="text-body-lg text-text-sub mt-7 max-w-[38rem]">
            {formatCopy(section.text.lead)}
          </p>
        )}

        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href="/contact" className={buttonClasses({ size: "lg" })}>
            도입 상담 신청
          </Link>

          {/* 소개서 받기 화면 — 회사명·이메일·연락처만 받고 메일로 보낸다 */}
          <Link href="/brochure" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            서비스 소개서
          </Link>
        </div>

        <p className="text-body-sm text-text-sub mt-4">
          상담과 방문 진단은 무료입니다. 보시고 결정하셔도 됩니다.
        </p>
      </div>

      {firstAnchor && (
        <div className="flex justify-center pb-8">
          <ScrollCue targetId={firstAnchor} />
        </div>
      )}
    </section>
  );
}

/** 종류 → 본문. 껍데기(제목·여백·배경)는 SectionShell 이 이미 그렸다 */
function renderBody(s: HomeSection) {
  const cols = s.style.cols ?? 3;

  switch (s.kind) {
    /*
     * "pains" 는 여기로 오지 않는다 — `HomePage` 가 `SectionShell` 을 거치지
     * 않고 `ProblemStory` 를 직접 그린다. 그 섹션은 뷰포트를 꽉 채우는
     * 레이아웃이라 껍데기의 컨테이너·세로 여백과 맞지 않는다(히어로와 같은 사유).
     */

    case "beforeAfter":
      return <BeforeAfter />;

    case "why":
      return (
        <>
          <NumberedCards items={WHY} cols={cols} />

          {/*
            실적 4종. 순서는 기획 지정 — 가맹점 수 / 재계약률 / 누적방문 / 연간이용자.

            좁은 화면도 **2열**이다(사용자 지시 2026-08-18). 1열 + gap-8 이면 네 항목이
            세로로 늘어져 화면 하나를 통째로 먹었다. 숫자가 가장 긴 `12,400회` 가
            360px 폭 한 칸(약 150px)에 들어가는지 실측해 2열로 정했다 —
            `text-h1` 이 그 폭에서 clamp 최솟값 28px 로 내려가기 때문에 여유가 있다.
            세로 간격만 줄인다(gap-y-6): 가로 간격까지 좁히면 두 열이 붙어 읽힌다.
          */}
          <div className="border-border mt-10 grid grid-cols-2 gap-x-5 gap-y-6 border-t pt-8 sm:mt-14 sm:gap-8 sm:pt-10 lg:grid-cols-4">
            {DUMMY_STATS.map((st, i) => (
              <Reveal key={st.label} delayMs={i * 60}>
                <Stat value={st.value} unit={st.unit} label={st.label} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8">
            {/*
              운영사 우리끼리(주) 홈페이지로 나간다(사용자 지시 2026-08-18).
              푸터의 `회사 소개` 와 **같은 곳을 가리킨다** — 이전에는 푸터는 외부,
              이 버튼은 내부 `/company` 라 같은 이름이 두 곳을 가리켰다.

              `next/link` 가 아니라 `<a>` 다: 라우터 프리페치가 외부 주소에는
              의미가 없고, 새 창 지정도 하지 않는다. `noopener` 로 새 창이
              원본 창을 조작하지 못하게 막는다.
            */}
            <a
              href="https://uriggiri.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "secondary" })}
            >
              회사 소개
              <span className="sr-only"> (새 창으로 열림)</span>
              <span aria-hidden className="ml-1.5">
                ↗
              </span>
            </a>
          </div>
        </>
      );

    case "features":
      /*
        기획 확정(2026-08-14): 격자 아래에 있던 체크리스트 증거 블록
        ("관리했습니다라는 말 대신…" + ChecklistDemo + 앱 화면 2장)을 통째로
        내렸다. 카드를 훑는 자리에서 기능 하나(운영 대시보드)만 크게 증명하면
        나머지가 곁가지로 보이고, 섹션이 화면 세 배로 길어져 바로 아래 요금까지
        닿지 않았다.
        그 증거는 `/features` 의 해당 기능 상세가 맡는다 — 이제 카드마다
        그쪽으로 바로 갈 수 있다.
        ⚠️ `ChecklistDemo` 컴포넌트는 지우지 않았다. `/system`
           등 다른 화면이 쓰고 있고, 캡처가 확보되면 되살릴 수 있다.

        ── 안내 한 줄을 뺐다 (2026-08-27) ──
        "카드에 커서를 올리면 무엇이 포함되는지 나옵니다" 가 있었다. 카드가
        **처음부터 펼쳐진 모습**으로 바뀌어(목업대로) 접힘 자체가 없어졌으므로
        가리킬 대상이 없다.
      */
      return (
        <>
          <FeatureGrid />

          <div className="mt-8">
            <Link href="/features/dashboard" className={buttonClasses({ variant: "secondary" })}>
              주요기능 자세히 보기
            </Link>
          </div>
        </>
      );

    case "pricing":
      return (
        <>
          <PlanCards />
          <div className="mt-8 flex justify-center">
            <Link href="/pricing" className={buttonClasses({ variant: "ghost" })}>
              요금 안내 자세히 보기
            </Link>
          </div>
        </>
      );

    case "reviews":
      return <ReviewSlider />;

    case "process":
      return (
        <>
          <ProcessSteps steps={STEPS} />
          <div className="mt-8">
            <Link href="/process" className={buttonClasses({ variant: "secondary" })}>
              도입 절차 자세히 보기
            </Link>
          </div>
        </>
      );

    case "contact":
      return (
        <div className="border-border mx-auto max-w-[52rem] rounded-[24px] border bg-white p-6 shadow-[var(--shadow-card)] md:p-10">
          {/* ContactForm 은 useSearchParams 를 쓴다 — 정적 생성에 Suspense 경계가 필요하다 */}
          <Suspense fallback={<p className="text-body-sm text-text-sub">불러오는 중…</p>}>
            <ContactForm />
          </Suspense>
        </div>
      );

    /* ── 편집기에서 새로 만들 수 있는 범용 틀 ── */

    case "text":
      // 제목·리드만 있는 섹션. 껍데기가 이미 다 그렸다
      return null;

    case "cards":
      return <NumberedCards items={s.items ?? []} cols={cols} />;

    case "twoCol":
      return (
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {(s.items ?? []).slice(0, 2).map((it) => (
            <div key={it.id}>
              <h3 className="text-h3 text-ink">{it.title}</h3>
              <p className="text-body text-text-sub mt-4 leading-[1.7]">{formatCopy(it.body)}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

export default function HomePage() {
  const sections = activeSections();

  // 히어로의 스크롤 큐가 가리킬 곳 = 히어로 다음으로 켜져 있는 섹션
  const firstAfterHero = sections.find((s) => s.kind !== "hero")?.id;

  return (
    <>
      {/* 새로고침하면 저장된 스크롤 위치 대신 맨 위 히어로부터 보인다 */}
      <ResetScrollOnReload />

      {/* 실적 수치·후기·요금이 전부 샘플이다 */}
      <DummyBanner what="실적 수치와 후기, 요금" />

      {/* 목차 장치(좌측 레일 `HomeSideNav`, 히어로 칩 `HeroChips`)는 사용자
          확정(2026-08-14)으로 홈에서 전부 뺐다 — SNB 는 기능별 상세 페이지
          (`/features/[key]`)에만 붙는다. 컴포넌트 파일은 남겨 두었다. */}

      {/*
        껍데기(`SectionShell`)를 쓰지 않는 종류가 둘이다.
          hero  — 배경 그라디언트·스크롤 큐·목차 칩이 붙고 제목이 타이핑 `<h1>` 이다
          pains — 뷰포트를 꽉 채우는 문제 패널 레이아웃이다(`ProblemStory`)
        두 경우 모두 설정의 `style`(padY·bg·titleSize)은 쓰이지 않는다.
        문구(label·title)는 그대로 설정에서 온다.
      */}
      {sections.map((s) =>
        s.kind === "hero" ? (
          <Hero key={s.id} section={s} firstAnchor={firstAfterHero} />
        ) : s.kind === "pains" ? (
          <ProblemStory key={s.id} id={s.id} label={s.text.label} title={s.text.title} />
        ) : (
          <SectionShell
            key={s.id}
            id={s.id}
            text={s.text}
            titleSize={s.style.titleSize}
            padY={s.style.padY}
            bg={s.style.bg}
            align={s.style.align}
            // 후기 슬라이드는 카드가 화면 끝까지 흘러야 한다
            bleed={s.kind === "reviews"}
            // 홈 전 섹션이 한 화면씩 꽉 찬다(사용자 확정 2026-08-14)
            fill
          >
            {renderBody(s)}
          </SectionShell>
        ),
      )}
    </>
  );
}
