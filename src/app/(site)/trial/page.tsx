import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TrialForm } from "./TrialForm";
import { formatCopy } from "@/components/ui/Copy";

/**
 * `/trial` — 무료체험 신청.
 *
 * 요금제 베이직 카드와 GNB 우측 유틸이 여기로 온다. 상담을 신청하기에는 아직
 * 이른 사람이 **화면을 먼저 만져보는 경로**다. 그래서 이 화면에서는 상담을
 * 앞세우지 않는다 — 앞세우면 써보러 온 사람이 폼을 닫는다.
 * (`/brochure` 와 같은 구성: 좌 안내 · 우 폼)
 *
 * ⚠️ 체험 대상은 **반오토 웹버전 대시보드**다. 계약 후 발급되는 모바일 앱
 *    계정과 다르다 — 두 가지를 같은 말로 부르면 "계약 점주·매니저 전용"
 *    라벨 규칙(PRD §2.1)이 무너진다. `/app` 라우트는 그대로 남는다.
 * ⚠️ 개인정보처리방침 개정(X-02)과 저장소 연결(X-08) 전까지 운영 환경에서는
 *    접수가 성사되지 않는다(`actions.ts` — X-17).
 *
 * ── 체험 기간은 14일로 확정됐다 (사용자 지시 2026-09-04) ──
 * 그 전까지는 노션이 14일, 트라이얼 기획서가 7일로 갈려 있어 "어떤 문구에도 숫자를
 * 쓰지 않는다" 는 규칙이 있었다(현황판 X-15). 확정과 함께 아래 안내 문구에 숫자가
 * 들어갔다. 기간이 또 바뀌면 이 페이지와 `content/plans.ts` 를 **함께** 고친다 —
 * 한쪽만 고치면 화면끼리 다른 기간을 말한다.
 */

export const metadata: Metadata = {
  title: "무료체험 신청",
  /* 수집 항목이 바뀌면 이 문장도 함께 고친다 — 2026-09-04 양식 통일로 이메일이 늘었다.
     ⚠️ 2026-09-08부터 이 문장과 **히어로 리드가 같은 절차**를 말한다. 한쪽만 고치면
        검색 결과와 화면이 다른 말을 한다 — 아래 리드 주석을 함께 본다. */
  description:
    "반오토 웹버전 대시보드를 먼저 사용해 보실 수 있습니다. 신청해 주시면 담당자가 연락드려 앱 설치와 계정 만드는 것까지 도와드리고 14일 무료체험을 열어드립니다.",
};

/** 체험에서 무엇을 볼 수 있는지 — 알고 들어가야 열어보게 된다 */
const WHAT_YOU_SEE = [
  {
    title: "업무 체크리스트",
    body: "매장에서 그날 할 항목이 어떻게 뜨고, 사진이 어떻게 남는지 직접 눌러보실 수 있습니다.",
  },
  {
    title: "데일리 리포트",
    body: "점주 화면에서 하루가 어떤 형식으로 요약되는지 확인하실 수 있습니다.",
  },
  {
    title: "재고 · 서류 화면",
    body: "재고 현황과 인허가 만료 알림이 어떤 모습으로 정리되는지 보실 수 있습니다.",
  },
];

export default function TrialPage() {
  return (
    <section className="section-py">
      <div className="container-ba grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* ── 왼쪽: 안내 ── */}
        <div>
          <SectionLabel className="mb-3">무료체험</SectionLabel>
          <h1 className="text-display text-ink mb-5 max-w-[18ch]">
            설명 듣기 전에, 직접 눌러보셔도 됩니다
          </h1>
          {/*
            ── 2026-09-08 리드에 절차를 올렸다 (사용자 지시) ──
            그 전까지 "신청 후 담당자가 연락드려 14일 무료체험을 열어드립니다" 는 페이지
            **맨 아래 각주**(작은 글씨)에만 있었다. 신청 뒤에 무슨 일이 일어나는지 알려면
            페이지를 끝까지 내려야 하는 구조였다 — 절차는 리드가 말해야 한다. 아래 각주에서는
            같은 말을 뺐다(한 화면에서 두 번 말하지 않는다). 각주에는 링크 안내만 남았다.

            위 `metadata.description` 과 **같은 절차**를 말한다. 한쪽을 고치면 다른 쪽도
            고친다 — 검색 결과와 화면이 다른 말을 하면 안 된다.

            `14일` 은 확정된 숫자다(2026-09-04). 다만 요금 카드 버튼 라벨에는 넣지 않는다 —
            기간이 바뀌면 버튼까지 따라 고쳐야 한다(`content/plans.ts` 주석).

            `formatCopy` 로 문장마다 줄을 나눈다(2026-08-18 사용자 확정 규칙). 문자열만
            조판되므로 리드는 **순수 문자열**로 유지한다.
          */}
          <p className="text-body-lg text-text-sub mb-10 max-w-[34rem]">
            {formatCopy(
              "반오토 웹버전 대시보드를 먼저 사용해 보실 수 있습니다. 신청해 주시면 담당자가 연락드려 앱 설치와 계정 만드는 것까지 도와드리고 14일 무료체험을 열어드립니다. 매니저가 무엇을 기록하고 점주가 무엇을 보는지, 화면에서 바로 확인하시는 편이 빠릅니다.",
            )}
          </p>

          <ul className="flex flex-col gap-5">
            {WHAT_YOU_SEE.map((c) => (
              <li key={c.title} className="flex gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="mt-1 shrink-0"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
                <div>
                  <p className="text-h4 text-ink">{c.title}</p>
                  <p className="text-body-sm text-text-sub mt-1.5 leading-[1.7]">
                    {formatCopy(c.body)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/*
            ── 2026-09-04 절차 문구를 여기 넣었다 → 2026-09-08 리드로 올렸다 ──
            "신청 후 담당자가 연락드려 14일 무료체험을 열어드립니다" 는 이제 위 히어로
            리드에 있다. 여기에 다시 적지 않는다 — 한 화면에서 같은 말을 두 번 하면 둘 중
            하나가 낡을 때 서로 다른 말을 하게 된다. 이 각주에는 **링크 안내만** 남긴다.

            ⚠️ 링크를 `/app` 에서 **주요기능**으로 바꿨다(사용자 지시). `/app` 은
               `계약 점주·매니저 전용` 다운로드 페이지라 아직 계약자가 아닌 체험
               신청자를 보내면 막힌 문 앞에 세우는 셈이다. 앱 화면 16장은
               `FeatureDetailSection` 을 통해 **주요기능 상세**에 있으므로 거기서 본다.
          */}
          <p className="text-caption text-text-sub border-border mt-10 border-t pt-5">
            앱 안내는{" "}
            <Link
              href="/features"
              className="text-brand font-semibold underline underline-offset-2"
            >
              주요기능
            </Link>
            , 상담은{" "}
            <Link href="/contact" className="text-brand font-semibold underline underline-offset-2">
              도입 상담 신청
            </Link>
            에서 이어가실 수 있습니다.
          </p>
        </div>

        {/* ── 오른쪽: 폼 ── */}
        <div className="border-border rounded-[24px] border bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <h2 className="text-h3 text-ink mb-2">어디로 안내해 드릴까요</h2>
          {/* ⚠️ 이 줄은 **폼의 필수 칸 수**를 말한다. 항목을 더하거나 뺄 때 반드시 함께
              고친다 — 숫자가 화면과 어긋나면 그 자체로 신뢰를 깎는다.
                2026-09-04  소개서 폼과 양식 통일하며 이메일·유입경로 추가 → 필수 넷
                2026-09-08  연락 가능 시간대 추가 → 필수 **다섯**
                            (성함 · 연락처 · 연락 가능 시간대 · 이메일 · 회사명 또는 매장명.
                             유입 경로는 선택이라 세지 않는다)
              ⚠️ 소개서 폼(`brochure/page.tsx`)에도 같은 줄이 있지만 **그쪽은 필수 넷 그대로**다 —
                 연락 가능 시간대는 무료체험에만 넣었다(사용자 확정 2026-09-08). 두 숫자를
                 같게 맞추려 하지 않는다. */}
          <p className="text-body-sm text-text-sub mb-7">
            다섯 가지만 남겨주시면 됩니다. 다른 정보는 받지 않습니다.
          </p>
          <TrialForm />
        </div>
      </div>
    </section>
  );
}
