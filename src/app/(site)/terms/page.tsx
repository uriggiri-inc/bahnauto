import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TERMS } from "@/content/legal/terms";
import { COMPANY } from "@/content/company";

/**
 * `/terms` — 이용약관 (PRD §12 법무 체크리스트).
 *
 * 원본 `(주)우리끼리_이용약관(26.09.01).docx` 를 문장 수정 없이 옮겼다.
 * 수정이 필요하면 원본 문서를 먼저 고치고 `content/legal/terms.ts` 를 갱신한다.
 */

export const metadata: Metadata = {
  title: "이용약관",
  description: "주식회사 우리끼리가 운영하는 홈페이지 및 매장 운영관리 시스템 반오토의 이용약관.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-bg-subtle border-border border-b">
        <div className="container-ba py-12 md:py-16">
          <SectionLabel className="mb-3">약관</SectionLabel>
          <h1 className="text-h1 text-ink mb-4">{TERMS.title}</h1>
          <p className="text-body-sm text-text-sub">시행일 {COMPANY.effectiveDate}</p>
        </div>
      </section>

      <LegalDocument doc={TERMS} />
    </>
  );
}
