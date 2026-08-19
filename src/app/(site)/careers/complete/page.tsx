import type { Metadata } from "next";
import Link from "next/link";
import { RingMark } from "@/components/brand/RingMark";
import { buttonClasses } from "@/components/ui/Button";

/**
 * 지원서 접수 완료.
 *
 * 색인하지 않는다 — 검색으로 바로 들어오면 지원하지 않은 사람이 지원했다고 오해한다.
 */

export const metadata: Metadata = {
  title: "지원서가 접수되었습니다",
  robots: { index: false, follow: false },
};

export default function CareersCompletePage() {
  return (
    <section className="section-py">
      <div className="container-ba flex flex-col items-center py-10 text-center">
        <RingMark size={88} label="반오토" />

        <h1 className="text-h1 text-ink mt-8 mb-4 max-w-[22ch]">지원서가 접수되었습니다</h1>
        <p className="text-body-lg text-text-sub mb-10 max-w-[42rem]">
          서류를 확인한 뒤 연락드리겠습니다. 희망 근무 지역에 배정 가능한 매장이 생기면 우선
          안내드립니다.
        </p>

        <div className="border-border w-full max-w-[520px] rounded-lg border bg-white p-6 text-left shadow-[var(--shadow-card)]">
          <p className="text-h4 text-ink mb-4">기다리시는 동안</p>
          <ul className="flex flex-col gap-3">
            <li className="text-body-sm text-text-sub">
              연락은 지원서에 적어주신 번호로 드립니다. 모르는 번호로 표시될 수 있습니다.
            </li>
            <li className="text-body-sm text-text-sub">경력이 없으셔도 교육 후 배정됩니다.</li>
            <li className="text-body-sm text-text-sub">
              준비물은 스마트폰뿐입니다. 청소 도구는 매장에 있습니다.
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/system" className={buttonClasses({ size: "lg" })}>
            어떻게 일하는지 보기
          </Link>
          <Link href="/" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            홈으로
          </Link>
        </div>
      </div>
    </section>
  );
}
