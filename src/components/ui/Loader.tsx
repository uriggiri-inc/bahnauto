import { cn } from "@/lib/cn";

/**
 * 반오토 브랜드 로더.
 *
 * 흔한 "점 3개(···)" 대신 **브랜드 심볼의 링**을 쓴다. 디자인시스템이
 * 심볼의 용도로 "파비콘 · 앱 아이콘 · **로딩 인디케이터** · 대형 그래픽 요소"를
 * 명시적으로 허용한다.
 *
 * ── 왜 JS 애니메이션을 쓰지 않는가 ──
 * 로더가 뜨는 상황은 **아직 아무것도 준비되지 않은 순간**이다. 여기서
 * 애니메이션 라이브러리(gzip 42.5KB)를 기다려야 로더가 보인다면 앞뒤가 뒤바뀐다.
 * 회전은 CSS 키프레임(`ba-orbit`)으로 처리해 **JS 0바이트**로 동작한다.
 * SVG 지오메트리도 인라인이라 외부 파일 요청이 없다.
 *
 * ── 무한 루프 예외 ──
 * 디자인시스템은 장식 모션의 무한 루프를 금지하지만, 로더는 "작업이 진행 중"을
 * 알리는 **기능 요소**이므로 멈추면 안 된다. 대신 reduced-motion 에서는
 * 회전을 멈추고 은은한 명암 변화만 남긴다 — 완전히 정지하면 고장으로 읽힌다.
 */

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, number> = { sm: 24, md: 40, lg: 64 };

export type LoaderProps = {
  size?: Size;
  /** 스크린리더용 상태 문구. 화면에도 보이게 하려면 `showLabel` */
  label?: string;
  showLabel?: boolean;
  className?: string;
};

export function Loader({
  size = "md",
  label = "불러오는 중입니다",
  showLabel = false,
  className,
}: LoaderProps) {
  const px = SIZES[size];

  return (
    <div
      // 진행 상태를 보조기술에 알린다. alert 가 아니라 status 다(방해하지 않음)
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 140 140"
        fill="none"
        aria-hidden
        className="ba-loader shrink-0"
      >
        <defs>
          {/* id 충돌 방지 — 한 화면에 로더가 여러 개 있어도 안전하도록 고유값 */}
          <linearGradient
            id="ba-loader-grad"
            gradientUnits="userSpaceOnUse"
            x1="15"
            y1="0"
            x2="125"
            y2="0"
          >
            <stop offset="0" stopColor="#004ACC" />
            <stop offset="1" stopColor="#A3C3FF" />
          </linearGradient>
        </defs>

        {/* 아직 채워지지 않은 궤도 */}
        <circle cx="70" cy="70" r="55" stroke="#EDF2FD" strokeWidth="30.26" />

        {/* 회전하는 부분 — 상단 그라데이션 반원 + 하단 솔리드 반원 + 궤도 위의 점 */}
        <g className="ba-loader__spin">
          <path
            d="M15 70 A55 55 0 0 1 125 70"
            stroke="url(#ba-loader-grad)"
            strokeWidth="30.26"
            strokeLinecap="round"
          />
          <path
            d="M125 70 A55 55 0 0 1 15 70"
            stroke="#004ACC"
            strokeWidth="30.26"
            strokeLinecap="round"
            opacity="0.28"
          />
          <circle cx="125" cy="70" r="8.73" fill="#FFFFFF" />
        </g>
      </svg>

      {showLabel ? (
        <p className="text-body-sm text-text-sub">{label}</p>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

/**
 * 전체 화면 로딩. 라우트 전환·스트리밍 대기 중에 쓴다.
 * 헤더 높이만큼 위로 치우치지 않도록 뷰포트 중앙에 놓는다.
 */
export function FullscreenLoader({ label }: { label?: string }) {
  return (
    <div className="bg-bg flex min-h-[100svh] flex-col items-center justify-center gap-6">
      <Loader size="lg" label={label ?? "페이지를 불러오는 중입니다"} showLabel />
    </div>
  );
}

export default Loader;
