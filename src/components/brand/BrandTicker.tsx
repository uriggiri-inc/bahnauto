import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * 브랜드 티커 — 장면과 장면 사이를 끊는 띠.
 *
 * 섹션 경계가 흐릿한 곳(스크롤 잠금이 풀리는 지점, 밝은 면에서 다크 면으로
 * 넘어가는 지점)에 띠 하나를 넣어 **장면이 바뀌었음**을 물리적으로 알린다.
 * 동시에 브랜드 각인 장치다 — 히어로에서 본 로고를 다시 보여주면
 * "이 화면을 만든 브랜드"가 이름과 함께 묶인다.
 *
 * ── 끊김 없는 순환 ──
 * 같은 줄을 두 번 넣고 트랙을 -50% 만큼 민다. 두 번째 줄이 첫 줄 자리에 정확히
 * 도달할 때 0 으로 되돌아가므로 이음매가 보이지 않는다.
 * **한 줄의 폭이 뷰포트보다 넓어야 한다** — 좁으면 뒤쪽에 빈 공간이 생긴다.
 * 항목당 약 147px × 16개 ≈ 2,350px 로, 일반적인 데스크톱(최대 1,920px)을 덮는다.
 *
 * ── 톤을 두 개 두는 이유 ──
 * 띠는 위아래 섹션과 **둘 다 달라야** 구분선 역할을 한다.
 *   `ink`  — 밝은 섹션과 밝은 섹션 사이
 *   `tint` — 밝은 섹션과 **다크 섹션 사이**. 여기에 잉크 띠를 쓰면 아래 다크
 *            섹션과 붙어버려 띠가 사라진다.
 *
 * 브랜드 블루 배경은 쓸 수 없다. `-dark` 로고의 링 그라데이션 시작색이
 * `#004ACC` 라 배경과 같아져 링 한쪽이 사라지고, 디자인 시스템은
 * **`filter: invert()` 를 금지**한다(같은 이유 — 링 그라데이션이 깨진다).
 *
 * ── 접근성 ──
 * 같은 이름을 열여섯 번 반복하는 장식이므로 통째로 `aria-hidden` 이다.
 * 스크린리더에 "반오토 반오토 반오토…" 가 읽히면 소음이 된다.
 */

/** 한 줄에 들어가는 항목 수 — 뷰포트를 덮을 만큼 */
const PER_ROW = 16;

type Tone = "ink" | "tint";

const TONES: Record<Tone, { band: string; logo: string; dot: string }> = {
  ink: {
    band: "bg-ink",
    // 어두운 배경에는 반드시 -dark 버전 (디자인 시스템 규정)
    logo: "/brand/logo-horizontal-dark.svg",
    dot: "bg-brand-300/70",
  },
  tint: {
    // 섹션 구분용 옅은 블루 틴트. 위가 화이트라 상단에 얇은 경계선을 준다
    band: "bg-bg-tint border-border border-t",
    logo: "/brand/logo-horizontal.svg",
    dot: "bg-brand-300",
  },
};

export type BrandTickerProps = {
  tone?: Tone;
  /** 한 바퀴 도는 시간. 짧으면 산만하고 길면 멈춰 보인다 */
  durationSec?: number;
  /** 흐르는 방향을 뒤집는다. 한 페이지에 띠가 둘 이상일 때 쓴다 */
  reverse?: boolean;
  className?: string;
};

function Row({ logo, dot }: { logo: string; dot: string }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: PER_ROW }, (_, i) => (
        <div key={i} className="flex shrink-0 items-center gap-10 pr-10">
          <Image src={logo} alt="" width={61} height={26} className="h-[26px] w-auto opacity-90" />
          {/* 항목 사이의 호흡. 브랜드 링의 점을 축소한 어휘다 */}
          <span className={cn("size-1.5 shrink-0 rounded-full", dot)} />
        </div>
      ))}
    </div>
  );
}

export function BrandTicker({
  tone = "ink",
  durationSec = 34,
  reverse = false,
  className,
}: BrandTickerProps) {
  const t = TONES[tone];

  return (
    <div
      aria-hidden
      className={cn("ba-ticker overflow-hidden py-4", t.band, className)}
      style={{ "--ticker-dur": `${durationSec}s` } as React.CSSProperties}
    >
      <div className={cn("ba-ticker__track", reverse && "ba-ticker__track--reverse")}>
        <Row logo={t.logo} dot={t.dot} />
        {/* 복제본 — 이음매를 지우는 역할. 내용이 같아야 한다 */}
        <Row logo={t.logo} dot={t.dot} />
      </div>
    </div>
  );
}
