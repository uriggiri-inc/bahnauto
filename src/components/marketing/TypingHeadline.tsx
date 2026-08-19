"use client";

import { useEffect, useState } from "react";

/**
 * 히어로 헤드라인의 회전 타이핑.
 *
 * ── 왜 페인을 회전시키는가 ──
 * 밤 11시에 폰으로 들어온 점주가 40초 안에 판단한다(REVIEW-001 §0). 이때 가장 빠른
 * 후킹은 브랜드 서사가 아니라 **오늘 그 사람이 실제로 한 일의 이름**이다.
 * "출퇴근확인은 이제 사장님 일이 아닙니다" 는 한 줄로 대상·문제·약속을 동시에 말한다.
 *
 * ── 무한 루프에 대하여 ──
 * 디자인 시스템은 무한 루프를 금지하지만, 이 회전은 **사용자 확정(2026-08-14)으로
 * 예외**다 — 브랜드 티커와 같은 지위. 항목이 5개로 줄어 한 바퀴가 짧고,
 * 모션 축소 환경에서는 돌지 않는다(아래).
 *
 * ── 접근성 · LCP ──
 * · 서버에서 첫 낱말을 **완성된 상태로** 렌더한다. 빈 칸에서 시작하면 LCP 가 늦고
 *   글자가 늘어나며 레이아웃이 흔들린다.
 * · `<h1>` 에는 완결된 문장을 `aria-label` 로 준다. 보조기기는 타이핑 중간 상태가
 *   아니라 그 문장을 읽는다.
 * · `prefers-reduced-motion: reduce` 에서는 첫 항목이 완성된 상태로 **정지**한다.
 * · 회전 낱말은 첫 줄 왼쪽에 있으므로 길이가 변해도 **세로 밀림(CLS)이 없다**.
 *
 * ⚠️ 한국어 조사는 앞 낱말의 받침에 따라 는/은 이 갈린다. 낱말이 다 찍히기 전에는
 *    조사를 붙이지 않는다 — 미완성 낱말에 조사를 붙이면 틀린 말이 잠깐씩 보인다.
 */

/** 사용자 지정 5개 항목(2026-08-14). **순서를 바꾸지 않는다.** */
const WORDS = ["출퇴근확인", "재고관리", "인허가·보험관리", "매출관리", "마케팅"] as const;

/** 한 글자 찍는 시간 */
const TYPE_MS = 55;
/** 한 글자 지우는 시간 — 지우기는 정보가 없으므로 빠르게 */
const DEL_MS = 24;
/** 다 찍고 머무는 시간. 읽을 시간을 준다 */
const HOLD_MS = 1200;
/** 다 지우고 다음 낱말로 넘어가기 전의 숨 */
const GAP_MS = 140;

/** 받침이 있으면 '은', 없으면 '는' */
function particleFor(word: string) {
  const last = word.charCodeAt(word.length - 1);
  const isHangul = last >= 0xac00 && last <= 0xd7a3;
  if (!isHangul) return "는";
  return (last - 0xac00) % 28 === 0 ? "는" : "은";
}

type Phase = "hold" | "del" | "type" | "still";
type State = { i: number; n: number; phase: Phase };

export function TypingHeadline({ className }: { className?: string }) {
  // 서버 렌더 = 첫 낱말이 완성된 상태. 마운트 후 여기서부터 이어진다.
  const [{ i, n, phase }, setState] = useState<State>({
    i: 0,
    n: WORDS[0].length,
    phase: "hold",
  });

  useEffect(() => {
    if (phase === "still") return;

    // 모션 축소: 돌지 않는다. 첫 항목이 완성된 상태로 정지한다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setState({ i: 0, n: WORDS[0].length, phase: "still" }), 0);
      return () => clearTimeout(t);
    }

    let delay = 0;
    let next: State;

    if (phase === "hold") {
      delay = HOLD_MS;
      next = { i, n, phase: "del" };
    } else if (phase === "del") {
      if (n === 0) {
        delay = GAP_MS;
        // 마지막 항목 다음은 처음으로 돌아간다 — 사용자 확정 무한 루프
        next = { i: (i + 1) % WORDS.length, n: 0, phase: "type" };
      } else {
        delay = DEL_MS;
        next = { i, n: n - 1, phase: "del" };
      }
    } else {
      if (n === WORDS[i].length) {
        delay = 0;
        next = { i, n, phase: "hold" };
      } else {
        delay = TYPE_MS;
        next = { i, n: n + 1, phase: "type" };
      }
    }

    const t = setTimeout(() => setState(next), delay);
    return () => clearTimeout(t);
  }, [i, n, phase]);

  const word = WORDS[i];
  const shown = word.slice(0, n);
  const complete = n === word.length;

  return (
    <div className={className}>
      <h1
        // 보조기기·크롤러가 읽는 완결 문장. 중간 상태는 읽히지 않는다.
        aria-label="출퇴근확인, 재고관리, 인허가·보험관리, 매출관리, 마케팅. 이 모든 일은 사장님 일이 아닙니다."
      >
        <span aria-hidden>
          {/* 회전 낱말 — 브랜드 컬러로 띄워 시선이 여기부터 시작하게 한다 */}
          <span className="text-brand">{shown}</span>
          {/* 조사는 낱말이 완성된 뒤에만 붙인다 */}
          {complete && <span>{particleFor(word)}</span>}
          {/* 캐럿 — 모션 축소로 정지하면 사라진다 */}
          <span
            className={
              phase === "still"
                ? "hidden"
                : "bg-brand ml-1 inline-block h-[0.82em] w-[3px] translate-y-[0.06em] align-baseline motion-safe:animate-[ba-caret_1s_steps(1,end)_infinite]"
            }
          />
          <br />
          사장님 일이 아닙니다
        </span>
      </h1>
    </div>
  );
}
