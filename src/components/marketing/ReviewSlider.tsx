import { Card } from "@/components/ui/Card";
import { DUMMY_REVIEWS } from "@/content/dummy";
import { cn } from "@/lib/cn";
import s from "./ReviewSlider.module.css";

/**
 * 점주 후기 — 끊김 없이 흐르는 두 줄 슬라이드.
 *
 * ── 왜 두 줄, 왜 반대 방향인가 ──
 * 한 줄짜리 띠는 후기 다섯 개가 한 바퀴 도는 동안 화면이 거의 정지해 보인다.
 * 위아래 두 줄을 서로 반대로 흘리면 같은 속도에서도 장면이 계속 갈리고,
 * 시선이 한 방향으로 끌려가지 않아 **읽으려고 멈추기** 쉬워진다.
 * 아랫줄은 후기 순서를 두 칸 돌려 두 줄이 같은 짝으로 붙어 다니지 않게 했다.
 *
 * ── 무한 루프 예외 ──
 * 디자인 시스템은 무한 루프를 금지하지만 흐르는 띠는 브랜드 티커와 같은
 * 이유로 예외다. 끝이 있으면 중간에 멈춘 띠가 되어 고장으로 읽힌다.
 * 예외를 쓰는 대가로 두 가지 안전장치가 **반드시** 붙는다
 * (`ReviewSlider.module.css` 에 근거와 함께 있다):
 *   1. 커서·키보드 포커스·터치에서 그 줄이 멈춘다
 *   2. `prefers-reduced-motion: reduce` 에서는 완전 정지 + 가로 스크롤
 *
 * ── 티커와 다른 점: 접근성 ──
 * 브랜드 티커는 같은 로고를 반복하는 장식이라 통째로 aria-hidden 이었다.
 * 후기는 **읽혀야 하는 내용**이다. 그래서 흐르는 트랙만 감추고 같은 내용을
 * `sr-only` 목록으로 한 번 더 낸다 — 스크린리더에는 같은 후기가 여러 번
 * 읽히는 대신 다섯 개가 한 번 읽힌다.
 *
 * aria-hidden 은 **뷰포트가 아니라 트랙**에 건다. 뷰포트에 걸면 모션 축소에서
 * 가로 스크롤 영역이 통째로 보조기기에서 사라진다.
 *
 * ── 한 줄이 뷰포트보다 넓어야 한다 ──
 * -50% 기법은 두 번째 벌이 첫 벌 자리에 정확히 닿을 때 되돌아간다. 한 벌이
 * 좁으면 뒤에 빈 공간이 생긴다. 후기 5개로는 부족해서 한 벌에 후기를 **두 번**
 * 넣는다(약 3,600px). 트랙에는 그 벌이 둘이라 카드가 20장 — 전부 텍스트라 가볍다.
 */

/** 한 바퀴 도는 시간. 후기는 읽어야 하므로 로고 티커(34s)보다 느리게.
 *  두 줄의 값을 다르게 둬야 주기가 맞아떨어져 같은 화면이 반복되는 일이 없다 */
const TOP_ROW_SEC = 72;
const BOTTOM_ROW_SEC = 88;

/** 아랫줄은 순서를 두 칸 돌린다 — 두 줄에 같은 후기가 나란히 걸리지 않게 */
const BOTTOM_ROW = [...DUMMY_REVIEWS.slice(2), ...DUMMY_REVIEWS.slice(0, 2)];

type Review = (typeof DUMMY_REVIEWS)[number];

function ReviewCard({ quote, owner, region }: { quote: string; owner: string; region: string }) {
  return (
    <div className={cn(s.card, "shrink-0")}>
      <Card padding={24} className="flex h-full w-[340px] flex-col justify-between">
        <p className="text-body text-ink leading-[1.7]">“{quote}”</p>
        <p className="text-caption text-text-sub mt-5">
          {region} · {owner}
        </p>
      </Card>
    </div>
  );
}

/** 흐르는 줄의 한 벌 — 후기가 두 번 들어간다 */
function Set({ items }: { items: readonly Review[] }) {
  return (
    <div className="flex shrink-0 items-stretch gap-5 pr-5">
      {[...items, ...items].map((r, i) => (
        <ReviewCard key={`${r.id}-${i}`} quote={r.quote} owner={r.owner} region={r.region} />
      ))}
    </div>
  );
}

function Row({
  items,
  durationSec,
  reverse = false,
}: {
  items: readonly Review[];
  durationSec: number;
  reverse?: boolean;
}) {
  return (
    <div className={s.viewport} style={{ "--row-dur": `${durationSec}s` } as React.CSSProperties}>
      {/* 시각 전용 — 같은 후기가 네 번 지나가므로 보조기기에는 감춘다 */}
      <div className={cn(s.track, reverse && s.trackReverse)} aria-hidden>
        <Set items={items} />
        {/* 복제본 — 이음매를 지우는 역할. 내용이 같아야 한다 */}
        <Set items={items} />
      </div>
    </div>
  );
}

export function ReviewSlider() {
  return (
    <>
      <div className="flex flex-col gap-5">
        <Row items={DUMMY_REVIEWS} durationSec={TOP_ROW_SEC} />
        <Row items={BOTTOM_ROW} durationSec={BOTTOM_ROW_SEC} reverse />
      </div>

      {/* 보조기기·크롤러용 원본. 중복 없이 다섯 개 */}
      <ul className="sr-only">
        {DUMMY_REVIEWS.map((r) => (
          <li key={r.id}>
            <blockquote>{r.quote}</blockquote>
            <p>
              {r.region} {r.owner}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
