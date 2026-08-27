"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

/**
 * 문제제기(홈 H-02) — 한 화면에 꽉 차는 문제 패널 5장.
 *
 * ── 이전 두 판을 왜 버렸는가 ──
 * 1판(페인 카드 4장)은 "무엇이 남는가"만 말하고 왜 남았는지를 말하지 못했다.
 * 2판(핀 스크롤 서사)은 스크롤에 맞춰 장면이 넘어가는 방식이었는데,
 * **사용자 확정(2026-08-14): 스크롤 애니메이션은 쓰지 않는다.** 스크롤을 서사
 * 재생기로 쓰면 읽는 속도를 화면이 정하게 되고, 훑어보려는 사람은 갇힌 느낌을
 * 받는다.
 *
 * 3판(가로 아코디언 — 접힌 패널이 세로쓰기 기둥)은 **사용자 피드백(2026-08-14)
 * 으로 폐기**했다. 세로로 선 제목은 딱 봐도 읽기 어렵다.
 *
 * 5판(2026-08-14) — 자리 차지형 확대. 한 행을 열면 데스크톱에서 나머지 네 행이
 * 높이 0으로 접히고 투명해지면서 열린 행이 고정 높이 영역을 혼자 차지했다.
 * **사용자 지시(2026-08-18)로 폐기** — 창이 커지면 아래 항목이 사라져 지금 몇
 * 번째를 보고 있는지, 뒤에 무엇이 남았는지 알 수 없었다.
 *
 * 6판(사용자 지시 2026-08-18) — **일반 아코디언. 넓은 화면도 좁은 화면과 같다**.
 * · 다섯 행이 **항상 전부 보인다**. 열린 행 아래로 나머지가 그대로 남아 밀려난다.
 * · 행을 **누르면**(hover 아님 — 커서만 스쳐도 바뀌는 것이 성가시다는 피드백)
 *   제목 아래로 본문이 펼쳐진다. 다시 누르면 접힌다.
 * · 여닫이 버튼은 플러스(+)/마이너스(−) — 접혀 있으면 +, 열려 있으면 −.
 * · 펼친 본문 = **겪는 장면을 그린 스토리 한 덩어리**(핵심 구절 하이라이트).
 *   오른쪽 상황·불편·손실 3상자는 사용자 지시로 삭제했다(아래 `Problem` 주석).
 *
 * ⚠️ 5판이 영역 높이를 고정한 이유는 "확대·복귀 중에 아래 문장이 오르내리지
 *    않게" 였다. 아래 항목을 남기라는 지시는 그 고정과 양립하지 않는다 —
 *    열린 만큼 밀려나야 남는다. 그래서 아래 마무리 문장은 이제 함께 움직인다.
 *
 * ── 상호작용 ──
 * **클릭(탭·키보드 Enter 포함)으로만 여닫는다.** hover 여닫기는 커서만 스쳐도
 * 내용이 바뀌어 성가시다는 사용자 피드백으로 뺐다 — 버튼이라 마우스·키보드·
 * 터치 모두 같은 방법(누르기)으로 닿는다.
 * 펼침은 `grid-template-rows: 0fr → 1fr` 로 한다 — `max-height` 추정치를 쓰면
 * 문장 길이가 다른 패널에서 잘리거나 여백이 남는다.
 * 접힌 패널의 본문도 **DOM 에 그대로 남는다**(높이만 0). 스크린리더와 크롤러는
 * 다섯 가지를 전부 읽는다.
 *
 * 전환 시간은 `--dur-menu` 토큰이라 모션 축소 설정에서 1ms 로 내려간다.
 */

/** 스토리 문장 조각. `hl` 이 있으면 하이라이터가 칠해진다 */
type StorySeg = string | { hl: string };

type Problem = {
  key: string;
  title: string;
  /**
   * 겪는 장면을 그린 스토리 — 공감을 만드는 자리다.
   * ⚠️ 실제 고객의 사례·후기라고 말하지 않는다(표시광고법). 특정 날짜·수치·
   *    매장명 없이 **누구나 겪는 장면**으로만 쓴다.
   */
  story: readonly StorySeg[];

  /*
    ── 아래 셋은 **현재 화면에 그려지지 않는다** (사용자 지시 2026-08-18) ──
    펼친 본문 오른쪽에 `상황 / 불편 / 손실` 3상자로 나란히 있었는데, 왼쪽 스토리
    한 덩어리만 남기라는 지시로 삭제했다. 가독성이 올라가고 패널이 짧아진다.

    **값은 지우지 않는다.** 확정된 카피이고(2026-08-14) 다시 쓸 가능성이 있다.
    타입에서 빼면 다음에 되살릴 때 다섯 문제의 문장을 처음부터 다시 써야 한다.
  */
  /** 상황 — 무슨 일이 벌어지는가 */
  situation: string;
  /** 불편 — 사장님이 무엇을 하게 되는가 */
  burden: string;
  /** 손실 — 그래서 무엇을 잃는가 */
  loss: string;
};

/**
 * 다섯 가지 문제 — 카피 확정본(2026-08-14).
 *
 * ⚠️ 문구를 고칠 때는 카피 문서와 함께 고친다. 여기서만 다듬으면 어느 쪽이
 *    확정본인지 알 수 없게 된다.
 * ⚠️ 수치·통계·후기를 넣지 않는다(CLAUDE.md §5 · 표시광고법).
 */
const PROBLEMS: readonly Problem[] = [
  {
    key: "dawn",
    title: "새벽 청소",
    story: [
      "휴일 아침, 알람보다 먼저 눈이 떠집니다. 어젯밤 마지막 손님이 남긴 ",
      { hl: "과자 부스러기와 음료 자국" },
      "이 매트 위에 그대로 있을 겁니다. 문 열기 전에 치우지 못하면 ",
      { hl: "첫 손님의 첫인상이 그날의 리뷰" },
      "가 됩니다. 그래서 주말 아침도 매장에서 시작됩니다.",
    ],
    situation: "문 닫힌 매장에 들어가 밤사이 흔적을 치우는 것으로 하루가 시작됩니다.",
    burden: "첫 손님보다 먼저 도착해야 하니, 아침이 매장에 묶입니다.",
    loss: "치우지 못한 날의 첫인상은 그대로 그날의 리뷰가 됩니다.",
  },
  {
    key: "breakdown",
    title: "시간을 가리지 않는 고장 연락",
    story: [
      "가족과 저녁을 먹는 중에 전화가 울립니다. “",
      { hl: "키오스크가 안 돼요" },
      "”. 결제가 막히니 손님은 그냥 돌아서고, 지금 갈 수 있는 사람은 사장님뿐입니다. ",
      { hl: "수저를 내려놓고 매장으로" },
      " 향하는 길 — 이런 저녁이 처음이 아닙니다.",
    ],
    situation: "키오스크가 멈췄다는 전화는 꼭 자리를 비웠을 때 옵니다.",
    burden: "지금 갈 수 있는 사람이 사장님뿐이라, 하던 일을 멈추고 달려갑니다.",
    loss: "기계가 멈춘 시간만큼 결제가 끊기고, 발길을 돌린 손님은 돌아오지 않을 수 있습니다.",
  },
  {
    key: "stock",
    title: "재고와 유통기한",
    story: [
      "매대 앞에 서야 비로소 보입니다. 잘 나가던 음료는 ",
      { hl: "어제부터 품절" },
      "이었고, 구석의 과자는 ",
      { hl: "유통기한이 지나" },
      " 있었습니다. 품절은 매출에서 빠지고, 지난 기한 하나는 신뢰에서 빠집니다. 채우러 가는 걸음은 오늘도 반복됩니다.",
    ],
    situation: "무엇이 얼마나 빠졌는지는 진열대 앞에 서야 보입니다.",
    burden: "채우러 가는 걸음이 매일 반복되고, 유통기한은 그 사이에도 줄어듭니다.",
    loss: "품절은 매출에서 빠지고, 기한을 넘긴 상품 하나는 신뢰에서 빠집니다.",
  },
  {
    key: "calls",
    title: "사장님 휴대폰으로 오는 손님 전화",
    story: [
      "쉬는 날 오후, 모르는 번호가 뜹니다. “",
      { hl: "결제가 두 번 된 것 같은데요" },
      "”. 지금 못 받으면 나쁜 후기가 될까 봐 ",
      { hl: "휴대폰을 손에서 놓지 못합니다" },
      ". 매장은 무인인데, 사장님은 하루 종일 대기 중입니다.",
    ],
    situation: "환불, 결제, 이용 문의 — 매장 전화는 결국 사장님 휴대폰으로 연결됩니다.",
    burden: "쉬는 날에도, 다른 일을 하는 중에도 벨이 울립니다.",
    loss: "놓친 전화 한 통이 나쁜 후기 하나로 남기도 합니다.",
  },
  {
    key: "docs",
    title: "조용히 다가오는 서류 기한",
    story: [
      "소방 점검 안내문을 받았던 게 언제였는지 기억나지 않습니다. 보험 갱신일, 근로계약서, 보건증 — ",
      { hl: "기한은 소리 없이 다가와서" },
      ", 넘기고 나서야 ",
      { hl: "과태료 고지서로 모습을 드러냅니다" },
      ". 챙길 사람은 사장님 한 명뿐입니다.",
    ],
    situation: "소방 점검, 보험 갱신, 근로계약서 — 기한은 소리 없이 다가옵니다.",
    burden: "챙길 사람이 사장님 한 명뿐이라, 잊는 순간이 생깁니다.",
    loss: "넘긴 기한은 과태료와 영업 차질로 돌아옵니다.",
  },
];

/** 다음 섹션(H-04 "우리도 매장을 합니다")으로 넘기는 문장 */
const HANDOFF = "이건 남의 이야기가 아니라, 우리가 먼저 겪은 이야기입니다.";

export type ProblemStoryProps = {
  /** SNB 앵커. `home.config.ts` 의 섹션 id 를 그대로 받는다 */
  id: string;
  label?: string;
  title?: string;
};

export function ProblemStory({ id, label, title }: ProblemStoryProps) {
  // null = 쉬는 상태(다섯 행 전부 보임). 커서를 올리거나 누르면 그 행이 열린다.
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id={id} className="bg-bg-subtle">
      {/* 홈 전 섹션과 같은 기준으로 한 화면을 꽉 채운다(뷰포트 − 고정 헤더) */}
      <div className="container-ba flex min-h-[calc(var(--screen-h)-var(--header-h))] flex-col justify-center gap-8 py-[var(--section-py)] md:gap-10">
        {(label || title) && (
          <div className="text-center">
            {label && <SectionLabel className="mb-3">{label}</SectionLabel>}
            {title && <h2 className="text-h1 text-ink mx-auto max-w-[24ch]">{title}</h2>}
          </div>
        )}

        {/*
          가로로 읽히는 행 5줄. 본문 줄 길이가 늘어지지 않게 폭을 잡는다.
          **높이를 고정하지 않는다**(사용자 지시 2026-08-18) — 고정하면 열린 행이
          영역을 다 먹고 나머지가 사라진다. 내용만큼 자라고 아래 행은 밀려난다.
        */}
        <ul className="mx-auto flex w-full max-w-[52rem] flex-col gap-2.5">
          {PROBLEMS.map((p, i) => {
            const isOpen = open === i;
            const panelId = `${id}-panel-${p.key}`;

            return (
              <li
                key={p.key}
                className={cn(
                  "ease-brand flex flex-col overflow-hidden rounded-lg border",
                  "transition-[background-color,border-color] duration-[var(--dur-menu)]",
                  // 펼쳐도 흰 카드다(사용자 확정 2026-08-14) — 진한 브랜드면 위의
                  // 흰 긴 글이 눈을 피로하게 했다. 파랑은 테두리·라벨·하이라이트
                  // 포인트로만 쓴다.
                  isOpen
                    ? "border-brand bg-white shadow-[var(--shadow-float)]"
                    : "border-border bg-white shadow-[var(--shadow-card)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={cn(
                    "flex w-full shrink-0 items-center gap-3 px-5 py-4 text-left md:px-6",
                    "focus-visible:outline-brand focus-visible:outline-2 focus-visible:-outline-offset-2",
                  )}
                >
                  <span
                    className={cn(
                      "text-caption shrink-0 tabular-nums",
                      isOpen ? "text-brand" : "text-text-sub",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* 열려 있어도 제목은 그대로 보인다. 5판에서는 데스크톱에서만
                      `sr-only` 로 물러나고 본문에 확대 제목이 따로 있었는데,
                      아코디언이 되면서 그 확대 제목을 없앴다(같은 제목이 둘) */}
                  <span className={cn("text-h4", isOpen ? "text-brand" : "text-ink")}>
                    {p.title}
                  </span>
                  {/* 여닫이 버튼 — 접혀 있으면 +, 열려 있으면 −. 세로획만 눕혀서 지운다 */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden
                    className={cn("ml-auto shrink-0", isOpen ? "text-brand" : "text-text-sub")}
                  >
                    <path d="M5 12h14" />
                    <path
                      d="M12 5v14"
                      className={cn(
                        "ease-brand transition-[transform,opacity] duration-[var(--dur-menu)]",
                        isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                      )}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  </svg>
                </button>

                {/*
                  0fr → 1fr. 접혀 있어도 텍스트는 DOM 에 남는다(높이만 0) —
                  스크린리더와 크롤러는 다섯 가지를 전부 읽는다.
                */}
                <div
                  id={panelId}
                  className={cn(
                    "ease-brand grid transition-[grid-template-rows] duration-[var(--dur-menu)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    {/*
                      ── 스토리 한 덩어리 (사용자 지시 2026-08-18) ──
                      오른쪽에 `상황 / 불편 / 손실` 3상자가 나란히 있었는데 삭제했다.
                      한 칸이 되면서 두 가지가 같이 해결됐다:
                        · 정렬 문제가 사라졌다 — 2단일 때 `items-center` 라 두 칸의
                          내용 높이가 다른 패널마다 짧은 쪽이 다른 높이에 떠 있었다
                        · 패널이 짧아졌다. 5장이 열려도 화면을 덜 먹는다

                      본문 왼쪽 여백을 헤더의 번호 자리와 맞춘다 — 헤더는
                      `px-5 md:px-6`, 번호(`text-caption`) + `gap-3` 만큼 들여쓰면
                      제목과 스토리의 세로선이 이어진다.
                    */}
                    <div className="px-5 pb-6 md:px-6">
                      <div className="border-brand-200 border-l-2 py-1 pl-4">
                        <p className="text-label text-brand">이런 하루, 익숙하지 않으신가요</p>
                        <p className="text-body lg:text-body-lg text-ink mt-2 leading-[1.9]">
                          {p.story.map((seg, s) =>
                            typeof seg === "string" ? (
                              seg
                            ) : (
                              // 형광펜 — 줄이 바뀌어도 칠이 이어지도록 box-decoration-clone
                              <span
                                key={s}
                                className="bg-brand-100 text-ink rounded-[4px] box-decoration-clone px-1 py-0.5 font-semibold"
                              >
                                {seg.hl}
                              </span>
                            ),
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* 다음 섹션으로 넘긴다 — 바로 아래 H-04 "우리도 매장을 합니다"가 이 문장을 받는다 */}
        <p className="text-h3 text-brand mx-auto max-w-[30ch] text-center">{HANDOFF}</p>
      </div>
    </section>
  );
}
