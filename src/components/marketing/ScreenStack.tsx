import Image from "next/image";
import { RingMark } from "@/components/brand/RingMark";
import { ZoomableImage } from "@/components/marketing/ZoomableImage";
import { cn } from "@/lib/cn";

/**
 * PC 화면과 모바일 화면을 **한 장으로** 보여주는 합성 비주얼 (겹치거나 나란히).
 *
 * ── 왜 틀이 없나 ──
 * 이전에는 `AppScreen` 이 정해진 화면비의 **틀**(아이폰 베젤·카드)에 캡처를 끼워
 * 넣었다. 그런데 실제로 받은 캡처가 PC 2000×1093, 모바일 756×1466 로 그 화면비와
 * 어긋나 `object-cover` 가 하단 탭바 양끝을 잘라냈다. 틀에 맞춰 다시 찍는 것보다
 * 틀을 없애는 쪽이 맞다고 판단해(사용자 확정 2026-08-25) `AppScreen` 은 삭제했다.
 *
 * `width`/`height` 를 그대로 받아 `h-auto w-full` 로 그리므로 원본 비율이 유지되고
 * **한 픽셀도 잘리지 않는다.** 어떤 해상도의 캡처가 와도 그대로 들어간다.
 *
 * ── 배치 두 가지 (`layout`) ──
 * `overlap` — 모바일이 PC 위로 겹친다. 밀도가 높고 시선이 한 덩어리로 모인다.
 *             대신 PC 왼쪽 일부(사이드바)가 가려진다.
 * `side`    — 나란히 둔다. **둘 다 온전히 보인다.** 사이드바까지 보여줘야 할 때,
 *             또는 화면이 좁아 겹치면 답답할 때 쓴다.
 *
 * 둘 다 잘리지는 않는다 — 차이는 **가려지는지** 여부다.
 *
 * ── 쓰는 자리 ──
 * "PC 와 모바일에서 이렇게 본다" 를 한 장으로 말하는 자리다 — 홈 섹션 도입부,
 * `/system` 히어로처럼 **분위기와 규모**를 전하는 곳.
 *
 * 반대로 `/features/[key]` 의 "실제 화면" 은 기능이 무엇인지 **읽혀야** 하므로
 * 겹치지 않는 `ScreenShot` 을 쓴다 — 겹쳐 놓으면 가려지는 부분이 생긴다.
 *
 * ── 넣지 않은 것 ──
 * 참고한 경쟁사 비주얼에는 `이번 달 인건비 18% 절감` 같은 **성과 배지**가 붙어
 * 있었다. 그런 수치는 근거 없이 쓰면 표시광고법 위반이다(상위 `CLAUDE.md` §5).
 * 검증된 값이 확정되면 그때 붙인다 — 지금은 자리도 만들지 않는다.
 */

export type Shot = {
  /** 마스킹 완료된 실제 캡처. 없으면 자리표시자가 뜬다 */
  src?: string;
  alt: string;
  /** 캡처의 실제 픽셀 크기. 비율 유지에 쓰이므로 반드시 원본 값을 넣는다 */
  width: number;
  height: number;
};

export type ScreenStackProps = {
  pc: Shot;
  mobile: Shot;
  /**
   * 배치. 기본은 겹침.
   * `side` 는 나란히 두어 PC 사이드바까지 가려지지 않게 한다.
   */
  layout?: "overlap" | "side";
  /** 배경이 어두운 섹션 위에 놓일 때 true — 테두리·그림자를 반전한다 */
  onDark?: boolean;
  /** 히어로처럼 LCP 후보인 곳에서만 true */
  priority?: boolean;
  className?: string;
};

/** 캡처가 없을 때 — 그럴듯한 가짜 UI 대신 자리표시자임을 드러낸다 */
function Pending({ alt, ratio, small }: { alt: string; ratio: string; small?: boolean }) {
  return (
    <div
      className="bg-bg-subtle flex flex-col items-center justify-center gap-2 px-4 text-center"
      style={{ aspectRatio: ratio }}
    >
      <RingMark size={small ? 32 : 56} animate={false} />
      {!small && <p className="text-body-sm text-text-sub">{alt}</p>}
      <p className="text-caption text-warning">[실제 앱 캡처 대기 · §13-C6]</p>
    </div>
  );
}

export function ScreenStack({
  pc,
  mobile,
  layout = "overlap",
  onDark = false,
  priority = false,
  className,
}: ScreenStackProps) {
  /* 테두리·링은 배경 밝기에 따라 갈린다 — 두 배치가 함께 쓴다 */
  const edge = onDark ? "ring-1 ring-white/12" : "border-border border";
  const edgeStrong = onDark ? "ring-1 ring-white/16" : "border-border border";

  if (layout === "side") {
    return (
      <figure className={cn("w-full", className)}>
        {/*
          좁은 화면에서는 세로로 쌓는다 — 나란히 두면 둘 다 너무 작아진다.
          `items-end` 로 아래를 맞춘다. 높이가 조금 달라도 바닥이 정렬돼 안정적이다.
        */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-8">
          <div
            className={cn(
              "min-w-0 flex-1 overflow-hidden rounded-xl shadow-[var(--shadow-float)]",
              edge,
            )}
          >
            {pc.src ? (
              <Image
                src={pc.src}
                alt={pc.alt}
                width={pc.width}
                height={pc.height}
                priority={priority}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 940px"
                className="h-auto w-full"
              />
            ) : (
              <Pending alt={pc.alt} ratio={`${pc.width} / ${pc.height}`} />
            )}
          </div>

          <div
            className={cn(
              "w-[52%] max-w-[200px] shrink-0 overflow-hidden rounded-lg shadow-[var(--shadow-float)] sm:w-[22%]",
              edgeStrong,
            )}
          >
            {mobile.src ? (
              <Image
                src={mobile.src}
                alt={mobile.alt}
                width={mobile.width}
                height={mobile.height}
                sizes="(max-width: 640px) 52vw, 200px"
                className="h-auto w-full"
              />
            ) : (
              <Pending alt={mobile.alt} ratio={`${mobile.width} / ${mobile.height}`} small />
            )}
          </div>
        </div>
      </figure>
    );
  }

  return (
    <figure className={cn("relative", className)}>
      {/*
        PC 화면 — 오른쪽으로 밀어 왼쪽 아래에 모바일이 앉을 자리를 만든다.
        `w-[86%]` 는 겹침 정도이고, 화면비는 이미지가 스스로 정한다.
      */}
      <div
        className={cn(
          "ml-auto w-[86%] overflow-hidden rounded-xl shadow-[var(--shadow-float)]",
          edge,
        )}
      >
        {pc.src ? (
          <Image
            src={pc.src}
            alt={pc.alt}
            width={pc.width}
            height={pc.height}
            priority={priority}
            /* 표시 폭은 컨테이너의 86%. container-ba 최대 1328px 기준 */
            sizes="(max-width: 1024px) 86vw, 1142px"
            /* `h-auto` 가 핵심 — 이게 없으면 비율이 깨진다 */
            className="h-auto w-full"
          />
        ) : (
          <Pending alt={pc.alt} ratio={`${pc.width} / ${pc.height}`} />
        )}
      </div>

      {/*
        모바일 화면 — PC 위에 겹친다.
        `w-[24%]` 에 `max-w-[168px]`: 화면이 넓어져도 폰이 과하게 커지지 않게 막는다.
        좁은 화면에서는 겹침을 줄여(왼쪽 0) 폰이 PC 를 다 덮지 않게 한다.
      */}
      <div
        className={cn(
          "absolute bottom-0 left-0 w-[24%] max-w-[168px] overflow-hidden rounded-lg",
          "shadow-[var(--shadow-float)]",
          edgeStrong,
        )}
      >
        {mobile.src ? (
          <Image
            src={mobile.src}
            alt={mobile.alt}
            width={mobile.width}
            height={mobile.height}
            sizes="(max-width: 1024px) 24vw, 168px"
            className="h-auto w-full"
          />
        ) : (
          <Pending alt={mobile.alt} ratio={`${mobile.width} / ${mobile.height}`} small />
        )}
      </div>
    </figure>
  );
}

/**
 * 화면 **한 장**을 틀 없이 넣는다.
 *
 * `ScreenStack` 이 PC·모바일 한 쌍을 다루는 것과 달리, 짝이 없거나 한 장으로 충분한
 * 자리에 쓴다(`/system` 지그재그 섹션 등).
 *
 * 틀을 쓰지 않는 이유는 위와 같다 — 화면비를 강제하면 비율이 다른 캡처가 잘린다.
 * 여기서는 `width`/`height` 로 원본 비율을 유지한다.
 *
 * 모바일 캡처는 세로로 길어 그대로 넣으면 섹션이 과하게 늘어난다. 그래서 호출부가
 * `className` 으로 폭을 제한한다(`max-w-[300px]` 등).
 */
export function ScreenShot({
  shot,
  caption,
  onDark = false,
  priority = false,
  sizes,
  className,
  zoomable = false,
}: {
  shot: Shot;
  caption?: string;
  onDark?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /**
   * 눌러서 크게 볼 수 있게 한다(사용자 지시 2026-08-26).
   *
   * 기본값이 `false` 인 이유: 이 컴포넌트는 `/system` 지그재그처럼 **분위기를
   * 전하는 자리**에도 쓰인다. 그런 곳에 확대 버튼이 붙으면 읽을 것이 있다는
   * 신호를 잘못 준다. 글자를 읽어야 하는 자리에서만 켠다.
   */
  zoomable?: boolean;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-xl shadow-[var(--shadow-float)]",
          onDark ? "ring-1 ring-white/12" : "border-border border",
        )}
      >
        {shot.src ? (
          zoomable ? (
            <ZoomableImage
              shot={shot}
              label={caption}
              sizes={sizes ?? "(max-width: 640px) 92vw, 420px"}
              priority={priority}
              imgClassName="h-auto w-full"
            />
          ) : (
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              priority={priority}
              sizes={sizes ?? "(max-width: 640px) 92vw, 420px"}
              className="h-auto w-full"
            />
          )
        ) : (
          <Pending alt={shot.alt} ratio={`${shot.width} / ${shot.height}`} />
        )}
      </div>
      {caption && (
        <figcaption className="text-body-sm text-text-sub mt-3 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}
