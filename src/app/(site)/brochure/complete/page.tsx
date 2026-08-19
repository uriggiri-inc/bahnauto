import type { Metadata } from "next";
import Link from "next/link";
import { RingMark } from "@/components/brand/RingMark";
import { buttonClasses } from "@/components/ui/Button";

/**
 * 소개서 요청 완료.
 *
 * ⚠️ 소개서 파일이 아직 없다(X-10). 그래서 이 화면에 **다운로드 버튼을 두지
 *    않는다.** 없는 파일로 이어지는 버튼은 신뢰를 가장 빨리 깎는 종류다.
 *    파일이 확보되면 여기에 다운로드를 붙이고 문구를 바꾼다.
 *
 * 색인하지 않는다 — 검색으로 바로 들어오면 신청하지 않은 사람이 신청했다고
 * 오해한다.
 */

export const metadata: Metadata = {
  title: "소개서 요청이 접수되었습니다",
  robots: { index: false, follow: false },
};

export default function BrochureCompletePage() {
  return (
    <section className="section-py">
      <div className="container-ba flex flex-col items-center py-10 text-center">
        <RingMark size={88} label="반오토" />

        <h1 className="text-h1 text-ink mt-8 mb-4 max-w-[22ch]">요청이 접수되었습니다</h1>
        <p className="text-body-lg text-text-sub mb-10 max-w-[42rem]">
          담당자가 확인한 뒤 남겨주신 이메일로 서비스 소개서를 보내드립니다.
        </p>

        <div className="border-border w-full max-w-[520px] rounded-lg border bg-white p-6 text-left shadow-[var(--shadow-card)]">
          <p className="text-h4 text-ink mb-4">기다리시는 동안</p>
          <ul className="flex flex-col gap-3">
            <li className="text-body-sm text-text-sub">
              메일이 스팸함으로 분류될 수 있습니다. 보이지 않으면 확인해 주세요.
            </li>
            <li className="text-body-sm text-text-sub">
              소개서 내용은 주요기능·요금 안내 페이지에서도 보실 수 있습니다.
            </li>
            <li className="text-body-sm text-text-sub">
              바로 상담을 원하시면 도입 상담 신청을 남겨주셔도 됩니다.
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/features/dashboard" className={buttonClasses({ size: "lg" })}>
            주요기능 살펴보기
          </Link>
          <Link href="/" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            홈으로
          </Link>
        </div>
      </div>
    </section>
  );
}
