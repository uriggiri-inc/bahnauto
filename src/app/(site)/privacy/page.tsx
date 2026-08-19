import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PRIVACY } from "@/content/legal/privacy";
import { COMPANY } from "@/content/company";

/**
 * `/privacy` — 개인정보처리방침 (PRD §12 법무 체크리스트).
 *
 * 원본 `(주)우리끼리_개인정보처리방침(26.09.01).docx` 를 문장 수정 없이 옮겼다.
 *
 * ⚠️ 이 문서 제2조의 홈페이지 상담 수집 항목은 "이름, 연락처" 두 개다.
 *    `/contact` 폼은 그보다 많이 받는다. 오픈 전 반드시 일치시켜야 한다
 *    (`content/legal/privacy.ts` 상단 주석 참고).
 */

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "주식회사 우리끼리의 개인정보 수집·이용·보관·파기 기준과 정보주체의 권리 행사 방법을 안내합니다.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-bg-subtle border-border border-b">
        <div className="container-ba py-12 md:py-16">
          <SectionLabel className="mb-3">개인정보</SectionLabel>
          <h1 className="text-h1 text-ink mb-4">{PRIVACY.title}</h1>
          <p className="text-body-sm text-text-sub">시행일 {COMPANY.effectiveDate}</p>
        </div>
      </section>

      <LegalDocument doc={PRIVACY} />
    </>
  );
}
