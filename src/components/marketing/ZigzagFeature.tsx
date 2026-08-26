import { ScreenShot, type Shot } from "./ScreenStack";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 좌 텍스트 / 우 앱 화면이 교차하는 기능 설명 블록 (PRD §7.2 레이아웃 규정).
 *
 * 교차시키는 이유: 같은 배치가 일곱 번 반복되면 스크롤이 단조로워져 중간에서 읽기를
 * 멈춘다. 좌우를 번갈아 두면 시선이 지그재그로 움직이며 각 블록을 새 장면으로 읽는다.
 *
 * ⚠️ **모바일에서는 항상 화면이 먼저, 텍스트가 나중이다**(PRD 명시).
 * 그래서 DOM 순서를 "화면 → 텍스트"로 두고 lg 이상에서만 순서를 바꾼다.
 * 반대로 짜면 모바일에서 텍스트를 다 읽고 나서야 화면이 나와 근거가 뒤늦게 온다.
 */

export type ZigzagFeatureProps = {
  label?: string;
  title: React.ReactNode;
  body: string;
  /** 사실 항목. 각 줄이 그 자체로 검증 가능한 문장이어야 한다 */
  points?: readonly string[];
  /**
   * 앱 화면 한 장.
   *
   * 틀(고정 화면비)을 쓰지 않는다 — 캡처마다 해상도가 달라 화면비를 강제하면
   * 잘린다(사용자 확정 2026-08-25). `width`/`height` 로 원본 비율을 유지한다.
   */
  screen: Shot & {
    caption?: string;
    /** 화면 폭 제한. 모바일 캡처는 세로로 길어 좁게 잡아야 섹션이 안 늘어난다 */
    maxW?: string;
  };
  /** true 면 데스크톱에서 화면이 왼쪽에 온다 */
  flip?: boolean;
  /** 앱 화면 대신 넣을 요소(체크리스트 데모 등) */
  children?: React.ReactNode;
};

export function ZigzagFeature({
  label,
  title,
  body,
  points,
  screen,
  flip = false,
  children,
}: ZigzagFeatureProps) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* 화면 — DOM 상 먼저. 모바일에서 위로 오게 하기 위해서다 */}
      <Reveal className={cn(flip ? "lg:order-1" : "lg:order-2")}>
        {children ?? (
          <ScreenShot
            shot={screen}
            caption={screen.caption}
            className={cn("mx-auto", screen.maxW ?? "max-w-[380px]")}
          />
        )}
      </Reveal>

      <Reveal delayMs={80} className={cn(flip ? "lg:order-2" : "lg:order-1")}>
        {label && <SectionLabel className="mb-3">{label}</SectionLabel>}
        <h2 className="text-h1 text-ink mb-4">{title}</h2>
        <p className="text-body-lg text-text-sub max-w-[46rem]">{formatCopy(body)}</p>

        {points && (
          <ul className="border-border-light mt-6 flex flex-col gap-3 border-t pt-6">
            {points.map((p) => (
              <li key={p} className="text-body text-ink flex gap-3">
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
                  className="mt-1 shrink-0"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </div>
  );
}
