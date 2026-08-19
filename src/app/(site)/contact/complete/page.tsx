import type { Metadata } from "next";
import Link from "next/link";
import { RingMark } from "@/components/brand/RingMark";
import { buttonClasses } from "@/components/ui/Button";

/**
 * 상담 신청 완료 (PRD §7.6 AC — 제출 성공 시 이동하는 화면).
 *
 * 완료 화면의 일은 두 가지다. **접수됐다는 확신**과 **다음에 무슨 일이 일어나는지**.
 * "감사합니다"만 띄우면 사람은 자기가 뭘 기다려야 하는지 모른 채 나간다.
 *
 * 색인하지 않는다 — 검색으로 이 페이지에 바로 들어오면 접수하지 않은 사람이
 * 접수했다고 오해한다.
 *
 * TODO(§9.5): GA4 `generate_lead` 와 네이버 전환 스크립트를 여기서 발화시킨다.
 *   지금은 애널리틱스 자체가 붙어 있지 않다.
 */

export const metadata: Metadata = {
  title: "상담 신청이 접수되었습니다",
  robots: { index: false, follow: false },
};

export default function ContactCompletePage() {
  return (
    <section className="section-py">
      <div className="container-ba flex flex-col items-center py-10 text-center">
        <RingMark size={88} label="반오토" />

        <h1 className="text-h1 text-ink mt-8 mb-4 max-w-[22ch]">신청이 접수되었습니다</h1>
        <p className="text-body-lg text-text-sub mb-10 max-w-[42rem]">
          담당자가 확인 후 연락드리겠습니다. 매장 상황을 먼저 여쭙고, 방문 진단 일정을 함께
          정하겠습니다.
        </p>

        <div className="border-border w-full max-w-[520px] rounded-lg border bg-white p-6 text-left shadow-[var(--shadow-card)]">
          <p className="text-h4 text-ink mb-4">기다리시는 동안</p>
          <ul className="flex flex-col gap-3">
            <li className="text-body-sm text-text-sub">
              연락은 신청하신 번호로 드립니다. 모르는 번호로 표시될 수 있습니다.
            </li>
            <li className="text-body-sm text-text-sub">
              방문 진단에 사장님이 동석하지 않으셔도 진행됩니다.
            </li>
            <li className="text-body-sm text-text-sub">진단까지는 비용이 발생하지 않습니다.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/system" className={buttonClasses({ size: "lg" })}>
            운영 시스템 살펴보기
          </Link>
          <Link href="/" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            홈으로
          </Link>
        </div>
      </div>
    </section>
  );
}
