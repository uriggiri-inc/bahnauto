import type { Metadata } from "next";
import Link from "next/link";
import { RingMark } from "@/components/brand/RingMark";
import { buttonClasses } from "@/components/ui/Button";
import { BROCHURE_FILE } from "@/content/brochure";

/**
 * 소개서 신청 완료 — **여기서 파일을 내려받는다** (사용자 지시 2026-08-28).
 *
 * ── 바뀐 흐름 ──
 * 이전에는 "담당자가 확인한 뒤 이메일로 보내드립니다" 였다. 보낼 파일이 없었기
 * 때문이다(X-10). 2026-08-28 에 소개서 PDF 를 받아 `public/brochure/` 에 넣었고,
 * 흐름이 **즉시 다운로드**로 바뀌었다:
 *
 *   홈 히어로 `서비스 소개서` → `/brochure` 폼 → 검증 통과 → 이 화면에서 다운로드
 *
 * 이메일 발송을 약속하지 않는다. 약속하면 그 사람은 오지 않는 메일을 기다린다 —
 * 정적 사이트에는 메일을 보낼 서버가 없다(`lib/form-submit.static.ts` 주석).
 *
 * ── JS 로 다운로드를 가리지 않는다 (2026-08-28, 만들었다가 되돌렸다) ──
 * 처음에는 폼을 통과한 세션에만 버튼을 열려고 `sessionStorage` 표시를 심고 이
 * 화면을 클라이언트 컴포넌트로 만들어 그 값을 읽었다. **두 가지 이유로 되돌렸다.**
 *
 *   1. **막지 못한다.** PDF 는 `public/` 의 공개 정적 파일이라 주소를 아는 사람은
 *      폼 없이 그대로 받는다. 정적 사이트에서 진짜로 막으려면 서버가 서명된
 *      주소를 발급해야 한다. 즉 그 장치는 처음부터 접근 제어가 아니었다.
 *   2. **정작 신청한 사람이 못 받을 수 있다.** 값을 읽는 시점이 마운트 이후라
 *      hydration 이 늦거나 시크릿 모드에서 저장소가 막히면 **버튼이 나타나지
 *      않는다.** 배경 탭에서 실제로 재현했다 — 화면이 "확인 중" 에서 멈췄다.
 *      막지도 못하는 장치 때문에 정상 사용자가 파일을 못 받는 것은 맞바꿀 수 없다.
 *
 * 그래서 버튼은 서버에서 그대로 렌더한다(이 페이지는 JS 0바이트다). 흐름은
 * **경로 수준**에서 유지된다 — 이 화면으로 오는 링크는 폼 성공 리다이렉트뿐이고,
 * 색인도 하지 않는다.
 *
 * 색인하지 않는다 — 검색으로 바로 들어오면 신청하지 않은 사람이 신청했다고
 * 오해하고, 소개서가 검색 결과에 노출될 자리도 아니다.
 */

export const metadata: Metadata = {
  title: "서비스 소개서 다운로드",
  robots: { index: false, follow: false },
};

export default function BrochureCompletePage() {
  return (
    <section className="section-py">
      <div className="container-ba flex flex-col items-center py-10 text-center">
        <RingMark size={88} label="반오토" />

        <h1 className="text-h1 text-ink mt-8 mb-4 max-w-[22ch]">소개서가 준비되었습니다</h1>
        <p className="text-body-lg text-text-sub mb-8 max-w-[42rem]">
          아래 버튼을 누르시면 바로 받으실 수 있습니다.
        </p>

        <div className="w-full max-w-[520px]">
          {/*
            `download` 속성을 쓴다 — 없으면 브라우저가 PDF 를 새 탭에서 열어 버려
            "받았다" 는 느낌이 남지 않는다. 같은 출처라 속성이 그대로 먹는다.
          */}
          <a
            href={BROCHURE_FILE.href}
            download={BROCHURE_FILE.downloadName}
            className={buttonClasses({ size: "lg", full: true })}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            서비스 소개서 다운로드
          </a>

          {/* 크기를 미리 말한다 — 15MB 는 모바일 데이터로 받기에 작지 않다 */}
          <p className="text-caption text-text-sub mt-3">
            PDF · {BROCHURE_FILE.pages}페이지 · {BROCHURE_FILE.size} · {BROCHURE_FILE.updated} 기준
          </p>
        </div>

        <div className="border-border mt-12 w-full max-w-[520px] rounded-lg border bg-white p-6 text-left shadow-[var(--shadow-card)]">
          <p className="text-h4 text-ink mb-4">더 보실 곳</p>
          <ul className="flex flex-col gap-3">
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
          <Link href="/contact" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            도입 상담 신청
          </Link>
        </div>
      </div>
    </section>
  );
}
