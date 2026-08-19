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
 *    라벨 규칙(PRD §2.1)이 무너진다. `/app` 은 그대로 앱 안내로 남는다.
 * ⚠️ 체험 **기간(14일·7일)은 미확정**이다. 어떤 문구에도 숫자를 쓰지 않는다
 *    (`content/plans.ts` 머리 주석).
 * ⚠️ 개인정보처리방침 개정(X-02)과 저장소 연결(X-08) 전까지 운영 환경에서는
 *    접수가 성사되지 않는다(`actions.ts` — X-17).
 */

export const metadata: Metadata = {
  title: "무료체험 신청",
  description:
    "반오토 웹버전 대시보드를 먼저 사용해 보실 수 있습니다. 성함과 연락처, 매장명만 남겨주시면 체험 계정과 사용 방법을 안내해 드립니다.",
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
          <p className="text-body-lg text-text-sub mb-10 max-w-[34rem]">
            반오토 웹버전 대시보드를 먼저 사용해 보실 수 있습니다. 매니저가 무엇을 기록하고 점주가
            무엇을 보는지, 화면에서 바로 확인하시는 편이 빠릅니다.
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
            체험(웹 대시보드)과 계약 후 앱을 구분해 둔다. 이 한 줄이 없으면
            체험 계정으로 앱에 로그인하려다 실패하는 경로가 생긴다.
          */}
          <p className="text-caption text-text-sub border-border mt-10 border-t pt-5">
            체험은 웹버전 대시보드로 제공됩니다. 모바일 앱은 계약 체결 후 계정이 발급되며 자세한
            내용은{" "}
            <Link href="/app" className="text-brand font-semibold underline underline-offset-2">
              앱 안내
            </Link>
            에서 보실 수 있습니다. 바로 이야기 나누고 싶으시면{" "}
            <Link href="/contact" className="text-brand font-semibold underline underline-offset-2">
              도입 상담 신청
            </Link>
            으로 가셔도 됩니다.
          </p>
        </div>

        {/* ── 오른쪽: 폼 ── */}
        <div className="border-border rounded-[24px] border bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <h2 className="text-h3 text-ink mb-2">어디로 안내해 드릴까요</h2>
          <p className="text-body-sm text-text-sub mb-7">
            세 가지만 남겨주시면 됩니다. 다른 정보는 받지 않습니다.
          </p>
          <TrialForm />
        </div>
      </div>
    </section>
  );
}
