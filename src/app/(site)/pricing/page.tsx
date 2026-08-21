import type { Metadata } from "next";
import Link from "next/link";
import { DummyBanner } from "@/components/marketing/DummyBanner";
import { PageHero } from "@/components/marketing/PageHero";
import { PlanCards } from "@/components/marketing/PlanCards";
import { ServiceIcon } from "@/components/marketing/serviceIcons";
import { Mark } from "@/components/ui/Mark";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/marketing/FaqList";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonClasses } from "@/components/ui/Button";
import { FEATURES } from "@/content/features";
import { DUMMY_OPTION_PRICE } from "@/content/dummy";
import { pricingFaqItems } from "@/content/faq";

/**
 * `/pricing` — 요금 안내.
 *
 * ── 계산기를 내렸다 ──
 * 이전 화면은 방문 횟수·면적·업종으로 금액을 만들어 주는 계산기가 중심이었다.
 * 기획이 **기능별 차등 요금제**로 바뀌면서 그 축이 사라졌다. 지금 사용자가
 * 골라야 하는 건 "몇 번 오느냐"가 아니라 "어디까지 맡기느냐"다.
 * `PricingEstimator` 컴포넌트는 지우지 않고 남겨 두었다 — 축이 다시 바뀔 수 있다.
 *
 * ── 옵션 단가는 절반만 공개한다 ──
 * 기획 결정이다. 베이직·스탠다드 구성에 들어가는 옵션(경영지원 · 매출관리·
 * 홍보지원)만 금액을 밝히고, 프리미엄에서만 붙는 셋은 "별도 문의"로 둔다.
 * 값의 정본은 `dummy.ts` 이고 비공개 옵션은 값 자체가 없다.
 *
 * ⚠️ 금액은 전부 잠정값이다. 상단 배너로 밝힌다.
 */

export const metadata: Metadata = {
  title: "무인매장 관리 요금",
  description:
    "무인매장 관리 요금제는 베이직·스탠다드·프리미엄 세 가지입니다. 월간과 연간 결제 중에서 고르실 수 있고, 세부 견적은 도입 상담에서 안내드립니다.",
};

/** 옵션 표에 넣을 순서 — 요금제에 포함되지 않는 다섯 기능 */
const OPTION_KEYS = ["ops-support", "dispatch", "b2c", "revenue", "place"] as const;

/** 어느 플랜에서 처음 붙는 옵션인가 — 공개 여부의 근거를 화면에도 적는다 */
const OPTION_PLAN: Record<string, string> = {
  "ops-support": "스탠다드",
  revenue: "스탠다드",
  dispatch: "프리미엄",
  b2c: "프리미엄",
  place: "프리미엄",
};

/** 금액 위에 붙는 조건 — 표에서 각주로 흘리면 상담에서 말이 달라진다 */
const OPTION_NOTE: Record<string, string> = {
  "ops-support": "매니저 인건비 별도 · 출근 횟수와 시간에 따라 달라집니다",
  dispatch: "업체별 내부 정책에 따라 추가 요금이 발생할 수 있습니다",
  b2c: "",
  revenue: "",
  place: "",
};

function formatWon(n: number) {
  return n.toLocaleString("ko-KR");
}

export default function PricingPage() {
  // flatMap 으로 거른다 — filter 뒤에는 타입이 좁혀지지 않아 단언이 필요해진다
  const optionRows = OPTION_KEYS.flatMap((key) => {
    const feature = FEATURES.find((f) => f.key === key);
    if (!feature) return [];
    return [{ key, feature, price: DUMMY_OPTION_PRICE[key] ?? null }];
  });

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
        lead="결제 주기는 월간과 연간 중에서 고르실 수 있습니다. 매장 운영 단계에 맞춰 필요한 만큼만 시작하시고, 나중에 범위를 넓히셔도 됩니다."
        scrollTargetId="plans"
      />

      {/* ══ 요금제 카드 3장 ══════════════════════════════════════ */}
      {/*
        위아래 여백을 `section-py` 의 0.7배로 줄였다. 헤더 + 토글 + 카드 3장 +
        주석이 **한 화면에 담겨야 한다**는 요청(2026-08-18) 때문이다. 이 섹션만
        예외를 두는 이유: 다른 섹션은 한 화면에 담을 필요가 없고, 토큰을 건드리면
        전 페이지 리듬이 함께 바뀐다.
      */}
      <section id="plans" className="py-[calc(var(--section-py)*0.7)]">
        <div className="container-ba">
          <SectionHeader
            className="mb-7"
            title="세 가지 중에서 고르시면 됩니다"
            lead="어디까지 맡기실지에 따라 나뉩니다. 포함 기능은 주요기능 페이지에서 자세히 보실 수 있습니다."
          />
          <PlanCards />

          <div className="mt-6 flex justify-center">
            <Link href="/features/dashboard" className={buttonClasses({ variant: "ghost" })}>
              주요기능 자세히 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 옵션 추가 요금 ═══════════════════════════════════════
          카드는 "묶음"을, 이 표는 "묶음에 없는 것"을 말한다. */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <SectionHeader
            label="옵션 구성"
            title="필요한 기능만 따로 붙이실 수 있습니다"
            lead="요금제에 포함되지 않은 기능은 옵션으로 추가됩니다. 옵션 금액은 매장 규모와 운영 상황에 따라 달라져 도입 상담에서 안내드립니다."
          />

          <div className="border-border overflow-x-auto rounded-lg border bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="bg-bg-subtle">
                  {["옵션", "포함 요금제", "월 추가 요금"].map((h) => (
                    <th
                      key={h}
                      className="text-label text-text-sub border-border-light border-b px-5 py-4 text-left"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {optionRows.map(({ key, feature, price }) => (
                  <tr key={key} className="border-border-light border-b last:border-0">
                    <td className="px-5 py-4">
                      <span className="text-body text-ink flex items-center gap-2.5 font-semibold">
                        <span className="text-brand shrink-0">
                          <ServiceIcon name={feature.icon} size={18} />
                        </span>
                        {feature.title}
                      </span>
                      {OPTION_NOTE[key] && (
                        <span className="text-caption text-text-sub mt-1.5 block">
                          {OPTION_NOTE[key]}
                        </span>
                      )}
                    </td>
                    <td className="text-body-sm text-text-sub px-5 py-4">{OPTION_PLAN[key]}</td>
                    <td className="text-body text-ink px-5 py-4 tabular-nums">
                      {price === null ? (
                        <span className="text-text-sub">별도 문의</span>
                      ) : (
                        `+${formatWon(price)}원`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 표에 숫자가 없으므로 "모든 금액은 VAT 별도" 는 가리킬 대상이 없다.
              안내받을 금액을 기준으로 다시 썼다 */}
          <p className="text-caption text-text-sub mt-4">
            옵션 금액은 매장 규모·출근 횟수·협력 업체 정책에 따라 달라집니다. 도입 상담에서
            안내드리는 금액은 <strong className="text-ink">VAT 별도</strong>입니다.
          </p>
        </div>
      </section>

      {/*
        ══ 요금 관련 자주 묻는 질문 ═══════════════════════════════
        여기에는 "어느 요금제가 무엇을 묶는지" 섹션이 있었다. 위쪽 요금제 카드가
        이미 포함 기능을 나열하고 있어 **중복**이라 사용자 지시로 삭제하고
        (2026-08-18) 그 자리에 요금 FAQ 세 문항을 넣었다.

        구성·차이를 묻는 문항은 넣지 않았다 — 그 답은 카드와 옵션 표가 화면으로
        말하고 있어, 글로 한 번 더 적으면 삭제한 섹션과 같은 중복이 된다.
        **결제·변경**만 남겼다: 카드를 다 보고 난 사람의 다음 질문이 그쪽이다.

        문항은 `content/faq.ts` 가 정본이고 `/faq` 와 **같은 아코디언**(`FaqList`)을
        쓴다. 여기에 답변을 다시 적지 않는다.
      */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <SectionHeader
            label="자주 묻는 질문"
            title="결제와 변경은 이렇게 됩니다"
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
              어느 요금제가 맞을지 함께 정해드립니다
            </h2>
            <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
              매장 규모와 운영 상황을 알려주시면 필요한 관리 범위와 구독 플랜을 안내해 드립니다.
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
