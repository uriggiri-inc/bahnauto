import { formatCopy } from "@/components/ui/Copy";
import { SectionLabel } from "./SectionLabel";
import { cn } from "@/lib/cn";

/**
 * 섹션 도입부 — 라벨 · 헤드라인 · 리드문의 **골격을 하나로 고정**한다.
 *
 * 왜 컴포넌트로 묶는가: 1차 구현에서 섹션마다 헤더를 직접 짰더니 h2 아래 여백이
 * 3·4·5·10 네 종류로 갈렸고, 리드문이 있는 섹션과 없는 섹션이 규칙 없이 섞였다.
 * 값 하나하나는 사소하지만 아홉 번 반복되면 "리듬이 없다"로 읽힌다.
 *
 * ⚠️ `label` 은 아껴 쓴다. SectionLabel 자체의 규정이 **섹션 3개당 최대 1개**다.
 *    홈에서는 핵심 3섹션(운영 시스템 · 요금 · 도입 절차)에만 붙인다.
 *    전부에 붙이면 모든 섹션이 같은 리듬이 되어 오히려 위계가 사라진다.
 */

export type SectionHeaderProps = {
  /** 짧은 명사구. 핵심 섹션에만 */
  label?: string;
  title: React.ReactNode;
  /** 한두 문장. 헤드라인이 답을 다 했으면 생략한다 */
  lead?: React.ReactNode;
  /** 다크 섹션 위 */
  onDark?: boolean;
  /** 아래 콘텐츠와의 간격을 조절해야 할 때만 (예: 2열 배치의 좌측 컬럼은 mb-0) */
  className?: string;
};

export function SectionHeader({
  label,
  title,
  lead,
  onDark = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", className)}>
      {label && (
        <SectionLabel tone={onDark ? "onDark" : "brand"} className="mb-3">
          {label}
        </SectionLabel>
      )}

      {/* 섹션 제목은 text-h1(28~42px). 처음엔 text-h2(26~36px)로 뒀다가 키웠다 —
          히어로를 지나면 각 섹션의 첫 문장이 그 화면의 유일한 진입점이라
          본문과의 대비가 충분히 커야 눈에 먼저 걸린다. */}
      <h2 className={cn("text-h1 mb-4 last:mb-0", onDark ? "text-white" : "text-ink")}>{title}</h2>

      {/* 46rem ≈ 한글 60자. 이보다 길어지면 줄 끝에서 다음 줄 앞을 찾기 어려워진다 */}
      {lead && (
        <p className={cn("text-body-lg max-w-[46rem]", onDark ? "text-white/70" : "text-text-sub")}>
          {formatCopy(lead)}
        </p>
      )}
    </div>
  );
}
