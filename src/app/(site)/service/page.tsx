import type { Metadata } from "next";
import Link from "next/link";
import { ServiceTabs, type ServiceArea } from "@/components/marketing/ServiceTabs";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buttonClasses } from "@/components/ui/Button";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd } from "@/lib/structured-data";
import { SCREENS } from "@/content/app-screens";

/**
 * `/service` — 서비스 소개 (PRD §7.3).
 *
 * 홈이 "무엇을 맡는가"를 네 단어로 보여줬다면, 여기서는 **각 영역이 실제로 어떤
 * 작업으로 이루어지는지**를 보여준다. 6영역 × 세부 3항목이 전부 PRD 에 확정돼 있어
 * 지어낼 내용이 없다.
 *
 * 초기안의 탭은 `<div onClick>` 으로 구현돼 있어 키보드·스크린리더 접근이 불가능했다.
 * 실제 버튼으로 재구현했다(§7.3 초기안 결함 수정).
 */

export const metadata: Metadata = {
  title: "무인매장 관리 서비스",
  description:
    "무인매장 관리를 여섯 영역으로 나눠 맡습니다. 매장 관리, 전담 매니저, 고객센터, 재고·발주, 행정 업무, 데일리 리포트의 수행 항목을 정리했습니다.",
};

/** PRD §7.3 — 6영역과 세부 3항목. 값은 전부 확정본이다 */
const AREAS: readonly ServiceArea[] = [
  {
    id: "management",
    title: "체계적인 매장 관리",
    icon: "checklist",
    lead: "관리 기준이 사람에 따라 달라지지 않습니다",
    items: [
      "업종별 표준 체크리스트를 매장에 맞춰 설계합니다",
      "항목별로 사진을 기록하고 이력을 보관합니다",
      "매장별 관리 현황을 모니터링합니다",
    ],
    screen: SCREENS.checklistMobile,
  },
  {
    id: "manager",
    title: "전담 매니저",
    icon: "manager",
    lead: "매번 다시 설명하실 필요가 없습니다",
    items: [
      "지역을 기준으로 담당자를 고정 배정합니다",
      "정기 교육과 관리 품질 평가를 실시합니다",
      "담당자가 부재일 때는 대체 인력이 운영됩니다",
    ],
  },
  {
    id: "support",
    title: "실시간 고객센터",
    icon: "support",
    lead: "매장 전화를 대신 받습니다",
    items: [
      "매장 대표번호 응대를 대행합니다",
      "환불·오류 문의를 1차 처리합니다",
      "응대 내역을 리포트로 정리해 드립니다",
    ],
  },
  {
    id: "stock",
    title: "재고·발주 관리",
    icon: "stock",
    lead: "품절로 인한 매출 손실을 줄입니다",
    items: [
      "소모품과 상품 재고를 실사합니다",
      "발주 시점을 알리고 발주를 대행합니다",
      "소진 추이 데이터를 제공합니다",
    ],
    screen: SCREENS.inventoryMobile,
  },
  {
    id: "admin",
    title: "행정 업무 관리",
    icon: "admin",
    lead: "잊고 넘어가는 일이 없습니다",
    items: [
      "계약과 갱신 일정을 캘린더로 관리합니다",
      "기한 전에 미리 알려드립니다",
      "서류를 보관하고 이력을 남깁니다",
    ],
  },
  {
    id: "report",
    title: "데일리 리포트",
    icon: "report",
    lead: "매장에 가지 않아도 상태를 파악하실 수 있습니다",
    items: [
      "일일 관리 수행 결과를 요약해 드립니다",
      "항목별 사진 기록을 함께 첨부합니다",
      "월간 종합 리포트를 제공합니다",
    ],
    screen: SCREENS.reportMobile,
  },
];

export default function ServicePage() {
  return (
    <>
      {/*
        이 페이지가 무엇에 대한 페이지인지 기계에 알린다(SEO 감사 A7).
        화면에는 아무것도 그리지 않는다. 요금을 넣지 않은 이유는
        `lib/structured-data.ts` 주석에 있다.
      */}
      <JsonLd data={serviceJsonLd()} />

      {/* ══ 히어로 ═══════════════════════════════════════════════ */}
      <section className="from-brand-50 bg-gradient-to-b to-white">
        <div className="container-ba pt-12 pb-12 md:pt-20 md:pb-16">
          <SectionLabel className="mb-3">서비스 소개</SectionLabel>
          <h1 className="text-display text-ink mb-5 max-w-[22ch]">
            여섯 영역을 하나의 기준으로 묶습니다
          </h1>
          <p className="text-body-lg text-text-sub max-w-[46rem]">
            청소만 하고 오는 것이 아닙니다. 재고·응대·행정까지 같은 체크리스트 체계 안에서 처리되고,
            결과는 매일 같은 형식의 리포트로 정리됩니다.
          </p>
        </div>
      </section>

      {/* ══ 6영역 ════════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-ba">
          <SectionHeader
            title="무엇을 어떻게 하는지 항목까지 공개합니다"
            lead="왼쪽에서 영역을 고르시면 실제 수행 항목이 나옵니다."
          />
          <ServiceTabs areas={AREAS} />
        </div>
      </section>

      {/* ══ 공통 포함 ════════════════════════════════════════════
          어느 옵션을 고르든 달라지지 않는 것. 요금 비교 전에 알아야 할 정보다. */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <SectionHeader
            label="공통"
            title="어느 조건이든 이건 그대로입니다"
            lead="관리 횟수와 범위는 매장마다 다르지만, 아래는 모든 매장에 동일하게 적용됩니다."
          />

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "매장 전용 체크리스트 설계",
              "항목별 사진 기록",
              "전담 매니저 고정 배정",
              "담당자 부재 시 대체 인력 운영",
              "데일리 리포트 발송",
              "앱을 통한 관리 이력 확인",
            ].map((t, i) => (
              <li key={t}>
                <Reveal delayMs={i * 50}>
                  <div className="border-border text-body text-ink flex h-full items-center gap-3 rounded-lg border bg-white p-5 shadow-[var(--shadow-card)]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-brand)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="shrink-0"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                    {t}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 자주 묻는 질문 — 하단 CTA 바로 위 (사용자 지시 2026-08-18) ═════ */}
      <FaqTeaser
        groupId="operation"
        offset={0}
        tone="white"
        title="운영 방식에 대해 많이 묻는 것들"
        lead="비상주 관리가 어떻게 굴러가는지에 대한 질문입니다."
      />

      {/* ══ 최종 CTA ═════════════════════════════════════════════ */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <Reveal>
            <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">
              어디까지 맡길지는 매장을 보고 정합니다
            </h2>
            <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
              여섯 영역을 전부 맡기실 필요는 없습니다. 방문 진단에서 지금 가장 손이 많이 가는 것부터
              정리해 드립니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={buttonClasses({ variant: "onDark", size: "lg" })}>
                무료 방문 진단 신청
              </Link>
              <Link
                href="/system"
                className={buttonClasses({
                  variant: "ghost",
                  size: "lg",
                  className: "text-white/85 hover:bg-white/12 hover:text-white",
                })}
              >
                운영 시스템 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
