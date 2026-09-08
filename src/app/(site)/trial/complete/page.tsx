import type { Metadata } from "next";
import Link from "next/link";
import { RingMark } from "@/components/brand/RingMark";
import { buttonClasses } from "@/components/ui/Button";
import { TRIAL_APP_URL } from "@/content/trial";
import { COMPANY, TEL_HREF } from "@/content/company";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 무료체험 신청 완료.
 *
 * ── 왜 곧장 튕기지 않는가 ──
 * 제출하자마자 외부 주소로 이동시키면 신청이 접수된 것인지, 무엇을 보게 되는
 * 것인지 알 수 없다. 그래서 한 화면을 두고 **여기서 사용자가 직접 연다.**
 * `router.replace(외부주소)` 같은 자동 이동도 쓰지 않는다 — 뒤로 가기가
 * 망가지고, 새 탭을 막아둔 브라우저에서는 조용히 실패한다.
 *
 * ⚠️ 외부 도메인이므로 `rel="noopener noreferrer"` 를 붙인다. 주소 정본은
 *    `content/trial.ts` 의 `TRIAL_APP_URL` 하나다.
 * ⚠️ 체험 기간은 **14일로 확정됐다**(사용자 지시 2026-09-04). 이 화면에는 숫자를 적지
 *    않는다 — 신청 화면(`/trial`)에서 이미 안내했으므로 반복하지 않는다. 아래 순차 연락
 *    안내에도 기간·일수를 넣지 않았다(2026-09-08). 그 판단을 유지한다.
 *
 * ── 2026-09-08 순차 연락 안내를 넣었다 (사용자 지시) ──
 * "무료체험 문의가 많아 순차적으로 연락드리겠습니다." 연락이 늦어질 수 있음을 **미리**
 * 알리는 문장이다. 기다리는 분이 방치됐다고 느끼지 않게 하는 것이 목적이라 리드의
 * **마지막 문장**에 둔다 — 연락 안내 바로 다음에 와야 이어 읽힌다.
 *
 * 색인하지 않는다 — 검색으로 바로 들어오면 신청하지 않은 사람이 신청했다고
 * 오해한다(`/brochure/complete` 와 같은 원칙).
 */

export const metadata: Metadata = {
  title: "무료체험 신청이 접수되었습니다",
  robots: { index: false, follow: false },
};

export default function TrialCompletePage() {
  return (
    <section className="section-py">
      <div className="container-ba flex flex-col items-center py-10 text-center">
        <RingMark size={88} label="반오토" />

        <h1 className="text-h1 text-ink mt-8 mb-4 max-w-[22ch]">신청이 접수되었습니다</h1>
        {/*
          이동 전에 무엇을 하러 가는지 밝힌다.

          ⚠️ 리드를 **순수 문자열**로 유지한다. `formatCopy` 는 문자열만 문장 단위로 줄을
             나누고(2026-08-18 사용자 확정 규칙), JSX 가 섞이면 그대로 통과시킨다
             (`components/ui/Copy.tsx` 주석). 여기에 `<strong>` 이나 링크를 넣으면 줄바꿈이
             조용히 사라진다. `<br />` 을 손으로 박지도 않는다 — 원문이 정본으로 남아야
             카피 검수가 된다.
        */}
        <p className="text-body-lg text-text-sub mb-10 max-w-[42rem]">
          {formatCopy(
            "아래 버튼으로 반오토 웹버전 대시보드를 바로 열어보실 수 있습니다. 체험 계정과 사용 방법은 담당자가 남겨주신 연락처로 안내해 드립니다. 무료체험 문의가 많아 순차적으로 연락드리겠습니다.",
          )}
        </p>

        <div className="border-border w-full max-w-[520px] rounded-lg border bg-white p-6 text-left shadow-[var(--shadow-card)]">
          <p className="text-h4 text-ink mb-4">먼저 보시면 좋은 것</p>
          <ul className="flex flex-col gap-3">
            <li className="text-body-sm text-text-sub">
              매니저 화면의 업무 체크리스트 — 항목마다 사진이 어떻게 남는지 보실 수 있습니다.
            </li>
            <li className="text-body-sm text-text-sub">
              점주 화면의 데일리 리포트 — 하루가 어떤 형식으로 요약되는지 확인해 보세요.
            </li>
            <li className="text-body-sm text-text-sub">
              막히는 부분이 있으면 {COMPANY.tel} 로 전화 주시면 바로 도와드립니다.
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {/* 외부 도메인 — 새 탭으로 열고 noopener noreferrer 를 붙인다 */}
          <a
            href={TRIAL_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ size: "lg" })}
          >
            체험 대시보드 열기
          </a>
          <a
            href={`tel:${TEL_HREF}`}
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            전화로 안내받기
          </a>
        </div>

        <p className="text-caption text-text-sub mt-6">
          새 창에서 열립니다 · 모바일 앱은 계약 체결 후 계정이 발급됩니다(
          <Link href="/app" className="text-brand underline underline-offset-2">
            앱 안내
          </Link>
          )
        </p>
      </div>
    </section>
  );
}
