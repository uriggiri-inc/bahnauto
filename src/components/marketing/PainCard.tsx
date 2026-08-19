import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * 4대 페인 카드 — 이름을 앞에 세우고, 설명은 덮어씌운다.
 *
 * ── 왜 레이어인가 ──
 * 이전 판은 제목·문제·해결을 한꺼번에 펼쳐놨다. 네 장이 나란히 서면 **글자 열두 줄**이
 * 동시에 들어와, 정작 알아야 할 네 단어(청결·재고·응대·점검)가 묻혔다.
 * 점주가 40초 안에 얻어야 하는 건 목록이 아니라 **"이 네 가지가 남는다"** 는 사실이다.
 * 그래서 기본 상태는 큰 이름 하나, 자세한 내용은 커서를 올렸을 때 차오른다.
 *
 * ── 터치 기기 ──
 * 터치에는 hover 가 없다. hover 로만 내용을 열면 모바일 방문자는 **영원히 못 본다.**
 * 그래서 기본값이 "펼쳐진 상태"이고, `@media (hover: hover)` 인 기기에서만 접는다.
 * 순서가 반대였다면 모바일에서 정보가 통째로 사라졌을 것이다.
 *
 * ── 키보드 ──
 * 링크가 아니라 카드라 원래는 탭 정지점이 아니다. 그러면 마우스를 못 쓰는 사용자가
 * 내용을 열 방법이 없어 `tabIndex={0}` 을 준다. 스크린리더에는 접힌 상태에서도
 * 텍스트가 DOM 에 남아 그대로 읽힌다(높이만 0 이다).
 *
 * 펼침은 `grid-template-rows: 0fr → 1fr` 로 한다. `max-height` 추정치를 쓰면
 * 글이 길어질 때 잘리거나 여백이 남는다.
 *
 * ── 배경 이미지 ──
 * 브랜드 배경은 **밝은 블루 라인아트**다(디자인 시스템 §배경·이미지: 풀블리드 사진을
 * 쓰지 않고 단색 또는 옅은 틴트를 쓴다).
 *
 * 스크림(어둡게 덮는 층)을 **깔지 않는다.** 사진이었다면 글자 가독성을 위해 필요하지만,
 * 이 일러스트들은 하단 35%가 비어 있어 글자와 겹치지 않는다. 옅은 선 그림 위에
 * 스크림을 얹으면 그림만 탁해진다.
 *
 * 대신 두 가지가 필요하다.
 *   1. `object-bottom` — 카드 비율이 브레이크포인트마다 크게 달라져(데스크톱 240×300
 *      ↔ 태블릿 463×300) 세로로 잘리는데, 기본값(center)이면 **비어 있는 아래쪽이
 *      잘려나가고** 그림 한가운데가 글자 뒤로 온다.
 *   2. 아이콘 칩에 흰 면 + 테두리 — 면 색만으로는 옅은 라인아트에 묻힌다.
 */

/*
 * 아이콘 칩을 걷어내면서 `PainIconName` 과 경로 표(`ICONS`)도 함께 지웠다.
 * 쓰지 않는 아이콘 정의를 남겨두면 다음 사람이 "왜 안 보이지" 를 한 번 더
 * 파게 된다.
 */

/**
 * 카드 폭은 브레이크포인트마다 다르다(계산 근거는 컴포넌트 주석 참고).
 *   ~479px  1열  → 컨테이너 전체 폭
 *   ~1023px 2열  → 최대 463px
 *   1024px~ 4열  → 224~242px
 */
const SIZES = "(max-width: 479px) calc(100vw - 40px), (max-width: 1023px) 46vw, 242px";

export type Pain = {
  /** 한두 글자. 이 카드의 전부다 */
  title: string;
  /** 점주가 겪는 일 */
  pain: string;
  /** 반오토가 하는 일 */
  ours: string;
  /** 배경 사진. 없으면 흰 카드로 렌더된다 */
  image?: { src: string; alt: string };
};

export function PainCard({ title, pain, ours, image }: Pain) {
  return (
    <article
      tabIndex={0}
      className={cn(
        "group border-border relative min-h-[300px] overflow-hidden rounded-lg border bg-white",
        "shadow-[var(--shadow-card)]",
        "ease-brand transition-[transform,box-shadow] duration-[420ms]",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
        "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2",
      )}
    >
      {/*
        스크림을 깔지 않는다. 일러스트 하단 35%가 비어 있어 글자와 겹치지 않기 때문이다.
        대신 `object-bottom` 이 중요하다 — 카드가 가로로 넓어지는 태블릿(463×300)에서는
        세로로 크게 잘리는데, 기본값(center)이면 **비어 있는 아래쪽이 잘려나가고**
        그림 한가운데가 글자 뒤로 온다. 아래를 기준으로 잘라야 여백이 남는다.
      */}
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={SIZES}
          className="ease-standard object-cover object-bottom transition-transform duration-[520ms] group-hover:scale-105"
        />
      )}

      {/* 차오르는 브랜드 면. 아래에서 위로 덮는다 */}
      <span
        aria-hidden
        className={cn(
          "bg-brand absolute inset-0 translate-y-full",
          "ease-brand transition-transform duration-[420ms]",
          "group-focus-within:translate-y-0 group-hover:translate-y-0",
        )}
      />

      {/*
        아이콘 칩과 우상단 `+` 배지를 걷어냈다(기획서 수정 지시).
        카드 한 장에 일러스트·칩·`+`·이름이 겹쳐 시선이 네 갈래로 갈렸고,
        칩의 아이콘은 뒤 일러스트가 이미 말하고 있는 내용이라 중복이었다.
        이제 접힌 상태에는 **일러스트와 이름** 둘만 남는다.

        `+` 가 사라지면서 "열린다"는 신호도 사라졌다. 그 역할은 격자 아래
        안내문("카드에 커서를 올리면…")이 대신한다 — 카드마다 배지를
        띄우는 것보다 한 번 말하는 편이 조용하다.
      */}
      <div className="relative flex min-h-[300px] flex-col p-6">
        {/* 이름이 주인공 — 접힌 상태에서 카드에 이것만 남는다.
            한때 text-display(최대 58px)로 뒀다가 내렸다. 섹션 제목(text-h1, 42px)보다
            카드 제목이 커져 위계가 뒤집혔고, 두 글자가 카드 폭을 압도했다. */}
        <h3
          className={cn(
            "text-h2 text-ink mt-auto",
            "ease-standard transition-colors duration-[420ms]",
            "group-focus-within:text-white group-hover:text-white",
          )}
        >
          {title}
        </h3>

        {/*
          0fr → 1fr. 터치 기기는 기본값 1fr(펼침)이고,
          hover 가 되는 기기에서만 접었다가 커서·포커스에 반응해 편다.
        */}
        <div
          className={cn(
            "grid grid-rows-[1fr] transition-[grid-template-rows] duration-[420ms]",
            "ease-brand [@media(hover:hover)]:grid-rows-[0fr]",
            "group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]",
          )}
        >
          <div className="overflow-hidden">
            <p
              className={cn(
                "text-body-sm text-text-sub pt-3",
                "ease-standard transition-colors duration-[420ms]",
                "group-focus-within:text-white/75 group-hover:text-white/75",
              )}
            >
              {pain}
            </p>
            <p
              className={cn(
                "text-body-sm text-ink border-border-light mt-3 border-t pt-3",
                "ease-standard transition-colors duration-[420ms]",
                "group-hover:border-white/25 group-hover:text-white",
                "group-focus-within:border-white/25 group-focus-within:text-white",
              )}
            >
              {ours}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
