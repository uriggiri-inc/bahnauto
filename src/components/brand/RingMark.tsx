import { clsx } from "clsx";

/**
 * 브랜드 시그니처 링.
 *
 * 시그니처 로고 영상(V2/V3)의 씬 1~3에서 링이 그려지는 모션만 발췌해
 * 순수 SVG + CSS 로 경량 재구현한 것. 원본은 1920×1080 고정 캔버스 +
 * Claude Design 런타임(babel 3.1MB + React)에 의존하므로 웹사이트에 직접
 * 넣을 수 없다. (REVIEW-002 가설 2)
 *
 * 지오메트리는 원본 SVG에서 그대로 가져왔다:
 *   중심 (70,70) · 반지름 55 · stroke-width 30.26 · 점 r=8.73
 *   그라데이션 #004ACC → #A3C3FF (원본 id: baRing2)
 *
 * 브랜드 서사: 비어 있는 궤도 = 자동화되지 않은 나머지 절반,
 * 궤도를 채우며 도는 점 = 그 자리를 채우러 가는 반오토.
 * 디자인 시스템 모션 규정에 따라 1회만 돌고 멈춘다(무한 루프 금지).
 */

/**
 * 브랜드 최소 노출 크기. 이보다 작으면 **말로 지키던 규정이 지켜지지 않는다** —
 * 실제로 홈 히어로 배지가 18px 로 들어가 링이 파란 얼룩처럼 뭉쳤다
 * (사용자 지적 2026-08-18). 주석이 아니라 코드가 막게 한다.
 *
 * 24px 기준: 획 두께가 크기의 21.6%(30.26/140)라 24px 에서 획이 5.2px 다.
 * 그 아래로 가면 트랙(연한 파랑)과 호가 뭉쳐 링으로 읽히지 않는다.
 */
const MIN_SIZE = 24;

type Props = {
  /**
   * 렌더 크기(px). **24px 미만은 24px 로 올려 그린다**(위 상수 주석).
   * 더 작게 넣어야 하는 자리라면 링을 쓰지 말고 텍스트만 두는 것이 맞다.
   */
  size?: number;
  /** false면 완성 상태로 정지 렌더. 반복 노출 지점(푸터 등)에서 사용 */
  animate?: boolean;
  className?: string;
  /** 장식용이 아닐 때만 지정. 지정하면 img role + label 부여 */
  label?: string;
};

export function RingMark({ size = 120, animate = true, className, label }: Props) {
  const drawn = Math.max(size, MIN_SIZE);
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <svg
      width={drawn}
      height={drawn}
      viewBox="0 0 140 140"
      fill="none"
      className={clsx(animate && "ba-ring", className)}
      {...a11y}
    >
      <defs>
        <linearGradient
          id="ba-ring-grad"
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

      {/* 트랙 — 아직 채워지지 않은 궤도 */}
      <circle cx="70" cy="70" r="55" stroke="#EDF2FD" strokeWidth="30.26" />

      {/* 상단 반원 — 그라데이션 */}
      <path
        className="ba-ring__arc ba-ring__arc--top"
        d="M15 70 A55 55 0 0 1 125 70"
        stroke="url(#ba-ring-grad)"
        strokeWidth="30.26"
        strokeLinecap="round"
        pathLength={1}
      />

      {/* 하단 반원 — 솔리드 */}
      <path
        className="ba-ring__arc ba-ring__arc--bottom"
        d="M15 70 A55 55 0 0 0 125 70"
        stroke="#004ACC"
        strokeWidth="30.26"
        strokeLinecap="round"
        pathLength={1}
      />

      {/* 궤도 위의 점 */}
      <g className="ba-ring__dot">
        <circle cx="125" cy="70" r="8.73" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
