"use client";

import { useTransform, type MotionValue } from "motion/react";

/**
 * 스크롤 서사의 씬 타이밍. ScrollStory 와 StoryFloaters 가 공유한다.
 *
 * 부모에서 씬 개수만큼 훅을 배열로 호출하면 react-hooks/rules-of-hooks 에 걸리므로,
 * 각 씬 요소가 자기 윈도우를 직접 계산하도록 훅만 공유한다.
 */

export type Scene = {
  key: string;
  headline?: string;
  /**
   * 한 줄이 한 의미 단위가 되도록 **직접 끊는다**.
   * 자동 줄바꿈에 맡기면 "확인하실 / 수 있습니다" 처럼 어절이 잘린다.
   * 각 줄은 그 자체로 읽히는 구절이어야 한다.
   */
  body: readonly string[];
};

export const SCENES: readonly Scene[] = [
  {
    key: "auto",
    headline: "무인매장은 절반만 자동입니다",
    // 궤도 위 아이콘(결제·입장)을 가리킨다
    body: ["결제와 입장,", "여기까지가 자동입니다"],
  },
  {
    key: "half",
    headline: "나머지 절반은 여전히 사람의 일입니다",
    // 다섯 가지 나열은 아이콘 라벨이 대신한다 — 본문에서 반복하지 않는다
    body: ["매장에 사람이 없어도", "이 다섯 가지는 그대로 남습니다"],
  },
  {
    key: "bahnauto",
    headline: "그 절반을, 반오토가 맡습니다",
    body: ["전담 매니저가 무엇을 어떻게 했는지", "매일 사진과 기록으로", "확인하실 수 있습니다"],
  },
  {
    // 엔딩 — 헤드라인 없이 로고가 헤드라인 역할을 한다
    key: "logo",
    body: ["자동화되지 않은 나머지 절반", "그 절반을 반오토가 맡습니다"],
  },
] as const;

export const SCENE_COUNT = SCENES.length;

/** 마지막 씬 구간 진입 지점 = 로고 엔딩 시작 */
export const ENDING_START = 1 - 1 / SCENE_COUNT;

/** 씬 i 가 화면을 점유하는 구간을 0→1→0 삼각 윈도우로 환산 */
export function useSceneWindow(progress: MotionValue<number>, index: number) {
  const unit = 1 / SCENE_COUNT;
  const start = index * unit;
  const fade = unit * 0.3;
  return useTransform(
    progress,
    [start - fade, start + fade, start + unit - fade, start + unit + fade],
    [0, 1, 1, 0],
    { clamp: true },
  );
}
