"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ZoomableImage } from "@/components/marketing/ZoomableImage";
import type { Shot } from "@/components/marketing/ScreenStack";

/**
 * 앱 화면 슬라이드 — 한 주제의 **PC·모바일을 한 장면에 묶어** 보여주고, 좌우로
 * 넘기거나 자동으로 넘어간다 (사용자 지시 2026-08-26).
 *
 * ── 왜 캐러셀인가 ──
 * 기능 하나에 화면이 4~5개씩 들어오면 나란히 늘어놓을 자리가 없다. 게다가 같은
 * 기능의 PC 화면과 모바일 화면은 **한 쌍으로 읽혀야** 한다 — 떼어 놓으면 서로
 * 다른 기능처럼 보인다. 그래서 "주제 하나 = 슬라이드 하나" 로 묶고, 그 안에
 * PC·모바일을 함께 놓는다.
 *
 * ── 자동 넘김은 무한 루프 예외다 ──
 * `CLAUDE.md` §7 은 무한 루프를 금지하고, 예외에는 **안전장치 2종을 반드시** 함께
 * 붙이도록 한다. 여기서는
 *   ① 사용자 개입 시 정지 — hover · 키보드 포커스 · 터치 · 버튼 조작
 *   ② 모션 축소(`prefers-reduced-motion: reduce`) 시 **완전 정지** — 자동 넘김을
 *      아예 시작하지 않는다. 좌우 버튼과 탭으로만 넘긴다
 * 추가로 뷰포트를 벗어나면 멈춘다 — 화면에 없는 것이 계속 돌 이유가 없다.
 *
 * ── 높이를 고정하는 이유 ──
 * 1.5초마다 바뀌는데 슬라이드마다 높이가 다르면 페이지가 위아래로 튄다. 그래서
 * 줄 높이를 breakpoint 별로 **고정**하고, 이미지는 `max-h`/`max-w` 로만 줄인다.
 * 화면비를 건드리지 않으므로 어떤 캡처가 와도 잘리지 않는다.
 *
 * ── 좁은 화면은 **한 장씩** 넘긴다 (사용자 지시 2026-08-27) ──
 * 그 전에는 섞인 슬라이드를 세로로 쌓았다. 그 결과 폰에서 줄 높이가 430px 이 되고
 * PC 캡처는 폭의 절반, 폰 캡처는 세로 270px 로 **둘 다 못 읽는** 화면이 됐다.
 *
 * 지금은 `md`(768px) 미만에서 **같은 자리에 한 장만** 그리고, 이미지 양옆에 얹은
 * 버튼으로 넘긴다. 한 장이 줄을 독차지하므로 폰 캡처가 270 → 380px 으로 커진다.
 *
 * 넘기는 **단위가 폭에 따라 다르다**:
 *   · 넓은 화면 — 한 슬라이드의 장을 모두 나란히 보므로 **슬라이드** 단위
 *   · 좁은 화면 — 한 장만 보므로 **장** 단위. 슬라이드의 마지막 장에서 한 번 더
 *     누르면 다음 슬라이드 첫 장으로 이어진다
 * 그래서 좁은 화면에서는 아래 조작 줄의 화살표를 숨긴다 — 같은 모양의 버튼 두 쌍이
 * 서로 다른 단위로 움직이면 어느 것이 무엇인지 알 수 없다. 주제 탭은 그대로 둔다.
 *
 * ── 담당자가 보내 준 `card-fan-carousel` 예시를 그대로 쓰지 않은 이유 ──
 * 부채꼴로 펼쳐진 카드 더미를 GSAP 로 움직이는 컴포넌트였다. 넷 때문에 맞지 않았다.
 *
 *   1. **`object-cover` 로 이미지를 자른다.** 카드 더미는 카드 크기가 모두 같아야
 *      성립하는데 우리 캡처는 `2000×1093`(PC)과 `756×1466`(폰)이 섞여 있다. 자르면
 *      하단 탭바·표 끝이 날아가고, 그건 2026-08-25 에 아이폰 베젤 틀을 걷어낸
 *      이유와 똑같은 문제다. **읽으라고 넣은 캡처를 잘라서는 안 된다.**
 *   2. **`gsap` 이 새 의존성이다.** 이 저장소는 이미 `motion` 을 쓴다. 애니메이션
 *      라이브러리를 둘 들이면 번들이 늘고, 모션 축소 대응도 두 곳에서 해야 한다.
 *   3. **`dark:` 변형이 이 저장소에서 안 듣는다.** 다크 모드는
 *      `:root[data-theme="dark"]` 로 켜지므로 Tailwind 기본 `dark:`(운영체제 설정)와
 *      어긋난다. 예시의 색 지정을 그대로 옮기면 다크 모드에서 색이 갈라진다.
 *   4. 예시 코드가 참조하는 `.fan-card` · `.fan-layout` **CSS 가 함께 오지 않았다.**
 *      카드 크기와 `position` 이 그 CSS 에 있어서, 그대로 붙이면 카드가 크기 없이
 *      흐름대로 쌓인다.
 *
 * 대신 **버튼 모양(동그란 면·얇은 테두리·배경 블러·안쪽 링)과 장 위치 점**을
 * 가져왔다. 회전·확대·자르기 없이도 "겹쳐 두고 좌우로 넘긴다" 는 요청은 충족된다.
 */

export type CarouselShot = {
  shot: Shot;
  /**
   * **폭·높이 계산용** 구분이다. `pc` 는 가로로 넓은 캡처, `mobile` 은 세로로 긴
   * 캡처. 실제 기기 이름과 어긋나는 경우가 있다 — PC 화면에 뜨는 채널톡 위젯은
   * 세로로 길어 `mobile` 로 계산해야 배치가 맞다. 그럴 때 배지 문구는 `badge` 로
   * 따로 준다.
   */
  kind: "pc" | "mobile";
  /** 배지에 쓸 문구. 없으면 `kind` 에서 만든다 */
  badge?: string;
  /** 이 한 장이 무엇을 보여주는지. 설명 줄에 붙는다 */
  note: string;
};

export type CarouselSlide = {
  id: string;
  /** 주제 이름 — 탭에 그대로 나온다 */
  title: string;
  /**
   * 이 주제가 무엇인지. **줄 단위로 직접 적는다**(사용자 지시 2026-08-27).
   *
   * 왜 배열인가: `formatCopy` 는 마침표에서만 끊으므로
   * 「재고 화면에서 그대로 발주로 넘어가고,」처럼 **쉼표나 화살표 뒤에서 끊고 싶은
   * 자리**를 표현할 수 없다. 어디서 숨을 쉬게 할지는 카피를 쓰는 사람이 정하는
   * 것이므로 줄을 그대로 받는다.
   *
   * 한 줄 안에서 `**…**` 로 감싼 부분은 굵게 나온다.
   */
  desc: readonly string[];
  shots: readonly CarouselShot[];
};

/**
 * 한 줄 안의 `**…**` 를 굵게 바꾼다.
 *
 * 왜 이런 표기인가: 카피는 `.ts` 파일에 있어 JSX 를 넣을 수 없다. 강조할 자리를
 * 카피 옆에 두어야 나중에 문구를 고칠 때 강조 범위도 같이 눈에 들어온다.
 *
 * `<strong>` 을 쓴다 — 헤드라인용 `Mark` 와 달리 본문에서 실제로 중요한 구절을
 * 가리키는 자리다(`Mark` 는 페이지당 하나라는 규칙이 있어 여기 쓰면 안 된다).
 */
function emphasize(line: string) {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  /* split 결과는 [보통, 강조, 보통, 강조, …] 순서다 */
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-ink font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/** 사용자가 정한 간격 (2026-08-26) */
const INTERVAL_MS = 1500;
/** 조작 후 이만큼 조용하면 자동 넘김을 다시 켠다 — 터치는 hover 해제가 없다 */
const RESUME_MS = 4000;

/*
  크기 상한이 **두 군데로 나뉘어** 있다. 이유가 있다.

  폭(`max-w`)은 **감싸는 칸**에 준다. 퍼센트는 담는 상자의 폭을 기준으로 계산되는데,
  이미지에 직접 주면 그 상자가 곧 이미지 폭이라 순환이 되어 0 으로 수렴한다
  (실제로 모바일 캡처가 43px 로 찌그러졌다).

  높이(`max-h`)는 **이미지**에 픽셀로 준다. 퍼센트 높이는 부모 높이가 확정돼 있어야
  먹는데 칸의 높이는 내용에 따라 정해지므로 무효가 된다.

  둘 다 상한일 뿐이라 화면비는 그대로다 — 어떤 캡처가 와도 잘리지 않는다.
*/
/** 감싸는 칸의 폭 상한 — 한 줄에 함께 서는 장수를 고려한 값이다 */
function wrapClasses(kind: "pc" | "mobile", alone: boolean) {
  if (alone) return "max-w-full";
  if (kind === "mobile") return "max-w-[46%] sm:max-w-[38%] md:max-w-[26%]";
  return "max-w-full md:max-w-[66%]";
}
/** 이미지의 높이 상한 */
function imgClasses(kind: "pc" | "mobile", alone: boolean) {
  if (kind === "mobile") return "max-h-[270px] lg:max-h-[320px]";
  if (alone) return "max-h-[200px] sm:max-h-[260px] md:max-h-[280px] lg:max-h-[320px]";
  return "max-h-[150px] md:max-h-[215px] lg:max-h-[280px]";
}
/**
 * 좁은 화면에서 **한 장만** 보일 때의 높이 상한 (사용자 지시 2026-08-27).
 *
 * 위 `imgClasses` 의 값보다 크다. 한 장이 줄을 독차지하므로 옆에 설 것을 배려할
 * 필요가 없다 — 폰 캡처는 270 → 380px 으로 커지고, PC 캡처는 어차피 폭(92vw)이
 * 먼저 걸려 높이 상한에 닿지 않는다. 그래서 방향에 따라 나누지 않는다.
 *
 * 줄 높이(`SOLO_ROW`)와 같은 값이라 이미지가 줄을 꽉 채운다.
 */
const SOLO_IMG = "max-h-[380px]";
/** 한 장만 보이는 줄의 고정 높이. 슬라이드마다 달라지면 그게 곧 페이지가 튀는 것이다 */
const SOLO_ROW = "h-[380px]";

/**
 * 이미지 양옆에 얹히는 넘김 버튼 (사용자 지시 2026-08-27).
 *
 * ── 참고한 것과 쓰지 않은 것 ──
 * 담당자가 보내 준 `card-fan-carousel`(GSAP 부채꼴 카드) 예시에서 **버튼 모양만**
 * 가져왔다: 동그란 면 · 얇은 테두리 · 배경 블러 · 안쪽에 한 겹 더 있는 링
 * (`before:inset-[3px]`). 그 예시의 나머지는 이 자리에 맞지 않아 쓰지 않았다 —
 * 이유는 파일 머리 주석에 적어 두었다.
 *
 * 색은 예시의 `dark:` 변형을 그대로 쓰지 않았다. 이 저장소의 다크 모드는
 * `:root[data-theme="dark"]` 로 켜지므로 Tailwind 기본 `dark:`(운영체제 설정)와
 * 어긋난다. 대신 토큰(`--color-border`·`--color-text-sub`)을 쓰면 두 모드가
 * 자동으로 따라온다.
 *
 * 이미지 위에 얹히므로 반투명 흰 면 + 테두리로 배경과 분리한다. 투명하게 두면
 * 밝은 캡처 위에서 화살표가 사라진다.
 */
function ArrowButton({
  side,
  onClick,
  bump,
}: {
  side: "left" | "right";
  onClick: () => void;
  /** 조작이 있었음을 캐러셀에 알린다 — 자동 넘김이 잠시 멈춘다 */
  bump: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "이전 화면" : "다음 화면"}
      onClick={() => {
        onClick();
        bump();
      }}
      className={cn(
        "border-border/80 text-text-sub absolute top-1/2 z-10 flex size-10 -translate-y-1/2",
        "items-center justify-center rounded-full border-[1.5px] bg-white/85 backdrop-blur-[10px]",
        "shadow-[var(--shadow-card)]",
        "ease-standard transition-colors duration-[160ms]",
        "hover:border-brand hover:text-brand active:opacity-70",
        /* 안쪽 링 한 겹 — 예시 컴포넌트의 `before:inset-[3px]` 을 그대로 옮겼다 */
        "before:border-border/40 before:pointer-events-none before:absolute before:inset-[3px] before:rounded-full before:border before:content-['']",
        side === "left" ? "left-0" : "right-0",
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="relative z-[2]"
      >
        <path d={side === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}

export function ScreenCarousel({
  slides,
  className,
}: {
  slides: readonly CarouselSlide[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  /**
   * 좁은 화면에서 지금 보고 있는 **슬라이드 안의 몇 번째 장**인가
   * (사용자 지시 2026-08-27). 넓은 화면에서는 한 슬라이드의 장을 모두 나란히
   * 보여주므로 쓰이지 않는다.
   */
  const [shotIdx, setShotIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [recent, setRecent] = useState(false);
  const [inView, setInView] = useState(false);
  /* 확대 창이 열린 동안에는 넘기지 않는다 — 닫았을 때 다른 장면이면 혼란스럽다 */
  const [zoomOpen, setZoomOpen] = useState(false);
  /* 기본값을 "축소" 로 둔다 — 확인 전에 움직이기 시작하지 않는다 */
  const [reduceMotion, setReduceMotion] = useState(true);
  /**
   * 좁은 화면인가 (`md` 미만 = Tailwind 의 `md:` 분기와 같은 767px).
   *
   * 기본값을 `false`(넓은 화면)로 두는 이유: 서버 렌더 HTML 이 넓은 화면 배치로
   * 나가고 좁은 기기에서 마운트 직후 한 번 바뀐다. `reduceMotion` 과 같은 방식이다.
   * 반대로 두면 데스크톱에서 첫 프레임이 한 장짜리로 그려져 더 눈에 띈다.
   */
  const [narrow, setNarrow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<number | null>(null);

  const count = slides.length;
  /* 슬라이드를 옮기면 그 슬라이드의 첫 장부터 본다 */
  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      setShotIdx(0);
    },
    [count],
  );

  /* 조작이 있었음을 표시하고, 조용해지면 자동 넘김을 되살린다 */
  const bump = useCallback(() => {
    setRecent(true);
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setRecent(false), RESUME_MS);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /*
    폭을 CSS 로만 나눌 수 없는 이유: 좁은 화면은 **DOM 에 한 장만** 그린다.
    CSS 로 숨기는 방식이면 안 보이는 이미지까지 받아 오고, 자동 넘김이 세는 단위도
    화면 폭에 따라 달라져야 하므로 JS 가 폭을 알아야 한다.
    `767px` 은 Tailwind `md`(768px) 바로 아래다 — 아래 `md:` 분기와 경계를 맞춘다.
  */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /*
    ── 화면에 들어오면 나머지 슬라이드의 이미지를 미리 받아 둔다 (2026-08-27) ──
    지금 보이는 슬라이드만 DOM 에 있어서, 넘어간 뒤에야 그 이미지를 받기 시작한다.
    1.5초마다 넘어가는데 그 사이에 다 받지 못하면 **빈 자리가 먼저 보인다** —
    슬라이드가 일곱인 운영 대시보드에서 실제로 그랬다.

    `new Image()` 로 브라우저 캐시만 채운다. DOM 에 넣지 않으므로 배치에 영향이
    없고, 정적 배포는 `images.unoptimized` 라 `<Image>` 가 같은 주소를 그대로
    쓰기 때문에 그때 다시 받지 않는다. (`next dev` 는 `/_next/image` 로 주소를
    바꾸므로 개발 화면에서는 이 예열이 듣지 않는다 — 확인은 빌드 산출물로 한다.)

    화면 밖에서는 시작하지 않는다. 페이지에 캐러셀이 여럿이면 열자마자 수십 장을
    한꺼번에 받아 첫 화면이 늦어진다.
  */
  const warmed = useRef(false);
  useEffect(() => {
    if (!inView || warmed.current) return;
    warmed.current = true;
    for (const s of slides) {
      for (const shot of s.shots) {
        if (!shot.shot.src) continue;
        const img = new window.Image();
        img.src = shot.shot.src;
      }
    }
  }, [inView, slides]);

  /*
    ── 넘기는 단위가 화면 폭에 따라 다르다 (사용자 지시 2026-08-27) ──
    넓은 화면: 한 슬라이드의 장을 모두 나란히 보여주므로 **슬라이드** 단위로 넘긴다.
    좁은 화면: 한 장만 보여주므로 **장** 단위로 넘기고, 그 슬라이드의 마지막 장에서
              한 번 더 누르면 다음 슬라이드의 첫 장으로 이어진다.

    한 방향으로 계속 누르면 전체 장을 처음부터 끝까지 훑고 다시 처음으로 돌아온다.
  */
  const shotCount = slides[index].shots.length;
  /** 캐러셀 전체 장수 — 좁은 화면에서 "넘길 것이 있는가" 의 기준 */
  const total = slides.reduce((n, s) => n + s.shots.length, 0);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!narrow) {
        go(index + dir);
        return;
      }
      const next = shotIdx + dir;
      if (next >= 0 && next < shotCount) {
        setShotIdx(next);
        return;
      }
      const nextIndex = (((index + dir) % count) + count) % count;
      setIndex(nextIndex);
      /* 뒤로 갈 때는 이전 슬라이드의 **마지막** 장으로 — 앞으로 갈 때는 첫 장으로 */
      setShotIdx(dir === 1 ? 0 : slides[nextIndex].shots.length - 1);
    },
    [narrow, go, index, shotIdx, shotCount, count, slides],
  );

  const paused =
    hover || recent || zoomOpen || !inView || reduceMotion || (narrow ? total < 2 : count < 2);

  /*
    `setInterval` 대신 매번 새 `setTimeout` 을 건다. 자동 넘김이 세는 단위가
    좁은 화면에서 "장" 이라 `step` 이 현재 위치(index·shotIdx)를 알아야 하는데,
    그 값이 바뀔 때마다 콜백도 새로 만들어져야 하기 때문이다. 결과는 1.5초 간격의
    연쇄 타임아웃으로 `setInterval` 과 같다.
  */
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => step(1), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [paused, step]);

  useEffect(
    () => () => {
      if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    },
    [],
  );

  const slide = slides[index];
  const kinds = new Set(slide.shots.map((s) => s.kind));
  /* PC 와 폰이 섞인 슬라이드만 좁은 화면에서 세로로 쌓는다 */
  const mixed = kinds.size > 1;
  const alone = slide.shots.length === 1;
  /* 줄 높이는 캐러셀 전체에서 하나여야 한다 — 슬라이드마다 다르면 그게 곧 튀는 것이다 */
  const anyMixed = slides.some((s) => new Set(s.shots.map((x) => x.kind)).size > 1);

  /*
    슬라이드가 바뀌는 순간 `shotIdx` 가 새 슬라이드의 장수를 넘을 수 있다
    (장이 셋인 슬라이드의 3번째를 보다가 탭으로 장이 하나인 슬라이드로 가는 경우).
    상태를 고치는 대신 읽을 때 자른다 — 렌더 중에 상태를 바꾸면 한 프레임이 어긋난다.
  */
  const safeShot = Math.min(shotIdx, slide.shots.length - 1);
  /** 좁은 화면은 한 장만, 넓은 화면은 그 슬라이드의 전부 */
  const shownShots = narrow ? [slide.shots[safeShot]] : slide.shots;

  return (
    <div
      ref={rootRef}
      className={cn("w-full", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
      onTouchStart={bump}
    >
      {/* ── 화면 ── */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-center gap-3 md:items-end md:gap-5",
            /* 좁은 화면에서 한 장만 그릴 때는 쌓을 것이 없다 */
            !narrow && mixed ? "flex-col md:flex-row" : "flex-row",
            narrow
              ? SOLO_ROW
              : anyMixed
                ? "h-[430px] md:h-[300px] lg:h-[340px]"
                : "h-[210px] md:h-[300px] lg:h-[340px]",
          )}
        >
          {shownShots.map((s) => (
            <div
              key={s.shot.src ?? s.note}
              className={cn(
                "flex min-w-0 justify-center",
                narrow ? "max-w-full" : wrapClasses(s.kind, alone),
              )}
            >
              <ZoomableImage
                shot={s.shot}
                label={s.badge ?? (s.kind === "pc" ? "PC" : "모바일")}
                onOpenChange={setZoomOpen}
                sizes={
                  s.kind === "pc"
                    ? "(max-width: 768px) 92vw, 660px"
                    : "(max-width: 768px) 70vw, 180px"
                }
                imgClassName={cn(
                  "border-border h-auto w-auto max-w-full rounded-xl border shadow-[var(--shadow-float)]",
                  narrow ? SOLO_IMG : imgClasses(s.kind, alone),
                )}
              />
            </div>
          ))}
        </div>

        {/*
          ── 좁은 화면 전용 좌우 버튼 (사용자 지시 2026-08-27) ──
          이미지 **양옆에** 얹는다. 아래 조작 줄의 화살표는 좁은 화면에서 숨기므로
          (넘기는 단위가 달라 두 개가 함께 있으면 헷갈린다) 여기가 유일한 조작이다.

          `md:hidden` — 넓은 화면에서는 장을 모두 나란히 보여주므로 넘길 것이 없다.
          이미지 위에 얹히기 때문에 흰 면과 테두리로 배경과 분리한다.
        */}
        {narrow && total > 1 && (
          <>
            <ArrowButton side="left" onClick={() => step(-1)} bump={bump} />
            <ArrowButton side="right" onClick={() => step(1)} bump={bump} />
          </>
        )}
      </div>

      {/* ── 설명 ── 지금 무엇을 보고 있는지 글로도 남긴다 */}
      <div className="mt-4 text-center">
        <p className="text-h4 text-ink">{slide.title}</p>
        {/*
          `formatCopy` — 문장 끝에서 줄을 나눈다. 그대로 흘리면 「매니저가 매장에서 /
          확인하고」처럼 한 문장이 줄 끝에서 갈라져 두 문장이 뒤섞여 읽힌다.
        */}
        <div className="text-body-sm text-text-sub mx-auto mt-1.5 max-w-[62ch]">
          {slide.desc.map((line) => (
            <p key={line}>{emphasize(line)}</p>
          ))}
        </div>
        {/*
          좁은 화면에서는 **보이는 장의 설명만** 남긴다. 한 장만 그리는데 설명이
          둘이면 어느 것이 지금 화면인지 알 수 없다.
        */}
        <ul className="text-caption text-text-sub mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {shownShots.map((s) => (
            <li key={s.note}>
              <b className="text-ink font-semibold">
                {s.badge ?? (s.kind === "pc" ? "PC" : "모바일")}
              </b>{" "}
              · {s.note}
            </li>
          ))}
        </ul>

        {/*
          ── 장 위치 점 (좁은 화면 전용) ──
          담당자 예시 컴포넌트의 점 표시를 가져왔다. 좌우 버튼만 있으면 **몇 장 중
          몇 번째인지** 알 수 없어 언제까지 눌러야 하는지 모른다. 색만으로 말하지
          않도록 현재 점은 크기도 함께 키운다(`CLAUDE.md` §4).

          슬라이드 안의 장만 센다 — 전체 장(운영 대시보드는 14장)을 다 찍으면
          점이 줄을 넘어간다. 슬라이드 이동은 아래 탭이 맡는다.
        */}
        {narrow && slide.shots.length > 1 && (
          <ul aria-hidden className="mt-3 flex items-center justify-center gap-1.5">
            {slide.shots.map((s, i) => (
              <li
                key={s.shot.src ?? s.note}
                className={cn(
                  "ease-standard rounded-full transition-all duration-[var(--dur-tab)]",
                  i === safeShot ? "bg-brand size-2" : "bg-border size-1.5",
                )}
              />
            ))}
          </ul>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="이전 화면"
            onClick={() => {
              go(index - 1);
              bump();
            }}
            className="border-border text-text-sub hover:border-brand hover:text-brand ease-standard flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-[160ms] max-md:hidden sm:size-9"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/*
            주제 이름을 그대로 노출한다 — 점만 있으면 무엇으로 넘어가는지 모른다.

            **가로 스크롤을 쓰지 않는다**(사용자 지시 2026-08-26). 스크롤로 두면 좁은
            화면에서 마지막 버튼이 잘리고 밑에 스크롤바가 따라 움직인다. 대신 버튼이
            **줄어들 수 있게** 두고(`min-w-0` · `shrink`) 좁아지면 이름이 두 줄로
            감싸이게 한다("재고 현황" → "재고 / 현황"). 네 개가 항상 한 화면에 들어온다.

            ── 다섯 개 이상이면 줄을 감싼다 (2026-08-27) ──
            기능 7종 재편으로 ① 운영 대시보드가 슬라이드 일곱을 갖게 됐다. 폭을
            똑같이 나누면 좁은 화면에서 한 칸이 30px 남아 이름이 **석 줄**로
            부서진다. 그래서 다섯 개부터는 칸을 균등 분할하지 않고 이름 길이대로
            두고 넘치는 것만 아래 줄로 내린다 — 버튼은 여전히 **전부 한 화면에**
            보이고 스크롤바도 생기지 않는다.
          */}
          <ol
            className={cn(
              "flex min-w-0 flex-1 justify-center gap-1 sm:gap-1.5",
              count > 4 && "flex-wrap gap-y-1.5",
            )}
          >
            {slides.map((s, i) => (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => {
                    go(i);
                    bump();
                  }}
                  className={cn(
                    /* 좁은 화면에서는 이름이 두 줄로 감싸인다("재고 현황" → "재고 / 현황").
                       그때 기본 줄 간격은 두 낱말이 떨어져 보이므로 `leading` 을 조인다
                       (사용자 지시 2026-08-26). 넓은 화면에서는 한 줄이라 영향이 없다. */
                    "text-caption ease-standard w-full rounded-full border px-2 py-1.5 text-center leading-[1.1] transition-colors duration-[160ms] sm:px-3",
                    i === index
                      ? "border-brand bg-brand font-semibold text-white"
                      : "border-border text-text-sub hover:text-brand",
                  )}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ol>

          <button
            type="button"
            aria-label="다음 화면"
            onClick={() => {
              go(index + 1);
              bump();
            }}
            className="border-border text-text-sub hover:border-brand hover:text-brand ease-standard flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-[160ms] max-md:hidden sm:size-9"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
