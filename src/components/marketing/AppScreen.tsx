import Image from "next/image";
import { RingMark } from "@/components/brand/RingMark";
import { cn } from "@/lib/cn";

/**
 * 앱 실화면 프레임.
 *
 * PRD §7.1 AC: 이 자리에 들어가는 이미지는 스톡·가상 목업이 아니라
 * **실제 반오토 앱 캡처**여야 하고, 매장명·연락처는 마스킹 처리한다.
 *
 * 그래서 `src` 가 없을 때 그럴듯한 가짜 UI 를 그리지 않는다. 대신 자리표시자임이
 * 화면에서 드러나게 한다 — 더미가 그대로 오픈되는 사고를 막는 장치다.
 * (Footer 의 사업자 정보 `[확정 필요]` 표기와 같은 원칙)
 *
 * ── 두 가지 틀 ──
 * `card`  — 흰 테두리 카드. 대시보드처럼 가로 화면에 쓴다.
 * `phone` — **아이폰 모양 베젤**(사용자 확정 2026-08-14, 주요기능 상세 전용).
 *           어두운 베젤 + 상단 다이나믹 아일랜드 + 9:19.5 화면비.
 *           캡처가 오면 `src` 만 채우면 화면 안에 맞게 들어간다.
 */

export type AppScreenProps = {
  /** 마스킹 완료된 실제 앱 캡처 경로. 미확보 시 생략한다 */
  src?: string;
  /** 어떤 화면인지 — 자리표시자에도 그대로 노출된다 */
  alt: string;
  /** 프레임 하단 설명 */
  caption?: string;
  /** 틀 모양. 기본은 카드, 주요기능 상세는 phone */
  frame?: "card" | "phone";
  /** 세로 비율(card 전용). 폰 화면은 9/19, 대시보드는 4/3 정도 */
  aspect?: string;
  /** 히어로처럼 LCP 후보인 곳에서만 true */
  priority?: boolean;
  className?: string;
};

/** 화면 영역 — 캡처가 있으면 이미지, 없으면 자리표시자 */
function Screen({ src, alt, priority }: { src?: string; alt: string; priority: boolean }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 420px"
        className="object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <RingMark size={56} animate={false} />
      <p className="text-body-sm text-text-sub mt-4">{alt}</p>
      {/* 확정 전임을 색으로도 알린다 — 확인 없이 오픈되지 않게 */}
      <p className="text-caption text-warning mt-1.5">[실제 앱 캡처 대기 · §13-C6]</p>
    </div>
  );
}

export function AppScreen({
  src,
  alt,
  caption,
  frame = "card",
  aspect = "aspect-[9/17]",
  priority = false,
  className,
}: AppScreenProps) {
  return (
    <figure className={cn("w-full", className)}>
      {frame === "phone" ? (
        /* ── 아이폰 틀 ── */
        <div className="bg-ink mx-auto w-full max-w-[264px] rounded-[42px] p-[10px] shadow-[var(--shadow-float)] ring-1 ring-black/10">
          <div className="relative aspect-[9/19.5] overflow-hidden rounded-[32px] bg-white">
            {/* 다이나믹 아일랜드 */}
            <span
              aria-hidden
              className="bg-ink absolute top-2.5 left-1/2 z-10 h-[22px] w-[82px] -translate-x-1/2 rounded-full"
            />
            <Screen src={src} alt={alt} priority={priority} />
            {/* 하단 홈 인디케이터 */}
            <span
              aria-hidden
              className="bg-ink/25 absolute bottom-2 left-1/2 z-10 h-[4px] w-[96px] -translate-x-1/2 rounded-full"
            />
          </div>
        </div>
      ) : (
        /* ── 카드 틀 ── */
        <div className="border-border rounded-2xl border bg-white p-2 shadow-[var(--shadow-float)]">
          <div className={cn("bg-bg-subtle relative overflow-hidden rounded-lg", aspect)}>
            <Screen src={src} alt={alt} priority={priority} />
          </div>
        </div>
      )}

      {caption && (
        <figcaption className="text-body-sm text-text-sub mt-3 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}
