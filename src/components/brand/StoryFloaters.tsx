"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
/*
 * 아이콘 번들 비용 실측 (gzip, 프로덕션 빌드):
 *   아이콘 없음 168.7KB → Phosphor 11개 228.1KB  = +17.7KB
 * 개별 `/dist/ssr/*` 진입점으로 바꿔봤으나 절감은 0.1KB 였다.
 * Turbopack 이 배럴을 이미 트리셰이킹하고 있고, 17.7KB 는 아이콘 하나가
 * 6개 weight 를 품는 Phosphor 의 구조상 실제 비용이다. 배럴 임포트를 유지한다.
 * 아이콘은 서비스 카드·도입 절차 등 사이트 전역에서 재사용되므로 상각된다.
 */
import {
  Broom,
  Calendar,
  Camera,
  ChartBar,
  CheckCircle,
  CreditCard,
  ListChecks,
  Package,
  Phone,
  QrCode,
  Wrench,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { SCENE_COUNT, useSceneWindow } from "./storyTiming";

/**
 * 스크롤 서사의 궤도 위성.
 *
 * ── 왜 궤도인가 ──
 * 이전 판은 화면 모서리에 아이콘-인-박스를 띄웠다. 그건 장식이었고,
 * 브랜드의 시각 언어(호 · 궤도 · 채워지는 절반)와 아무 관계가 없었다.
 *
 * 지금은 아이콘이 **궤도 위에 놓인다**. 그러면 위치 자체가 의미를 갖는다.
 *   씬1 · 자동으로 도는 것 2개  → 궤도 **위쪽**(중앙 링에서 이미 채워진 절반)
 *   씬2 · 사람 몫으로 남은 5개  → 궤도 **아래쪽**(아직 비어 있는 절반). 개수가 곧 부담
 *   씬3 · 반오토가 맡는 4개     → 좌우로 **정돈**되어 자리를 잡는다
 *   씬4 · 엔딩                  → 전부 사라지고 로고만 남는다
 *
 * ── 설계 규칙 ──
 * · 아이콘은 라이브러리(Phosphor)에서 온다. 손으로 그리지 않는다
 * · **라벨은 붙인다.** 한때 "본문과 중복"을 이유로 뺐다가 되돌렸다 —
 *   화면 가장자리의 아이콘 하나는 그것만으로 읽히지 않는다. 특히 40~50대 점주에게는.
 *   대신 라벨이 나열을 맡으므로 씬 본문에서 같은 나열을 반복하지 않는다(중복 해소).
 * · 사각 타일은 쓰지 않는다. 원형 칩은 브랜드 링의 어휘이고, 아이콘과 라벨을
 *   하나의 덩어리로 묶는 실제 기능이 있다. 그림자를 얹어 카드로 만들지는 않는다.
 * · 각 위성은 **연결선으로 중앙 텍스트를 가리킨다**(말풍선 지시선). 선 끝의 점이
 *   "이 아이콘은 저 문장을 두고 하는 말"이라는 관계를 만든다.
 * · 등장은 스크롤 구동 순차 팝. 자동재생이 아니라 스크롤 위치에 묶여 있어
 *   되감으면 역순으로 사라진다.
 */

/**
 * 타원 궤도.
 *   470×300 → 500×340 → 545×355 → 580×380
 * 마지막 확대는 지정된 배치 좌표(좌측 -546px)가 이전 궤도(545) 바깥이라
 * 도달할 수 없었기 때문이다.
 */
const RX = 580;
const RY = 380;

/**
 * 텍스트 안전 영역(중심 기준 반폭/반높이).
 *
 * SAFE_X 실측: "무인매장은 절반만 자동입니다" 는 1124px 뷰포트(text-display 51.7px)에서
 * 폭 580px 이었다. 1280px 에서는 58px 로 커져 폭 ≈650px, 반폭 ≈325px.
 * 이전 값 320 은 이미 부족했다. 여유를 둬 345 로 올린다.
 *
 * SAFE_Y: 헤드라인 + 본문 3줄 블록의 반높이 ≈ 94. 여유를 둬 200.
 */
const SAFE_X = 345;
const SAFE_Y = 200;
/** 위성 반폭 — 칩(최대 100) 기준 */
const SAT_HALF_W = 50;
/** 위성 반높이 — 칩 100 + gap 8 + 라벨 20 */
const SAT_HALF_H = 64;

/** 칩 지름 = 아이콘 크기 + 이 여백 */
const CHIP_PAD = 32;

type Slot = { deg: number; size: number; opacity: number; dur: string; delay: string };

/**
 * 0° = 3시 방향, 시계방향. 아이콘 크기는 초기(26~34)의 약 2배.
 *
 * 각도는 지정된 배치 좌표를 스테이지 중심 기준으로 환산해 역산했다.
 *   좌상 (-319,-284) → 234° · 우상 (+284,-267) → -55°
 *   좌   (-546,+162) → 156° · 우하 (+519,+196) →  30°
 *   하   ( +23,+372) →  88°
 * 나머지 3개(우·하좌·좌)는 다른 씬의 균형을 위해 채운 슬롯이다.
 */
const SLOTS: Slot[] = [
  { deg: -55, size: 60, opacity: 0.92, dur: "8s", delay: "0s" }, // 0 우상 ★지정
  { deg: -20, size: 68, opacity: 1, dur: "9.5s", delay: "-1.4s" }, // 1 우
  { deg: 30, size: 56, opacity: 0.9, dur: "7.5s", delay: "-2.8s" }, // 2 우하 ★지정
  { deg: 88, size: 64, opacity: 0.96, dur: "8.5s", delay: "-0.7s" }, // 3 하 중앙 ★지정
  { deg: 124, size: 60, opacity: 0.92, dur: "9s", delay: "-3.4s" }, // 4 하좌
  { deg: 156, size: 56, opacity: 0.9, dur: "7.8s", delay: "-1.9s" }, // 5 좌 ★지정
  { deg: 200, size: 68, opacity: 1, dur: "8.8s", delay: "-2.2s" }, // 6 좌
  { deg: 234, size: 60, opacity: 0.92, dur: "9.2s", delay: "-0.4s" }, // 7 좌상 ★지정
];

function pos(deg: number) {
  const r = (deg * Math.PI) / 180;
  return { x: Math.round(RX * Math.cos(r)), y: Math.round(RY * Math.sin(r)) };
}

/**
 * 위성에서 중앙 텍스트를 향하는 지시선의 양 끝점.
 * 안쪽 끝은 텍스트 안전 상자의 경계 바로 바깥에서 멈춘다 —
 * 상자 안으로 들어가면 글자를 침범한다.
 */
function leader(deg: number, size: number) {
  const { x, y } = pos(deg);
  const d = Math.hypot(x, y);
  const chipR = (size + CHIP_PAD) / 2 + 10;
  // 바깥 끝 — 칩 가장자리에서 조금 떨어져 시작
  const ox = x - (x / d) * chipR;
  const oy = y - (y / d) * chipR;
  // 안쪽 끝 — 안전 상자와 만나는 지점의 8% 바깥
  const t = Math.min(SAFE_X / Math.abs(x || 1), SAFE_Y / Math.abs(y || 1)) * 1.08;
  return { ox, oy, ix: x * t, iy: y * t };
}

// 개발 중 슬롯이 텍스트를 침범하면 즉시 드러나도록 검증한다.
// 위성의 바깥 가장자리 기준으로 판정한다(중심점 기준이 아니라).
if (process.env.NODE_ENV !== "production") {
  SLOTS.forEach((s) => {
    const { x, y } = pos(s.deg);
    const clearX = Math.abs(x) - SAT_HALF_W > SAFE_X;
    const clearY = Math.abs(y) - SAT_HALF_H > SAFE_Y;
    if (!clearX && !clearY) {
      console.warn(
        `[StoryFloaters] 슬롯 ${s.deg}° 가 텍스트 안전영역을 침범합니다 (x=${x}, y=${y})`,
      );
    }
  });
}

type Sat = { key: string; Icon: PhosphorIcon; label: string; slot: number };

/**
 * 씬별 위성 — 궤도 위 위치가 곧 의미다.
 * 배열 순서 = 등장 순서.
 */
const PER_SCENE: Sat[][] = [
  // 씬1 · 자동으로 도는 것 → 궤도 위쪽(이미 채워진 절반)
  [
    { key: "pay", Icon: CreditCard, label: "결제", slot: 0 },
    { key: "enter", Icon: QrCode, label: "입장", slot: 7 },
  ],
  // 씬2 · 사람 몫으로 남은 것 → 지정된 5개 위치(좌상·우상·좌·우하·하 중앙)로 넓게 퍼진다.
  // 텍스트를 둘러싸 "사방에 할 일이 남아 있다"로 읽힌다.
  [
    { key: "clean", Icon: Broom, label: "청소", slot: 7 },
    { key: "stock", Icon: Package, label: "재고", slot: 0 },
    { key: "call", Icon: Phone, label: "고객 응대", slot: 5 },
    { key: "check", Icon: Wrench, label: "기기 점검", slot: 2 },
    { key: "admin", Icon: Calendar, label: "행정", slot: 3 },
  ],
  // 씬3 · 반오토가 맡는 것 → 좌우 대칭으로 정돈된다
  [
    { key: "list", Icon: ListChecks, label: "체크리스트", slot: 1 },
    { key: "photo", Icon: Camera, label: "사진 기록", slot: 2 },
    { key: "done", Icon: CheckCircle, label: "완료 확인", slot: 4 },
    { key: "report", Icon: ChartBar, label: "데일리 리포트", slot: 6 },
  ],
  // 씬4 · 엔딩 — 로고에 집중
  [],
];

const UNIT = 1 / SCENE_COUNT;

/** 위성 i 가 튀어나오는 진행도 구간. 씬 구간 앞쪽에서 순차로 터진다. */
function popWindow(sceneIndex: number, i: number) {
  const start = sceneIndex * UNIT + (0.15 + i * 0.06) * UNIT;
  return [start, start + 0.055 * UNIT, start + 0.09 * UNIT] as const;
}

/** 스크롤 위치에 묶인 순차 팝. 되감으면 역순으로 사라진다. */
function usePop(progress: MotionValue<number>, sceneIndex: number, i: number) {
  const [a, b, c] = popWindow(sceneIndex, i);
  // 1.18 로 살짝 넘겼다 제자리 — "뿅" 하는 탄성
  const scale = useTransform(progress, [a, b, c], [0, 1.18, 1], { clamp: true });
  const opacity = useTransform(progress, [a, b], [0, 1], { clamp: true });
  return { scale, opacity };
}

function Satellite({
  sat,
  progress,
  sceneIndex,
  i,
}: {
  sat: Sat;
  progress: MotionValue<number>;
  sceneIndex: number;
  i: number;
}) {
  const slot = SLOTS[sat.slot];
  const { x, y } = pos(slot.deg);
  const { Icon, label } = sat;
  const { scale, opacity } = usePop(progress, sceneIndex, i);
  const chip = slot.size + CHIP_PAD;

  return (
    // 바깥 = 궤도 위 위치 고정. 안쪽 = 팝 + 느린 표류.
    // 한 요소에 전부 걸면 transform 이 서로를 덮어쓴다.
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        // 슬롯별 농도차 = 깊이감. 격자가 아니라 구성으로 읽히게 한다
        opacity: slot.opacity,
      }}
    >
      <motion.div style={{ scale, opacity }}>
        <div
          className="ba-float flex flex-col items-center gap-2"
          style={{ "--drift-dur": slot.dur, "--drift-delay": slot.delay } as React.CSSProperties}
        >
          {/* 원형 칩 — 카드가 아니라 브랜드 링의 어휘. 아이콘과 라벨을 한 덩어리로 묶는다 */}
          <span
            className="border-brand-200/70 flex items-center justify-center rounded-full border bg-white/90"
            style={{ width: chip, height: chip }}
          >
            <Icon size={slot.size} weight="regular" color="var(--color-brand)" aria-hidden />
          </span>
          {/* #8B919E 는 대비 3.1:1 이라 금지. text-sub(#5A6070, 6.4:1)를 쓴다 */}
          <span className="text-body-sm text-text-sub font-medium whitespace-nowrap">{label}</span>
        </div>
      </motion.div>
    </div>
  );
}

/** 위성 → 중앙 텍스트 지시선. 팝과 같은 타이밍으로 그려진다. */
function Leader({
  slotIndex,
  progress,
  sceneIndex,
  i,
}: {
  slotIndex: number;
  progress: MotionValue<number>;
  sceneIndex: number;
  i: number;
}) {
  const slot = SLOTS[slotIndex];
  const { ox, oy, ix, iy } = leader(slot.deg, slot.size);
  const [a, b, c] = popWindow(sceneIndex, i);
  // 칩이 터진 직후 선이 안쪽으로 뻗는다
  const draw = useTransform(progress, [b, c], [1, 0], { clamp: true });
  const dotScale = useTransform(progress, [c, c + 0.02 * UNIT], [0, 1], { clamp: true });
  const lineOpacity = useTransform(progress, [a, b], [0, 1], { clamp: true });

  return (
    <motion.g style={{ opacity: lineOpacity }}>
      <motion.line
        x1={ox}
        y1={oy}
        x2={ix}
        y2={iy}
        stroke="var(--color-brand-200)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 1"
        pathLength={1}
        style={{ strokeDashoffset: draw }}
      />
      {/* 선 끝의 점 — "이 아이콘은 저 문장을 두고 하는 말" */}
      <motion.circle
        cx={ix}
        cy={iy}
        r="4"
        fill="var(--color-brand)"
        style={{ scale: dotScale, transformBox: "fill-box", transformOrigin: "center" }}
      />
    </motion.g>
  );
}

function SceneSatellites({
  progress,
  sceneIndex,
  sats,
}: {
  progress: MotionValue<number>;
  sceneIndex: number;
  sats: Sat[];
}) {
  const opacity = useSceneWindow(progress, sceneIndex);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {/* 지시선 레이어 — 중심을 원점으로 두어 좌표 계산을 그대로 쓴다 */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        width="1"
        height="1"
        viewBox="-0.5 -0.5 1 1"
        fill="none"
      >
        <g>
          {sats.map((s, i) => (
            <Leader
              key={s.key}
              slotIndex={s.slot}
              progress={progress}
              sceneIndex={sceneIndex}
              i={i}
            />
          ))}
        </g>
      </svg>

      {sats.map((s, i) => (
        <Satellite key={s.key} sat={s} progress={progress} sceneIndex={sceneIndex} i={i} />
      ))}
    </motion.div>
  );
}

export function StoryFloaters({ progress }: { progress: MotionValue<number> }) {
  return (
    // 모바일에는 중앙 텍스트를 피할 궤도 반경이 없다 → lg 이상에서만.
    // 위성 바깥 끝은 ±(580+50)=±630, 총 1260px. 뷰포트별로 축소한다.
    //   lg  1024px → 0.68 (857px)
    //   xl  1280px → 0.82 (1033px)
    //   2xl 1536px → 1.00 (1260px, 지정된 좌표 그대로)
    <div
      className="pointer-events-none absolute inset-0 hidden scale-[0.68] lg:block xl:scale-[0.82] 2xl:scale-100"
      aria-hidden
    >
      {/* 궤도 — 위성이 아무 데나 떠 있는 게 아니라 길 위에 있음을 보여준다 */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        width={RX * 2 + 80}
        height={RY * 2 + 80}
        viewBox={`0 0 ${RX * 2 + 80} ${RY * 2 + 80}`}
        fill="none"
      >
        <ellipse
          cx={RX + 40}
          cy={RY + 40}
          rx={RX}
          ry={RY}
          stroke="var(--color-brand-200)"
          strokeWidth="1"
          strokeDasharray="2 10"
          opacity="0.7"
        />
      </svg>

      {PER_SCENE.map((sats, i) =>
        sats.length ? (
          <SceneSatellites key={i} progress={progress} sceneIndex={i} sats={sats} />
        ) : null,
      )}
    </div>
  );
}
