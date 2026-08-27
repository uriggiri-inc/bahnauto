import Link from "next/link";
import { ServiceIcon } from "@/components/marketing/serviceIcons";
import { FEATURES } from "@/content/features";
import { cn } from "@/lib/cn";

/**
 * 주요기능 7종 — 홈 요약 격자.
 *
 * ── 접힌 흰 카드 + 커서를 올린 카드만 펼침 (사용자 지시 2026-08-27) ──
 * 같은 날 오전에 담당자 목업(`홈페이지_수정.pptx` 2번 장)을 그대로 옮겨 **일곱 장
 * 모두 파란 면에 내용까지 펼친** 상태로 만들었다. 그런데 그 화면을 보고
 * **"이전에 구현했던 것처럼 작은 흰색 박스에 커서를 올리면 그 박스만 커지게"** 로
 * 되돌리라는 지시가 왔다. 목업은 "카드가 펼쳐지면 이렇게 보인다" 를 보여주는
 * 그림이었고, 기본 상태까지 그렇게 하라는 뜻은 아니었다.
 *
 * 그래서 지금 화면은 **둘을 합친 것**이다:
 *   · 기본 — 아이콘과 이름만 있는 **작은 흰 카드**
 *   · 커서·포커스 — 그 카드에만 브랜드 면이 아래에서 차오르고 요약·포함 항목이
 *     펼쳐진다. 펼쳐진 모습이 곧 목업의 파란 카드다
 *
 * 목업에서 남긴 것: **3열 · 7장 · 번호 없음.** 번호(01~08)를 되살리지 않는 이유는
 * 요금이 "묶음" 에서 "기본 + 옵션" 으로 바뀌어 순서·등급을 암시할 근거가 없기
 * 때문이다.
 *
 * ── 왜 덮개인가 ──
 * 격자에 일곱 장의 요약과 포함 항목을 동시에 펼치면 **글자 서른 줄**이 한꺼번에
 * 들어와, 정작 훑어야 할 일곱 개의 이름이 묻힌다. 홈에서 얻어야 하는 건 목록이
 * 아니라 **"이 일곱 가지를 맡길 수 있다"** 는 사실이다.
 *
 * ── 터치 기기 (요청의 "반응형") ──
 * 터치에는 hover 가 없다. hover 로만 열면 모바일 방문자는 **영원히 못 본다.**
 * 그래서 기본값이 "펼쳐진 상태"이고 `@media (hover: hover)` 인 기기에서만 접는다.
 * 순서가 반대였다면 모바일에서 정보가 통째로 사라졌을 것이다. 열 수도
 * 1 → 2 → 3 으로 함께 늘어난다.
 *
 * ⚠️ 커서를 올리면 **그 줄 전체가 함께 높아진다**(격자 행 높이는 가장 높은 칸이
 *    정한다). 옆 칸은 내용이 열리지 않고 흰 면만 늘어난다. 겹쳐 띄우는 방식
 *    (`absolute` + `z-index`)으로 하면 그 줄은 가만히 있지만 **아래 줄 카드와 하단
 *    버튼을 가린다.** 접힌 높이를 낮게 잡아 늘어나는 양을 줄이는 쪽을 골랐다 —
 *    가려지는 것보다 함께 늘어나는 편이 덜 헷갈린다.
 *
 * ── 준비 중인 기능 ──
 * ⑦ A/S 바로출동서비스가 그렇다(`features.ts` 의 `comingSoon`). 차오르는 면이
 * 브랜드 컬러가 아니라 회색이다. **색만으로 상태를 말하지 않는다**(CLAUDE.md §4)
 * — 포함 항목에 "준비 중" 이라는 글자가 함께 있다. 링크는 살려 둔다: 페이지에
 * 오픈 예정 안내가 있어 눌러서 확인할 수 있어야 한다.
 *
 * ── 카드 전체가 링크다 ──
 * 카드 안에 "자세히 보기" 링크를 따로 두지 않는다. 일곱 장에 일곱 개의 작은
 * 링크가 생기면 탭 순서가 배로 늘고 터치 표적도 작아진다. 카드 자체가 `<a>` 라
 * 키보드 탭 정지점이 하나이고, `focus-visible` 에서 덮개가 그대로 열린다
 * (마우스를 못 쓰는 사용자도 내용을 볼 수 있어야 한다).
 *
 * 도착지는 `/features/<key>` 다 — 키는 `features.ts` 의 `key` 이고,
 * `/features/[key]` 가 같은 값으로 정적 경로를 만든다.
 *
 * ── 전환 시간을 토큰으로 쓴다 ──
 * `var(--dur-menu)` 는 모션 축소 설정에서 1ms 로 내려간다(`globals.css`).
 * 컴포넌트에서 따로 분기하지 않아도 전환이 즉시 끝난다.
 */
export function FeatureGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <li key={f.key} className="h-full">
          <Link
            href={`/features/${f.key}`}
            aria-label={`${f.title} 자세히 보기`}
            className={cn(
              "group border-border relative flex h-full flex-col overflow-hidden",
              /*
                접힌 높이의 하한. 아이콘(36px) + 이름 한 줄 + 위아래 패딩(48px)이면
                내용이 84px 이라, 96px 은 아래에 12px 여유만 남기는 값이다. 더 키우면
                이름 아래가 빈 띠로 남아 "작은 박스" 로 안 보이고, 더 줄이면 카드가
                가로 띠처럼 납작해진다.
              */
              "min-h-[6rem] rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]",
              "ease-brand transition-[transform,box-shadow] duration-[var(--dur-menu)]",
              "hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              f.comingSoon ? "focus-visible:outline-ink" : "focus-visible:outline-brand",
            )}
          >
            {/*
              차오르는 면. 아래에서 위로 덮는다(`PainCard` 와 같은 방식·같은 톤).
              준비 중인 기능만 회색으로 차오른다 — 흰 글씨 대비를 지키려고
              `--color-text-sub`(#5a6070)를 쓴다. 더 밝은 회색은 4.5:1 아래로 떨어진다.
            */}
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 translate-y-full",
                "ease-brand transition-transform duration-[var(--dur-menu)]",
                "group-hover:translate-y-0 group-focus-visible:translate-y-0",
                f.comingSoon ? "bg-text-sub" : "bg-brand",
              )}
            />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "bg-brand-100 text-brand grid size-9 shrink-0 place-items-center rounded-[10px]",
                    "ease-standard transition-colors duration-[var(--dur-menu)]",
                    "group-hover:bg-white/15 group-hover:text-white",
                    "group-focus-visible:bg-white/15 group-focus-visible:text-white",
                  )}
                >
                  <ServiceIcon name={f.icon} size={20} />
                </span>

                {/* 이름이 주인공 — 접힌 상태에서 카드에 이것만 남는다 */}
                <h3
                  className={cn(
                    "text-h4 text-ink",
                    "ease-standard transition-colors duration-[var(--dur-menu)]",
                    "group-hover:text-white group-focus-visible:text-white",
                  )}
                >
                  {f.title}
                </h3>
              </div>

              {/*
                0fr → 1fr. 터치 기기는 기본값 1fr(펼침)이고, hover 가 되는 기기에서만
                접었다가 커서·포커스에 반응해 편다.
                `max-height` 추정치를 쓰면 항목 수가 다른 카드에서 잘린다.
              */}
              <div
                className={cn(
                  "mt-auto grid grid-rows-[1fr] transition-[grid-template-rows]",
                  "ease-brand duration-[var(--dur-menu)] [@media(hover:hover)]:grid-rows-[0fr]",
                  "group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p
                    className={cn(
                      "text-body-sm text-text-sub pt-3.5 leading-[1.65]",
                      "ease-standard transition-colors duration-[var(--dur-menu)]",
                      "group-hover:text-white/85 group-focus-visible:text-white/85",
                    )}
                  >
                    {f.summary}
                  </p>

                  <ul
                    className={cn(
                      "text-caption text-text-sub border-border-light mt-3.5 flex flex-col gap-1.5 border-t pt-3.5",
                      "ease-standard transition-colors duration-[var(--dur-menu)]",
                      "group-hover:border-white/25 group-hover:text-white/90",
                      "group-focus-visible:border-white/25 group-focus-visible:text-white/90",
                    )}
                  >
                    {f.bullets.map((b) => (
                      <li key={b} className="flex gap-1.5">
                        <span
                          aria-hidden
                          className={cn(
                            "text-brand-400",
                            "group-hover:text-white/60 group-focus-visible:text-white/60",
                          )}
                        >
                          ·
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
