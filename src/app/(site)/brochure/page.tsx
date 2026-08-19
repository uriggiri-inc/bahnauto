import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BrochureForm } from "./BrochureForm";
import { formatCopy } from "@/components/ui/Copy";

/**
 * `/brochure` — 서비스 소개서 받기.
 *
 * 히어로의 두 번째 CTA(`서비스 소개서`)가 여기로 온다. 상담을 신청하기에는
 * 아직 이른 사람이 **자료만 먼저 받아보는 경로**다. 그래서 이 화면에서는
 * 상담을 다시 권하지 않는다 — 권하면 소개서를 받으러 온 사람이 폼을 닫는다.
 *
 * ⚠️ 보낼 소개서 파일이 아직 없다(X-10). 그래서 "지금 다운로드"가 아니라
 *    **"확인 후 이메일로 보내드립니다"** 톤으로 쓴다. 파일이 확보되면 완료
 *    화면에 다운로드를 붙인다.
 * ⚠️ 이메일 수집은 개인정보처리방침 개정(X-02)과 함께여야 한다. 그 전까지
 *    운영 환경에서는 접수가 성사되지 않는다(`actions.ts`).
 */

export const metadata: Metadata = {
  title: "서비스 소개서 받기",
  description:
    "반오토 서비스 소개서를 이메일로 보내드립니다. 회사명과 이메일, 연락처만 남겨주시면 담당자가 확인 후 발송합니다.",
};

/** 소개서에 무엇이 들어 있는지 — 받기 전에 알면 남길 이유가 생긴다 */
const CONTENTS = [
  {
    title: "관리 범위와 기능",
    body: "운영 대시보드부터 네이버 플레이스 관리까지, 여덟 가지 기능이 어디까지를 맡는지 정리했습니다.",
  },
  {
    title: "요금제 구성",
    body: "베이직·스탠다드·프리미엄이 각각 어떤 기능을 묶는지, 옵션은 어떻게 붙는지 담았습니다.",
  },
  {
    title: "도입 절차",
    body: "상담부터 관리 시작까지 각 단계에서 사장님이 하실 일과 반오토가 할 일을 나눠 적었습니다.",
  },
];

export default function BrochurePage() {
  return (
    <section className="section-py">
      <div className="container-ba grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* ── 왼쪽: 안내 ── */}
        <div>
          <SectionLabel className="mb-3">서비스 소개서</SectionLabel>
          <h1 className="text-display text-ink mb-5 max-w-[18ch]">
            먼저 자료로 확인해 보셔도 됩니다
          </h1>
          <p className="text-body-lg text-text-sub mb-10 max-w-[34rem]">
            상담 전에 어떤 서비스인지 먼저 보고 싶으시다면 소개서를 보내드립니다. 담당자가 확인한 뒤
            남겨주신 이메일로 발송해 드립니다.
          </p>

          <ul className="flex flex-col gap-5">
            {CONTENTS.map((c) => (
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

          <p className="text-caption text-text-sub border-border mt-10 border-t pt-5">
            바로 이야기 나누고 싶으시면{" "}
            <Link href="/contact" className="text-brand font-semibold underline underline-offset-2">
              도입 상담 신청
            </Link>
            으로 가셔도 됩니다.
          </p>
        </div>

        {/* ── 오른쪽: 폼 ── */}
        <div className="border-border rounded-[24px] border bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <h2 className="text-h3 text-ink mb-2">어디로 보내드릴까요</h2>
          <p className="text-body-sm text-text-sub mb-7">
            세 가지만 남겨주시면 됩니다. 다른 정보는 받지 않습니다.
          </p>
          <BrochureForm />
        </div>
      </div>
    </section>
  );
}
