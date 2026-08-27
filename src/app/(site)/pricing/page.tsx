import type { Metadata } from "next";
import Link from "next/link";
import { DummyBanner } from "@/components/marketing/DummyBanner";
import { PageHero } from "@/components/marketing/PageHero";
import { PlanCards } from "@/components/marketing/PlanCards";
import { Mark } from "@/components/ui/Mark";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/marketing/FaqList";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonClasses } from "@/components/ui/Button";
import { pricingFaqItems } from "@/content/faq";

/**
 * `/pricing` — 요금 안내.
 *
 * ── 두 번 바뀐 화면이다 ──
 * ① 처음에는 방문 횟수·면적·업종으로 금액을 만들어 주는 **계산기**가 중심이었다.
 * ② 기획이 기능별 차등 요금제로 바뀌면서 **플랜 3장 + 옵션 단가 표**가 됐다.
 * ③ 2026-08-27 담당자 수정안으로 **기본료 하나 + 옵션 여섯**이 됐다.
 *
 * 그래서 이번에 사라진 것:
 *   · 옵션 단가 표 — 옵션 금액이 **전부 비공개**로 확정됐다. 여섯 줄 모두
 *     "별도 문의"가 되는 표는 자리만 차지하고 아무것도 말하지 않는다. 어떤 옵션이
 *     있는지는 요금 카드 오른쪽의 "옵션 기능 목록"이 이미 보여준다
 *   · 계산기(`PricingEstimator`) — **폐기**했다(사용자 확정 2026-08-27,
 *     "제거하고 상담에서 안내로 대체"). 컴포넌트 파일과 계산용 더미 값도 지웠다.
 *     지금 요금 구조는 기본료 + 금액 비공개 옵션이라 곱셈식 견적이 성립하지 않는다
 *   · 월간/연간 토글 — 수정안에 연간 결제가 없다
 *
 * ⚠️ 금액(24,900원)은 아직 잠정값이다. 상단 배너로 밝힌다.
 */

export const metadata: Metadata = {
  title: "무인매장 관리 요금",
  description:
    "무인매장 관리 요금은 운영 대시보드 월 24,900원을 기본으로, 필요한 관리 기능만 옵션으로 더하는 구조입니다. 옵션 요금은 도입 상담에서 안내드립니다.",
};

export default function PricingPage() {
  return (
    <>
      <DummyBanner what="요금" />

      {/* ══ 히어로 — 한 화면 꽉 참 · 강조는 형광펜 하나만 ═══════ */}
      <PageHero
        pageName="요금 안내"
        title={
          <>
            맡기는 <Mark tone="highlight">범위만큼만</Mark> 지불하세요
          </>
        }
        lead="운영 대시보드는 기본으로 제공되고, 필요한 옵션만 자유롭게 더하실 수 있습니다. 매장 운영 단계에 맞춰 시작하시고, 나중에 범위를 넓히셔도 됩니다."
        scrollTargetId="plans"
      />

      {/* ══ 기본료 + 옵션 ════════════════════════════════════════ */}
      {/*
        위아래 여백을 `section-py` 의 0.7배로 줄였다. 헤더 + 카드 + 각주가
        **한 화면에 담겨야 한다**는 요청(2026-08-18) 때문이다. 이 섹션만 예외를
        두는 이유: 다른 섹션은 한 화면에 담을 필요가 없고, 토큰을 건드리면 전
        페이지 리듬이 함께 바뀐다.
      */}
      <section id="plans" className="py-[calc(var(--section-py)*0.7)]">
        <div className="container-ba">
          <SectionHeader
            className="mb-7"
            title="운영 대시보드는 기본, 나머지는 옵션입니다"
            lead="필요한 만큼만 고르실 수 있습니다. 각 옵션에 무엇이 포함되는지는 주요기능 페이지에서 자세히 보실 수 있습니다."
          />
          <PlanCards />

          <div className="mt-6 flex justify-center">
            <Link href="/features/dashboard" className={buttonClasses({ variant: "ghost" })}>
              주요기능 자세히 보기
            </Link>
          </div>
        </div>
      </section>

      {/*
        ══ 요금 관련 자주 묻는 질문 ═══════════════════════════════
        여기에는 "어느 요금제가 무엇을 묶는지" 섹션이 있었다. 위쪽 요금 카드가
        이미 포함 기능을 나열하고 있어 **중복**이라 사용자 지시로 삭제하고
        (2026-08-18) 그 자리에 요금 FAQ 세 문항을 넣었다.

        구성·차이를 묻는 문항은 넣지 않았다 — 그 답은 기본료·옵션 카드가 화면으로
        말하고 있어, 글로 한 번 더 적으면 삭제한 섹션과 같은 중복이 된다.
        **옵션 금액과 변경**만 남겼다: 카드를 다 보고 난 사람의 다음 질문이 그쪽이다.

        문항은 `content/faq.ts` 가 정본이고 `/faq` 와 **같은 아코디언**(`FaqList`)을
        쓴다. 여기에 답변을 다시 적지 않는다.
      */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <SectionHeader
            label="자주 묻는 질문"
            title="옵션은 이렇게 정합니다"
            lead="요금을 보고 가장 많이 물어보시는 세 가지입니다."
          />

          <div className="mx-auto max-w-[52rem]">
            <FaqList items={pricingFaqItems()} />

            <p className="text-body-sm text-text-sub mt-5 text-center">
              <Link href="/faq" className="text-brand underline underline-offset-2">
                자주 묻는 질문 전체 보기
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ══ 최종 CTA ═════════════════════════════════════════════ */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <Reveal>
            <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">
              어떤 옵션이 필요할지 함께 정해드립니다
            </h2>
            <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
              매장 규모와 운영 상황을 알려주시면 필요한 옵션 구성과 조합 요금을 안내해 드립니다.
              상담은 무료이며, 도입을 강요하지 않습니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={buttonClasses({ variant: "onDark", size: "lg" })}>
                무료 도입 상담 신청
              </Link>
              <Link
                href="/process"
                className={buttonClasses({
                  variant: "ghost",
                  size: "lg",
                  className: "text-white/85 hover:bg-white/12 hover:text-white",
                })}
              >
                도입 절차 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
