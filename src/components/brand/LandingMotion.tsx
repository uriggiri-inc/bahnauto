"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 랜딩 브랜드 모션 — MP4 재생판.
 *
 * 스크럽형 `ScrollStory` 를 대체한다. 스크롤 잠금(600vh) 없이 섹션이 화면에
 * 들어오면 자동 재생되고 **마지막 프레임에서 멈춘다**(루프 없음).
 *
 * 원본은 Claude Design 의 `Bahnauto Landing Motion_pc` / `_Shorts` 이고
 * 6씬 23.0초 1회 재생이다:
 *   오프닝 3.2 · 고객응대 3.6 · 재고관리 3.6 · 운영관리 3.6 · 서류관리 3.6 · 피날레 5.4
 *
 * ── 왜 `<source media>` 를 쓰지 않는가 ──
 * `<video>` 안의 `media` 속성은 **최초 선택 시에만** 평가되고 리사이즈·회전에
 * 재평가되지 않는다. 게다가 브라우저별 동작이 갈린다. matchMedia 로 직접
 * 고르면 한 벌만 내려받고 방향 전환에도 대응된다.
 *
 * ── poster 를 두지 않는 이유 ──
 * 두 영상 모두 **첫 프레임이 배경색 단색**이다. 스틸을 뽑으면 12KB 짜리 단색
 * JPEG 이 되는데, 컨테이너에 같은 색을 깔면 0바이트로 같은 결과가 나온다.
 * (실측: `landing-pc.jpg` 12,446B — 전부 #F4F7FD 단색)
 */

/** 1920×1080 · 23.00s · 30fps · h264 · 3.6MB · faststart · 무음 */
const PC_SRC = "/brand/motion/landing-pc.mp4";
/** 1080×1920 · 23.00s · 30fps · h264 · 3.1MB · faststart · 무음 */
const SHORTS_SRC = "/brand/motion/landing-shorts.mp4";

/**
 * 상자 비율은 **CSS 가 정한다**(아래 `md:` 분기). JS 판정값으로 비율을 주면
 * SSR 이 데스크톱 비율로 먼저 그려진 뒤 모바일에서 9:16 으로 튄다 — 즉 CLS 다.
 * JS 는 `src` 하나만 고른다.
 *
 * ⚠️ 이 클래스의 `md`(768px)와 아래 `MOBILE_QUERY` 는 **같은 경계**여야 한다.
 *    어긋나면 9:16 상자에 가로 영상이 들어가 위아래로 크게 남는다.
 */
const FRAME_CLASS =
  "bg-bg-tint relative mx-auto w-full overflow-hidden rounded-[24px] " +
  "aspect-[9/16] max-w-[480px] md:aspect-video md:max-w-[1200px]";

/** md 브레이크포인트(768px)와 맞춘다. 그 아래는 숏츠(세로) */
const MOBILE_QUERY = "(max-width: 767px)";

/** 절반 이상 보이면 재생. 더 낮추면 스크롤로 스쳐 지나갈 때 헛재생된다 */
const PLAY_THRESHOLD = 0.5;

/**
 * 영상 카피의 텍스트 사본 — **MP4 화면에서 그대로 옮긴 것**이다.
 *
 * 영상 안의 글자는 크롤러도 스크린리더도 읽지 못한다. `ScrollStory` 가 DOM 에
 * 두고 있던 텍스트를 잃지 않으려면 사본이 필요하다.
 *
 * ⚠️ **문장을 다듬지 않는다.** 영상이 정본이고 여기는 사본이다. 영상이 개정되면
 *    프레임을 다시 떠서 대조한다(씬 중간값 2.6·5.8·9.4·13.0·16.6·19.5초).
 *
 * 씬6(피날레)은 로고 락업이라 헤드라인이 없다 — 아래 한 줄이 전부다.
 */
const TRANSCRIPT = [
  {
    key: "opening",
    headline: "무인매장은 절반만 자동입니다",
    lead: "결제도 입장도 자동이지만, 나머지 절반은 사람의 일입니다",
  },
  {
    key: "cs",
    headline: "고객센터 응대까지 대신합니다",
    lead: "문의와 민원 접수, 처리 내역까지 기록으로 남습니다",
  },
  {
    key: "stock",
    headline: "재고와 유통기한을 관리합니다",
    lead: "D-day 기준으로 폐기 전에 잡아내고, 발주까지 요청합니다",
  },
  {
    key: "ops",
    headline: "매장 운영을 표준대로 관리합니다",
    lead: "청소 · 점검 · 냉난방까지, 매일 같은 기준으로",
  },
  {
    key: "docs",
    headline: "인허가 서류까지 처리합니다",
    lead: "행정 서류 준비와 제출을 대신합니다",
  },
] as const;

/** 씬6 피날레의 마무리 문장 */
const FINALE_LINE = "자동화되지 않은 나머지 절반, 그 절반을 반오토가 맡습니다";

function MotionTranscript({ visible }: { visible: boolean }) {
  return (
    <div
      className={
        visible ? "container-ba mt-12 flex flex-col items-center gap-10 text-center" : "sr-only"
      }
    >
      {TRANSCRIPT.map((scene) => (
        <div key={scene.key}>
          <h2 className="text-h3 text-ink mx-auto max-w-[22ch]">{scene.headline}</h2>
          <p className="text-body text-text-sub mx-auto mt-4 leading-[1.7]">
            {formatCopy(scene.lead)}
          </p>
        </div>
      ))}
      <p className="text-body-lg text-ink mx-auto font-medium">{FINALE_LINE}</p>
    </div>
  );
}

export function LandingMotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // null = 아직 판정 전(SSR). 이 상태에서는 src 를 걸지 않아 잘못된 파일을
  // 내려받는 일이 없다.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [ended, setEnded] = useState(false);

  // 한 번 끝난 영상은 다시 화면에 들어와도 되감지 않는다
  const endedRef = useRef(false);

  useEffect(() => {
    const size = window.matchMedia(MOBILE_QUERY);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncSize = () => setIsMobile(size.matches);
    const syncMotion = () => setReduced(motion.matches);

    syncSize();
    syncMotion();
    size.addEventListener("change", syncSize);
    motion.addEventListener("change", syncMotion);
    return () => {
      size.removeEventListener("change", syncSize);
      motion.removeEventListener("change", syncMotion);
    };
  }, []);

  // 자동 재생 — 화면에 절반 이상 들어왔을 때. 벗어나면 정지(되감지 않음).
  useEffect(() => {
    const el = sectionRef.current;
    const video = videoRef.current;
    if (!el || !video || reduced || isMobile === null) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !endedRef.current) {
          // 자동재생 차단(저전력 모드 등)은 예외가 아니라 정상 경로다.
          // 포스터가 남고 사용자가 직접 재생할 수 있으면 된다.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: PLAY_THRESHOLD },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced, isMobile]);

  const replay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    endedRef.current = false;
    setEnded(false);
    video.currentTime = 0;
    void video.play().catch(() => {});
  }, []);

  const src = isMobile ? SHORTS_SRC : PC_SRC;

  // 모션 축소 — 영상을 아예 내려받지 않는다. 마지막 장면이 슬로건형 로고
  // 락업이므로 같은 락업의 벡터본을 그 자리에 세운다(3.6MB 대신 SVG).
  if (reduced) {
    return (
      <section ref={sectionRef} aria-label="반오토 브랜드 서사" className="bg-bg-tint section-py">
        <div className="container-ba flex justify-center">
          <Image
            src="/brand/logo-slogan.svg"
            alt="반오토 — 무인매장 위탁 관리 서비스"
            width={320}
            height={120}
            className="h-auto w-[min(78vw,320px)]"
          />
        </div>
        <MotionTranscript visible />
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="반오토 브랜드 서사" className="bg-bg-tint section-py">
      <div className="container-ba">
        {/*
          bg-bg-tint 는 영상 배경(#F4F7FD)과 같은 값이다. 덕분에
          (a) 메타데이터 도착 전 빈 상자가 검게 뜨지 않고
          (b) object-contain 의 레터박스가 보이지 않는다.
        */}
        <div className={FRAME_CLASS}>
          <video
            ref={videoRef}
            // isMobile 판정 전에는 src 를 비워 둔다 — 두 벌 다 받는 일을 막는다
            src={isMobile === null ? undefined : src}
            muted
            playsInline
            preload="metadata"
            // 루프 금지(프로젝트 규칙). 마지막 프레임에서 그대로 멈춘다
            onEnded={() => {
              endedRef.current = true;
              setEnded(true);
            }}
            // contain — 상자 비율이 어긋나도 브랜드 요소를 잘라내지 않는다
            className="h-full w-full object-contain"
          />

          {ended && (
            <button
              type="button"
              onClick={replay}
              className="text-caption text-ink/80 hover:text-brand absolute right-4 bottom-4 rounded-[10px] bg-white/85 px-3 py-2 backdrop-blur-sm transition-colors"
            >
              다시 보기
            </button>
          )}
        </div>
      </div>

      {/* 영상 안의 글자는 크롤러·스크린리더가 읽지 못한다 */}
      <MotionTranscript visible={false} />
    </section>
  );
}
