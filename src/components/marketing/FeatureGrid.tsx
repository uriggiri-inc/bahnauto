import Link from "next/link";
import { ServiceIcon } from "@/components/marketing/serviceIcons";
import { FEATURES } from "@/content/features";
import { cn } from "@/lib/cn";

/**
 * 주요기능 7종 — 홈 요약 격자.
 *
 * ── 2026-08-27 목업대로 전면 교체 ──
 * 담당자 수정안(`홈페이지_수정.pptx` 2번 장)이 이 격자를 다시 그렸다. 바뀐 것 셋:
 *
 * | 이전 | 지금 | 왜 |
 * |---|---|---|
 * | 4열 · 8장 | **3열 · 7장** | 기능이 7종으로 재편됐다 |
 * | 01~08 번호 | **번호 없음** | 요금이 "묶음" 에서 "기본 + 옵션" 으로 바뀌었다. 번호는 순서·등급을 암시한다 |
 * | 흰 카드 + 커서 올리면 브랜드 면이 차오름 | **처음부터 브랜드 면 · 내용 펼침** | 목업이 그렇다 |
 *
 * 덮개(hover 로 차오르는 면)를 없애면서 **터치 기기 예외 처리도 함께 사라졌다.**
 * 이전에는 hover 가 없는 기기에서 정보가 통째로 감춰지는 것을 막으려고
 * `@media (hover: hover)` 로 접는 쪽을 한정했는데, 지금은 어느 기기에서나 항상
 * 펼쳐져 있다 — 그 분기가 필요 없다.
 *
 * ── 준비 중인 기능은 회색이다 ──
 * ⑦ A/S 바로출동서비스가 그렇다(`features.ts` 의 `comingSoon`). 목업대로 카드가
 * 회색으로 내려앉지만, **색만으로 상태를 말하지 않는다**(CLAUDE.md §4) — 포함
 * 항목에 "준비 중" 이라는 글자가 함께 있다. 링크는 살려 둔다: 페이지에 오픈 예정
 * 안내가 있어 눌러서 확인할 수 있어야 한다.
 *
 * ── 카드 전체가 링크다 ──
 * 카드 안에 "자세히 보기" 링크를 따로 두지 않는다. 일곱 장에 일곱 개의 작은
 * 링크가 생기면 탭 순서가 배로 늘고 터치 표적도 작아진다. 카드 자체가 `<a>` 라
 * 키보드 탭 정지점이 하나다.
 *
 * 도착지는 `/features/<key>` 다 — 키는 `features.ts` 의 `key` 이고,
 * `/features/[key]` 가 같은 값으로 정적 경로를 만든다.
 *
 * ── 전환 시간을 토큰으로 쓴다 ──
 * `var(--dur-menu)` 는 모션 축소 설정에서 1ms 로 내려간다(`globals.css`).
 * 컴포넌트에서 따로 분기하지 않아도 전환이 즉시 끝난다. 남은 움직임은 커서를
 * 올렸을 때 카드가 1px 떠오르는 것뿐이다.
 */
export function FeatureGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <li key={f.key} className="h-full">
          <Link
            href={`/features/${f.key}`}
            aria-label={`${f.title} 자세히 보기`}
            className={cn(
              "group flex h-full flex-col overflow-hidden rounded-lg p-6",
              "shadow-[var(--shadow-card)]",
              "ease-brand transition-[transform,box-shadow] duration-[var(--dur-menu)]",
              "hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              /* 준비 중은 회색 면. 글자 대비를 지키려고 흰 글씨를 그대로 쓴다 */
              f.comingSoon
                ? "bg-text-sub focus-visible:outline-ink text-white"
                : "bg-brand focus-visible:outline-brand text-white",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white/15 text-white">
                <ServiceIcon name={f.icon} size={20} />
              </span>
              <h3 className="text-h4 text-white">{f.title}</h3>
            </div>

            <p className="text-body-sm mt-3.5 leading-[1.65] text-white/85">{f.summary}</p>

            <ul className="text-caption mt-3.5 flex flex-col gap-1.5 border-t border-white/25 pt-3.5 text-white/90">
              {f.bullets.map((b) => (
                <li key={b} className="flex gap-1.5">
                  <span aria-hidden className="text-white/60">
                    ·
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Link>
        </li>
      ))}
    </ul>
  );
}
