import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BROCHURE_CONTENTS, BROCHURE_FILE } from "@/content/brochure";
import { BrochureForm } from "./BrochureForm";
import { formatCopy } from "@/components/ui/Copy";

/**
 * `/brochure` — 서비스 소개서 받기.
 *
 * 히어로의 두 번째 CTA(`서비스 소개서`)가 여기로 온다. 상담을 신청하기에는
 * 아직 이른 사람이 **자료만 먼저 받아보는 경로**다. 그래서 이 화면에서는
 * 상담을 다시 권하지 않는다 — 권하면 소개서를 받으러 온 사람이 폼을 닫는다.
 *
 * ── 흐름이 바뀌었다 (사용자 지시 2026-08-28) ──
 * 보낼 파일이 없던 동안은 "확인 후 이메일로 보내드립니다" 톤이었다(X-10).
 * 소개서 PDF 를 받아 `public/brochure/` 에 넣었으므로 이제 **바로 다운로드**다:
 * 이 폼을 통과하면 완료 화면에서 파일을 내려받는다. 메일 발송을 약속하지
 * 않는다 — 정적 사이트에는 메일을 보낼 서버가 없다.
 *
 * ⚠️⚠️ **입력값은 아직 어디에도 저장되지 않는다.** 정적 사이트라 받을 서버가 없고,
 *      개인정보처리방침 제2조 수집 항목에 **이메일이 없다**(`lib/brochure-schema.ts`).
 *      즉 지금 이 폼은 리드를 모으지 못하고 다운로드 전 확인 절차로만 동작한다.
 *      수집을 켜려면 **방침 개정 + 접수 저장소 연결**이 함께 필요하다
 *      (`lib/form-submit.static.ts` 주석에 자세히 적어 두었다).
 */

export const metadata: Metadata = {
  title: "무인매장 관리 서비스 소개서",
  description:
    "무인매장 관리 서비스 소개서를 PDF로 받아보실 수 있습니다. 회사명과 이메일, 연락처만 남겨주시면 바로 다운로드하실 수 있습니다.",
};

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
          <p className="text-body-lg text-text-sub mb-4 max-w-[34rem]">
            상담 전에 어떤 서비스인지 먼저 보고 싶으시다면 소개서를 확인해 보세요. 아래에 정보를
            남기시면 다음 화면에서 바로 받으실 수 있습니다.
          </p>
          <p className="text-caption text-text-sub mb-10">
            PDF · {BROCHURE_FILE.pages}페이지 · {BROCHURE_FILE.size}
          </p>

          {/* 목차는 실제 PDF 2쪽 `CONTENTS` 를 그대로 옮긴 것이다(`content/brochure.ts`).
              전에는 파일이 없어 추측으로 세 줄을 적어 두었다 — 받기 전에 알려주는
              자리이므로 문서에 실제로 있는 것만 적는다 */}
          <ul className="flex flex-col gap-4">
            {BROCHURE_CONTENTS.map((c) => (
              <li key={c.no} className="flex gap-3">
                <span className="text-label text-brand mt-1 shrink-0 font-semibold tabular-nums">
                  {c.no}
                </span>
                <div>
                  <p className="text-h4 text-ink">{c.title}</p>
                  <p className="text-body-sm text-text-sub mt-1 leading-[1.7]">
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
          <h2 className="text-h3 text-ink mb-2">받으실 분 정보를 알려주세요</h2>
          {/* 2026-08-28: 유입 경로가 추가되어 칸이 넷이 됐다. "세 가지만" 이라고 적어
              두면 화면과 어긋난다 — 필수가 셋임을 밝히는 쪽으로 고쳤다 */}
          <p className="text-body-sm text-text-sub mb-7">
            필수는 세 가지입니다. 그 밖의 정보는 받지 않습니다.
          </p>
          <BrochureForm />
        </div>
      </div>
    </section>
  );
}
