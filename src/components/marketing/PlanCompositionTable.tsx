import { ServiceIcon } from "@/components/marketing/serviceIcons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FEATURE_BY_KEY } from "@/content/features";
import { PLAN_COMPOSITION, PLAN_COMPOSITION_HEADING, type PlanComposition } from "@/content/plans";
import { cn } from "@/lib/cn";

/**
 * 옵션별 구성표 — **무엇이 들어가고 어떻게 결제하는가** (사용자 지시 2026-08-28).
 *
 * ── 왜 생겼나 ──
 * 요금 카드(기본료 + 옵션 목록) 아래가 비어 보인다는 지적을 받았다. 그 자리에
 * 담당자 `반오토_요금제_항목별_구성표.docx` 의 표를 넣는다. 카드가 "무엇을 고를 수
 * 있나" 를 말하고, 이 표가 "고르면 무엇이 들어오나" 를 말한다.
 *
 * ⚠️ **금액이 없는 표다.** 옵션 금액은 비공개가 기획 확정 사항이므로 여기에도
 *    단가 열을 두지 않는다. 예전 `/pricing` 의 옵션 단가 표는 여섯 줄이 모두
 *    "별도 문의" 가 되어 지웠다 — 같은 실수를 반복하지 않는다.
 *
 * ── 좁은 화면 ──
 * 세 열 중 "포함 내용" 이 길어 폰에서 표로는 읽히지 않는다. 그래서 **두 가지
 * 배치를 만들지 않고** 하나의 목록으로 접근한다:
 *   · `md` 이상 — 3열 표(항목 / 포함 내용 / 결제방식)
 *   · `md` 미만 — 항목마다 카드 하나. 이름 → 결제방식 배지 → 포함 내용 목록
 * 같은 데이터를 두 번 그리지만 **가로 스크롤을 만들지 않는다**(스크롤 표는
 * 2026-08-26 에 목차 띠에서 이미 물린 방식이다).
 *
 * ── 결제방식 표시 ──
 * `연간 결제 전용` 은 고를 수 있는지를 좌우하는 조건이라 눈에 걸려야 한다.
 * 색만으로 말하지 않는다(`CLAUDE.md` §4) — 배지에 글자가 그대로 들어가고,
 * 색은 거기에 얹는 두 번째 신호다.
 *
 * 항목 이름과 아이콘은 `features.ts` 에서 가져온다 — 표기가 갈라지지 않게.
 */

/** 결제방식 배지 — 연간 전용만 브랜드 색을 쓴다 */
function BillingBadge({ row }: { row: PlanComposition }) {
  return (
    <span
      className={cn(
        "text-caption inline-flex rounded-full border px-2.5 py-1 whitespace-nowrap",
        row.annualOnly
          ? "border-brand-200 bg-brand-50 text-brand font-semibold"
          : "border-border text-text-sub",
      )}
    >
      {row.billing}
    </span>
  );
}

export function PlanCompositionTable({ className }: { className?: string }) {
  /* 문서에 있는 항목만 그린다 — features.ts 에 없는 key 가 섞이면 조용히 건너뛴다 */
  const rows = PLAN_COMPOSITION.flatMap((row) => {
    const feature = FEATURE_BY_KEY[row.key];
    return feature ? [{ row, feature }] : [];
  });

  return (
    <div className={className}>
      <SectionLabel className="mb-2">{PLAN_COMPOSITION_HEADING.title}</SectionLabel>
      <h3 className="text-h3 text-ink">{PLAN_COMPOSITION_HEADING.lead}</h3>

      {/* ── md 이상: 3열 표 ── */}
      <div className="border-border mt-6 hidden overflow-hidden rounded-lg border bg-white shadow-[var(--shadow-card)] md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-bg-subtle">
              {["항목", "포함 내용", "결제방식"].map((h) => (
                <th
                  key={h}
                  className="text-label text-text-sub border-border-light border-b px-5 py-3.5 font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, feature }) => (
              <tr key={row.key} className="border-border-light border-b align-top last:border-0">
                <td className="px-5 py-4">
                  <span className="text-body-sm text-ink flex items-start gap-2.5 font-semibold">
                    <span
                      className={cn(
                        "mt-0.5 shrink-0",
                        feature.comingSoon ? "text-text-sub" : "text-brand",
                      )}
                    >
                      <ServiceIcon name={feature.icon} size={18} />
                    </span>
                    {feature.title}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <ul className="text-body-sm text-text-sub flex flex-col gap-1.5 leading-[1.65]">
                    {row.includes.map((item) => (
                      <li key={item} className="flex gap-1.5">
                        <span aria-hidden className="text-brand-400 shrink-0">
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>

                <td className="px-5 py-4">
                  <BillingBadge row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── md 미만: 항목마다 카드 하나 ── */}
      <ul className="mt-6 flex flex-col gap-3 md:hidden">
        {rows.map(({ row, feature }) => (
          <li
            key={row.key}
            className="border-border rounded-lg border bg-white p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <span className="text-body-sm text-ink flex items-center gap-2.5 font-semibold">
                <span
                  className={cn("shrink-0", feature.comingSoon ? "text-text-sub" : "text-brand")}
                >
                  <ServiceIcon name={feature.icon} size={18} />
                </span>
                {feature.title}
              </span>
              <BillingBadge row={row} />
            </div>

            <ul className="text-body-sm text-text-sub border-border-light mt-3.5 flex flex-col gap-1.5 border-t pt-3.5 leading-[1.65]">
              {row.includes.map((item) => (
                <li key={item} className="flex gap-1.5">
                  <span aria-hidden className="text-brand-400 shrink-0">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
