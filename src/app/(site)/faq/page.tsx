import type { Metadata } from "next";
import Link from "next/link";
import { FaqTabs } from "@/components/marketing/FaqTabs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buttonClasses } from "@/components/ui/Button";
import { formatCopy } from "@/components/ui/Copy";
import { FAQ_GROUPS } from "@/content/faq";

/**
 * `/faq` — 자주 묻는 질문.
 *
 * ── 참고 시안 배치로 맞춤 (사용자 확정 2026-08-18) ──
 * 카테고리를 **탭으로 전환**해 한 번에 한 묶음만 보여준다(`FaqTabs`). 이전 판은
 * 다섯 묶음을 모두 그려 두고 위쪽 링크로 스크롤 이동했다. 호버 전환만 클릭으로
 * 바꿨고(이유는 `FaqTabs` 주석) 나머지는 시안과 같다.
 *
 * ── 카피는 `content/faq.ts` 가 정본이다 ──
 * 요금 페이지가 이 중 세 문항을 발췌하므로 데이터를 페이지에서 뽑아냈다.
 * 문항을 두 파일에 복사해 두면 답변이 갈라진다.
 *
 * ── GNB 에 올라왔다 ──
 * 8/18 부터 상단 메뉴에 `자주 묻는 질문` 이 있다(`Header.tsx`). 그전에는 푸터
 * 링크로만 닿을 수 있었다.
 */

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description:
    "주요기능과 운영 방식, 매니저 배정, 요금과 계약까지 도입 전에 가장 많이 받는 질문을 정리했습니다.",
};

export default function FaqPage() {
  return (
    <>
      <section className="from-brand-50 bg-gradient-to-b to-white">
        <div className="container-ba pt-12 pb-12 md:pt-20 md:pb-16">
          <SectionLabel className="mb-3">자주 묻는 질문</SectionLabel>
          <h1 className="text-display text-ink mb-5 max-w-[20ch]">물어보기 전에 확인하세요</h1>
          <p className="text-body-lg text-text-sub max-w-[46rem]">
            {formatCopy(
              "도입 전에 가장 많이 받는 질문을 정리했습니다. 여기에 없는 내용은 상담에서 바로 답변드립니다.",
            )}
          </p>
        </div>
      </section>

      <FaqTabs groups={FAQ_GROUPS} />

      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">찾으시는 답이 없었다면</h2>
          <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
            상담에서 바로 여쭤보세요. 매장 조건에 맞춰 구체적으로 답변드립니다.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className={buttonClasses({ variant: "onDark", size: "lg" })}>
              무료 도입 상담 신청
            </Link>
            {/* 시안의 보조 버튼은 `서비스 자세히 보기` 다. 도착지는 서비스 소개(`/service`) */}
            <Link
              href="/service"
              className={buttonClasses({
                variant: "ghost",
                size: "lg",
                className: "text-white/85 hover:bg-white/12 hover:text-white",
              })}
            >
              서비스 자세히 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
