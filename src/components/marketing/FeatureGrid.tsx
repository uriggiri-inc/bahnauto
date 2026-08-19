import Link from "next/link";
import { ServiceIcon } from "@/components/marketing/serviceIcons";
import { FEATURES } from "@/content/features";
import { cn } from "@/lib/cn";

/**
 * 주요기능 8종 — 홈 요약 격자.
 *
 * ── 왜 덮개인가 ──
 * 이전 판은 여덟 장 모두에 요약 한 줄과 포함 항목을 펼쳐 놨다. 격자에 **글자
 * 마흔 줄**이 동시에 들어와, 정작 훑어야 할 여덟 개의 이름이 묻혔다. 홈에서
 * 얻어야 하는 건 목록이 아니라 **"이 여덟 가지를 맡길 수 있다"** 는 사실이다.
 * 그래서 기본 상태는 아이콘·번호·이름뿐이고, 자세한 내용은 커서를 올렸을 때
 * 브랜드 면이 차오르며 덮는다(`PainCard` 와 같은 방식·같은 톤).
 *
 * ── 유휴 셔플을 걷어냈다 (2026-08-14 사용자 확정) ──
 * 아무도 건드리지 않는 동안 카드 두 장이 자리를 바꾸는 장치가 있었는데,
 * 01~08 번호 순서가 화면에서 뒤섞여 보이는 문제로 **제거**했다. 카드는 이제
 * 항상 번호 순서대로 고정이고, 움직임은 커서를 올렸을 때의 덮개 반응뿐이다.
 * 상태가 전부 사라져 이 컴포넌트는 서버 컴포넌트다(JS 0바이트).
 *
 * ── 터치 기기 ──
 * 터치에는 hover 가 없다. hover 로만 열면 모바일 방문자는 **영원히 못 본다.**
 * 그래서 기본값이 "펼쳐진 상태"이고 `@media (hover: hover)` 인 기기에서만 접는다.
 * 순서가 반대였다면 모바일에서 정보가 통째로 사라졌을 것이다.
 *
 * ── 카드 전체가 링크다 ──
 * 카드 안에 "자세히 보기" 링크를 따로 두지 않는다. 여덟 장에 여덟 개의 작은
 * 링크가 생기면 탭 순서가 배로 늘고 터치 표적도 작아진다. 카드 자체가 `<a>` 라
 * 키보드 탭 정지점이 하나이고, `focus-visible` 에서 덮개가 그대로 열린다
 * (마우스를 못 쓰는 사용자도 내용을 볼 수 있어야 한다).
 *
 * 도착지는 `/features/<key>` 다 — 기능별 상세 페이지 분리(2026-08-14) 이후
 * 앵커가 아니라 페이지 경로다. 키는 `features.ts` 의 `key` 이고,
 * `/features/[key]` 가 같은 값으로 정적 경로를 만든다.
 *
 * 번호를 매기는 이유: 바로 아래 요금 섹션의 플랜 구성이 이 여덟 개를 부분
 * 집합으로 참조한다. 번호가 있으면 "베이직은 1~3번" 이 바로 읽힌다.
 *
 * ── 전환 시간을 토큰으로 쓴다 ──
 * `var(--dur-menu)` 는 모션 축소 설정에서 1ms 로 내려간다(`globals.css`).
 * 컴포넌트에서 따로 분기하지 않아도 전환이 즉시 끝난다.
 */
export function FeatureGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f, i) => (
        <li key={f.key} className="h-full">
          <Link
            href={`/features/${f.key}`}
            aria-label={`${f.title} 자세히 보기`}
            className={cn(
              "group border-border relative flex h-full min-h-[196px] flex-col overflow-hidden",
              "rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]",
              "ease-brand transition-[transform,box-shadow] duration-[var(--dur-menu)]",
              "hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
              "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2",
            )}
          >
            {/* 차오르는 브랜드 면. 아래에서 위로 덮는다 (PainCard 와 동일) */}
            <span
              aria-hidden
              className={cn(
                "bg-brand absolute inset-0 translate-y-full",
                "ease-brand transition-transform duration-[var(--dur-menu)]",
                "group-hover:translate-y-0 group-focus-visible:translate-y-0",
              )}
            />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "bg-brand-100 text-brand grid size-10 shrink-0 place-items-center rounded-[10px]",
                    "ease-standard transition-colors duration-[var(--dur-menu)]",
                    "group-focus-visible:bg-white/15 group-focus-visible:text-white",
                    "group-hover:bg-white/15 group-hover:text-white",
                  )}
                >
                  <ServiceIcon name={f.icon} size={22} />
                </span>
                <span
                  className={cn(
                    "text-caption text-text-sub tabular-nums",
                    "ease-standard transition-colors duration-[var(--dur-menu)]",
                    "group-hover:text-white/70 group-focus-visible:text-white/70",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* 이름이 주인공 — 접힌 상태에서 카드에 이것만 남는다 */}
              <h3
                className={cn(
                  "text-h4 text-ink mt-4",
                  "ease-standard transition-colors duration-[var(--dur-menu)]",
                  "group-hover:text-white group-focus-visible:text-white",
                )}
              >
                {f.title}
              </h3>

              {/*
                0fr → 1fr. 터치 기기는 기본값 1fr(펼침)이고, hover 가 되는
                기기에서만 접었다가 커서·포커스에 반응해 편다.
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
                      "text-body-sm text-text-sub pt-3 leading-[1.65]",
                      "ease-standard transition-colors duration-[var(--dur-menu)]",
                      "group-hover:text-white/80 group-focus-visible:text-white/80",
                    )}
                  >
                    {f.summary}
                  </p>

                  <ul
                    className={cn(
                      "text-caption text-text-sub border-border-light mt-3 flex flex-col gap-1.5 border-t pt-3",
                      "ease-standard transition-colors duration-[var(--dur-menu)]",
                      "group-focus-visible:border-white/25 group-focus-visible:text-white",
                      "group-hover:border-white/25 group-hover:text-white",
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
