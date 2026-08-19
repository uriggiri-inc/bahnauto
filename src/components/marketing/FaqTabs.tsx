"use client";

import { useState } from "react";
import { FaqList } from "@/components/marketing/FaqList";
import { cn } from "@/lib/cn";
import type { FaqGroup } from "@/content/faq";

/**
 * 자주 묻는 질문 — **카테고리 탭. 한 번에 한 묶음만 보인다.**
 *
 * ── 앵커에서 탭으로 (사용자 확정 2026-08-18) ──
 * 이전 판은 다섯 묶음을 모두 그려 두고 위쪽 링크로 스크롤 이동했다. 참고 시안이
 * 탭 전환이라 그대로 맞췄다.
 *
 * ── 시안과 한 가지만 다르다: 호버가 아니라 클릭이다 ──
 * 시안은 **마우스 호버로** 카테고리가 바뀐다. 그건 두 가지가 깨진다:
 *   · 커서가 지나가기만 해도 읽던 답변이 사라진다
 *   · 터치 기기에는 호버가 없어 전환 자체가 불가능하다
 * 그래서 클릭(그리고 키보드)으로 바꿨다. 보이는 결과는 같고, 조작만 확실해진다.
 *
 * ── 숨긴 묶음도 HTML 에는 남는다 ──
 * `hidden` 속성으로 감추지만 DOM 에서 빼지 않는다. 24문항 전부가 마크업에 남아야
 * 검색엔진이 읽고, 구조화 데이터(FAQPage)를 붙일 때도 근거가 된다.
 * 다만 **브라우저 내 검색(Ctrl+F)은 숨은 묶음을 찾지 못한다** — 앵커 판이 가졌던
 * 장점이고, 탭으로 바꾸면서 내놓은 대가다.
 *
 * ── 접근성 ──
 * `role="tablist"` 를 직접 구현하지 않고 **버튼 + `aria-pressed`** 로 둔다.
 * 진짜 탭 역할을 선언하면 좌우 화살표 이동·`aria-selected`·`tabindex` 관리까지
 * 전부 JS 로 다시 짜야 하고, 하나라도 빠지면 선언만 있고 동작은 없는 상태가 된다.
 * 버튼 다섯 개는 Tab 으로 순서대로 닿고 Enter·Space 로 눌린다.
 */
export function FaqTabs({ groups }: { groups: readonly FaqGroup[] }) {
  const [activeId, setActiveId] = useState(groups[0]?.id ?? "");

  return (
    <>
      {/*
        카테고리 탭 — **따라오지 않고 제자리에 있다**(사용자 지시 2026-08-18).

        이전에는 `sticky top-[var(--header-h)]` 로 헤더 아래 붙어 스크롤을 따라왔다.
        따라오는 요소를 걷어내면서 그것에 딸려 있던 장치도 함께 지웠다:
          · `bg-white/90` + `backdrop-blur` — 본문 위를 덮고 지날 때 글자가
            비쳐 보이지 않게 하는 용도였다. 덮지 않으니 필요 없다
          · `border-b` — 떠 있는 띠와 본문의 경계선이었다. 이제는 탭과 목록을
            **떼어 놓는** 선이 되어, 붙여 달라는 지시와 반대로 작동한다
          · `z-20` — 겹칠 상대가 없다

        아래 여백은 `pb-5`(20px)다. 목록 바로 위에서 끊어 탭과 목록이 한 덩어리로
        읽히게 한다. 이전에는 `py-3` + 목록 섹션의 `section-py`(최대 96px)가 겹쳐
        100px 가까이 벌어져 있었다.
      */}
      <nav aria-label="질문 분류">
        <div className="container-ba">
          <ul className="flex gap-2 overflow-x-auto pb-5">
            {groups.map((g) => {
              const on = g.id === activeId;
              return (
                <li key={g.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveId(g.id)}
                    aria-pressed={on}
                    className={cn(
                      "text-body-sm ease-standard inline-flex rounded-full border px-3.5 py-1.5",
                      "transition-colors duration-[160ms]",
                      on
                        ? "border-brand bg-brand font-semibold text-white"
                        : "border-border text-text-sub hover:text-brand hover:border-brand-200",
                    )}
                  >
                    {g.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 위 여백 없음 — 탭이 자기 아래 여백(`pb-5`)으로 간격을 정한다 */}
      <section className="pb-[var(--section-py)]">
        <div className="container-ba">
          {groups.map((g) => (
            <div key={g.id} id={g.id} hidden={g.id !== activeId}>
              {/*
                묶음 제목을 화면에서 뺐다 — 위 탭이 이미 "지금 무엇을 보고 있는지"를
                말한다. 다만 문서 구조상 h2 는 필요하므로 `sr-only` 로 남긴다.
              */}
              <h2 className="sr-only">{g.title}</h2>
              <FaqList items={g.items} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
