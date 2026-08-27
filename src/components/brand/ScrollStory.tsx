"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { StoryFloaters } from "./StoryFloaters";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { SCENES, SCENE_COUNT, ENDING_START, useSceneWindow, type Scene } from "./storyTiming";

/*
 * LazyMotion(`m` + 기능 지연 로드)을 시도했다가 되돌렸다.
 * 실측 결과 210.0KB → 216.7KB 로 **오히려 6.7KB 늘었다**.
 * 이 컴포넌트의 무게는 DOM 기능 세트가 아니라 useScroll/useSpring/useTransform
 * 훅 자체이고, 그것들은 지연 로드 대상이 아니다. LazyMotion 의 컨텍스트
 * 오버헤드만 순증했다. 스크롤 훅을 쓰는 곳에서는 LazyMotion 이 도움이 되지 않는다.
 */

/**
 * 시그니처 브랜드 서사 — 스크롤 스크럽.
 *
 * 원본 시그니처 로고 영상(23.4초 / 6씬 / 1920×1080)을 재생하지 않는다. 대신
 *  · 씬을 실제 DOM 으로 재구축해 반응형 타이포 토큰을 적용하고 (REVIEW-002 가설1 해소)
 *  · Claude Design 런타임(babel 3.1MB)을 걷어내며 (가설2 해소)
 *  · 재생 속도의 통제권을 사용자에게 넘긴다(스크롤 = 타임라인).
 *
 * 마지막 씬은 원본 씬6 과 동일하게 **링이 확장되며 슬로건형 로고로 전환**되고
 * 브랜드 프라미스로 닫는다.
 *
 * 네이티브 CSS animation-timeline 은 MDN 기준 Baseline "Limited availability"
 * 이므로 쓰지 않는다(가설3).
 *
 * ── 라이브러리를 쓰는 이유 ──
 * 스크롤 위치를 그대로 매핑하면 트랙패드·저사양 기기에서 값이 튄다.
 * useSpring 으로 감쇠를 걸어 관성 있는 스크럽을 만든다. 이것이 무의존성
 * 구현(ScrollStoryLite)과의 실질적 품질 차이다.
 */

const RING_OUT = [ENDING_START + 0.04, ENDING_START + 0.13] as const;
const LOGO_IN = [ENDING_START + 0.07, ENDING_START + 0.17] as const;

/** 스크롤 값의 지터를 흡수하는 감쇠 스프링. 과하면 뒤늦게 따라와 답답해진다. */
const SPRING = { stiffness: 220, damping: 40, restDelta: 0.0005 } as const;

function SceneBlock({
  progress,
  index,
  scene,
}: {
  progress: MotionValue<number>;
  index: number;
  scene: Scene;
}) {
  const opacity = useSceneWindow(progress, index);
  const y = useTransform(opacity, [0, 1], [18, 0]);
  // 들어올 때 아주 미세하게 커진다 — 씬이 "앞으로 나오는" 느낌
  const scale = useTransform(opacity, [0, 1], [0.985, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      // 텍스트는 항상 DOM 에 존재한다(크롤러·스크린리더). 시각적으로만 페이드된다.
      className="col-start-1 row-start-1 px-[var(--gutter)] text-center will-change-[opacity,transform]"
    >
      {scene.headline && (
        <h2 className="text-display text-ink mx-auto max-w-[22ch]">{scene.headline}</h2>
      )}
      {/* 줄바꿈은 storyTiming 의 body 배열이 결정한다. 자동 줄바꿈에 맡기면
          "확인하실 / 수 있습니다" 처럼 어절이 잘린다. */}
      <p
        className={
          scene.headline
            ? "text-h4 text-text-sub mx-auto mt-6 leading-[1.7] font-normal"
            : // 엔딩 — 로고가 헤드라인 역할을 하므로 한 단계 키운다
              "text-h3 text-text-sub mx-auto leading-[1.6] font-medium"
        }
      >
        {scene.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </motion.div>
  );
}

function SceneDot({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const active = useSceneWindow(progress, index);
  const background = useTransform(active, [0, 1], ["#DBE4FA", "#004ACC"]);
  const width = useTransform(active, [0, 1], [14, 28]);
  return <motion.span style={{ background, width }} className="h-1.5 rounded-full" />;
}

/**
 * 링 → 슬로건형 로고. 같은 격자 칸에 겹쳐 두고 교차 전환한다.
 *
 * 링 구조는 원본 심볼과 동일하게 **좌측점(15,70) ↔ 우측점(125,70)** 을 잇는
 * 두 개의 반원이다. 흰 점은 우측점에 **고정**된다(회전하지 않음).
 *
 * 그리는 순서 — 점의 맞은편에서 출발해 시계방향으로 한 바퀴:
 *   ① 상단 그라데이션 반원: 좌(9시) → 위 → 우(3시)  = 점에 도착
 *   ② 하단 솔리드 반원:     우(3시) → 아래 → 좌(9시) = 한 바퀴 완성
 * SVG 호에서 sweep=1 이 화면상 시계방향이다.
 */
function StoryMark({
  topOffset,
  bottomOffset,
  ringScale,
  ringOpacity,
  logoOpacity,
  logoScale,
}: {
  topOffset: MotionValue<number> | null;
  bottomOffset: MotionValue<number> | null;
  ringScale: MotionValue<number> | null;
  ringOpacity: MotionValue<number> | null;
  logoOpacity: MotionValue<number> | null;
  logoScale: MotionValue<number> | null;
}) {
  return (
    <div className="grid shrink-0 place-items-center">
      <motion.svg
        width="112"
        height="112"
        viewBox="0 0 140 140"
        fill="none"
        aria-hidden
        className="col-start-1 row-start-1 will-change-[opacity,transform]"
        style={ringScale && ringOpacity ? { scale: ringScale, opacity: ringOpacity } : undefined}
      >
        <defs>
          <linearGradient
            id="ba-story-grad"
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

        {/* 아직 채워지지 않은 궤도 = 자동화되지 않은 나머지 절반 */}
        <circle cx="70" cy="70" r="55" stroke="#EDF2FD" strokeWidth="30.26" />

        {/* ① 상단 그라데이션 — 좌 → 위 → 우 (시계방향) */}
        <motion.path
          d="M15 70 A55 55 0 0 1 125 70"
          stroke="url(#ba-story-grad)"
          strokeWidth="30.26"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          style={topOffset ? { strokeDashoffset: topOffset } : { strokeDashoffset: 0 }}
        />

        {/* ② 하단 솔리드 — 우 → 아래 → 좌 (시계방향 연속) */}
        <motion.path
          d="M125 70 A55 55 0 0 1 15 70"
          stroke="#004ACC"
          strokeWidth="30.26"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          style={bottomOffset ? { strokeDashoffset: bottomOffset } : { strokeDashoffset: 0 }}
        />

        {/* 흰 점 — 위치 고정. 파란 궤적이 여기로 도착한다 */}
        <circle cx="125" cy="70" r="8.73" fill="#FFFFFF" />
      </motion.svg>

      {/* 엔딩 — 링이 확장되며 이 로고로 넘어간다 */}
      <motion.div
        className="col-start-1 row-start-1 will-change-[opacity,transform]"
        style={logoOpacity && logoScale ? { opacity: logoOpacity, scale: logoScale } : undefined}
      >
        <Image
          src="/brand/logo-slogan.svg"
          alt="반오토 — 무인매장 위탁 관리 서비스"
          width={320}
          height={120}
          className="h-auto w-[min(78vw,320px)]"
        />
      </motion.div>
    </div>
  );
}

function StoryInner() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // ★ 라이브러리를 쓰는 실질적 이유 — 원시 스크롤 값에 감쇠를 건다
  const smooth = useSpring(scrollYProgress, SPRING);

  // 점의 맞은편(9시)에서 출발해 시계방향 한 바퀴.
  // 상단 반원이 먼저 그려져 점(3시)에 도착하고, 이어서 하단 반원이 채워진다.
  const HALF = 0.04 + (ENDING_START - 0.04) / 2;
  const topOffset = useTransform(smooth, [0.04, HALF], [1, 0], { clamp: true });
  const bottomOffset = useTransform(smooth, [HALF, ENDING_START], [1, 0], { clamp: true });
  // 엔딩: 링이 커지며 사라지고, 그 자리에서 로고가 올라온다
  const ringScale = useTransform(smooth, [RING_OUT[0], RING_OUT[1]], [1, 1.55], { clamp: true });
  const ringOpacity = useTransform(smooth, [RING_OUT[0], RING_OUT[1]], [1, 0], { clamp: true });
  const logoOpacity = useTransform(smooth, [LOGO_IN[0], LOGO_IN[1]], [0, 1], { clamp: true });
  const logoScale = useTransform(smooth, [LOGO_IN[0], LOGO_IN[1]], [0.86, 1], { clamp: true });

  // 스크롤 유도는 첫 씬에서만 필요하다. 계속 떠 있으면 마지막 로고 씬에서
  // "더 내려라"가 되어 엔딩을 방해한다.
  const cueOpacity = useTransform(smooth, [0, 0.06, 0.14], [1, 1, 0], { clamp: true });
  // 투명해진 뒤에도 클릭을 먹으면 안 된다
  const cuePointer = useTransform(cueOpacity, (v) => (v < 0.05 ? "none" : "auto"));

  if (reduced) {
    // 모션 축소: 스크롤 잠금을 완전히 해제하고 씬을 자연 흐름으로 쌓는다
    return (
      <section aria-label="반오토 브랜드 서사" className="bg-bg-subtle section-py">
        <div className="container-ba flex flex-col items-center gap-14 text-center">
          {SCENES.map((s) => (
            <div key={s.key}>
              {s.headline && (
                <h2 className="text-display text-ink mx-auto max-w-[22ch]">{s.headline}</h2>
              )}
              <p className="text-h4 text-text-sub mx-auto mt-6 leading-[1.7] font-normal">
                {s.body.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
          <Image
            src="/brand/logo-slogan.svg"
            alt="반오토 — 무인매장 위탁 관리 서비스"
            width={320}
            height={120}
            className="h-auto w-[min(78vw,320px)]"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label="반오토 브랜드 서사"
      style={{ height: `${SCENE_COUNT * 100}vh` }}
      className="bg-bg-subtle relative"
    >
      {/*
        svh — iOS 주소창 접힘으로 인한 높이 점프 방지.
        자식에 flex-1 을 주면 남은 공간을 전부 흡수해 justify-center 가 무력화되고
        마크가 상단으로 밀린다. 세 블록 모두 콘텐츠 높이를 유지해 그룹 전체가
        뷰포트 정중앙에 놓이게 한다.
      */}
      <div className="sticky top-0 flex h-[var(--screen-h)] flex-col items-center justify-center gap-6 overflow-hidden md:gap-7">
        {/* 좌우 여백에 씬별 아이콘이 떠 있다 (lg 이상) */}
        <StoryFloaters progress={smooth} />

        <StoryMark
          topOffset={topOffset}
          bottomOffset={bottomOffset}
          ringScale={ringScale}
          ringOpacity={ringOpacity}
          logoOpacity={logoOpacity}
          logoScale={logoScale}
        />

        {/* 씬을 같은 격자 칸에 겹쳐 둔다 → 높이는 가장 큰 씬 기준으로 고정(점프 없음) */}
        <div className="relative grid w-full shrink-0 place-items-center">
          {SCENES.map((s, i) => (
            <SceneBlock key={s.key} progress={smooth} index={i} scene={s} />
          ))}
        </div>

        {/* 진행 표시 — 남은 길이를 예측할 수 있게 해 스크롤 잠금의 불안을 줄인다 */}
        <div className="relative flex shrink-0 items-center gap-2" aria-hidden>
          {SCENES.map((s, i) => (
            <SceneDot key={s.key} progress={smooth} index={i} />
          ))}
        </div>

        {/* 스크롤 유도 — 스테이지 하단 중앙. 첫 씬에서만 보이고 사라진다.
            중앙 정렬 그룹(링·씬·진행점)에 끼면 그 그룹을 위로 밀어내므로
            흐름에서 빼내 절대배치한다. */}
        <motion.div
          style={{ opacity: cueOpacity, pointerEvents: cuePointer }}
          className="absolute inset-x-0 bottom-6 flex justify-center md:bottom-8"
        >
          <ScrollCue label="스크롤하여 내리기" />
        </motion.div>
      </div>
    </section>
  );
}

export function ScrollStory() {
  return <StoryInner />;
}
