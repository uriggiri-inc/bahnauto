import type { ReactNode } from "react";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { cn } from "@/lib/cn";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 하위 페이지 히어로 — **한 화면을 꽉 채운다** (사용자 확정 2026-08-14).
 *
 * 홈 히어로(`app/(site)/page.tsx` 의 `Hero`)와 같은 규칙을 따른다:
 *   · 높이 = 뷰포트 − 상단 고정 헤더 (`100svh` — iOS 주소창 접힘 대응)
 *   · 내용은 세로·가로 모두 가운데, 스크롤 큐는 바닥에 붙는다
 *   · **모션 라이브러리를 쓰지 않는다** — 히어로는 LCP 요소다(CLAUDE.md §4)
 *
 * ── 홈과 다른 점: CTA 버튼이 없다 ──
 * 하위 페이지 히어로에는 버튼 대신 `pageName`(어느 페이지인지)과 스크롤 유도만
 * 둔다(사용자 확정). 여기서 이미 페이지 안에 들어와 있는 사람에게 다시
 * "상담 신청"을 들이미는 대신, 아래에 있는 내용부터 보게 한다.
 *
 * ── `bleed` ──
 * `true`  — 자기 배경(브랜드 그라디언트)을 깔고 화면 전체 폭을 쓴다. 요금·도입 절차.
 * `false` — 배경 없이 부모가 준 칸 안에서만 높이를 채운다. 주요기능은 왼쪽에
 *           목차(SNB)가 나란히 붙어 있어(사용자 확정) 전체 폭을 쓸 수 없다.
 */

export type PageHeroProps = {
  /** 어느 페이지인지 — 알약 배지로 맨 위에 박힌다. 생략하지 않는다 */
  pageName: string;
  /** 배지 아래 보조 줄. 아이콘·번호 등 페이지별 식별 요소 */
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** 리드 아래 붙는 것 (배지 묶음 등) */
  aside?: ReactNode;
  /** 스크롤 큐가 데려갈 다음 섹션의 id */
  scrollTargetId: string;
  bleed?: boolean;
  className?: string;
};

export function PageHero({
  pageName,
  eyebrow,
  title,
  lead,
  aside,
  scrollTargetId,
  bleed = true,
  className,
}: PageHeroProps) {
  const body = (
    <>
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center py-14 text-center",
          bleed && "container-ba",
        )}
      >
        <p className="border-brand-200 text-label text-brand inline-flex items-center rounded-full border bg-white px-4 py-2 shadow-[var(--shadow-card)]">
          {pageName}
        </p>

        {eyebrow && <div className="mt-6">{eyebrow}</div>}

        <h1 className="text-display text-ink mt-6 max-w-[22ch]">{title}</h1>

        {lead && (
          <p className="text-body-lg text-text-sub mt-7 max-w-[42rem]">{formatCopy(lead)}</p>
        )}

        {aside && <div className="mt-8">{aside}</div>}
      </div>

      <div className="flex justify-center pb-8">
        <ScrollCue targetId={scrollTargetId} />
      </div>
    </>
  );

  const shell = cn(
    "relative flex min-h-[calc(100svh-var(--header-h))] flex-col",
    bleed && "from-brand-50 bg-gradient-to-b to-white",
    className,
  );

  return bleed ? <section className={shell}>{body}</section> : <div className={shell}>{body}</div>;
}
