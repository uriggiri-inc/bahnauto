"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "@phosphor-icons/react";
import { SiKakaotalk } from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/cn";
import { STICKY_CTA_THRESHOLD } from "./stickyCta";

/**
 * 모바일 하단 고정 CTA — 스크롤 400px 이후 등장.
 *
 * 3분할: **전화 상담 · 무료 방문 진단 · 카카오톡**
 * 폼 작성을 꺼리는 점주를 위한 대안 접점이다(PRD §7.6). 전화가 부담스러운 사람에게
 * 카카오톡은 훨씬 낮은 문턱의 진입로다.
 *
 * 이 바가 올라오면 헤더의 CTA 는 사라진다(임계값 공유) — 같은 전환 경로를
 * 화면에 두 번 두지 않는다.
 *
 * 채널톡 위젯이 우하단에 뜨므로 위젯 쪽 `bottom` 을 이 바 높이만큼 올려야 한다(§9.4).
 */

export type MobileStickyCTAProps = {
  telLabel?: string;
  ctaLabel?: string;
  /** `[확정 필요 §13-A1]` 대표번호 */
  tel?: string;
  /** `[확정 필요 §13-F3]` 카카오 채널 URL */
  kakaoUrl?: string;
  ctaHref?: string;
  threshold?: number;
  /**
   * 검증용 — lg 이상에서도 렌더한다.
   * 운영 페이지에서는 쓰지 않는다.
   */
  previewOnDesktop?: boolean;
};

export function MobileStickyCTA({
  telLabel = "전화 상담",
  ctaLabel = "무료 방문 진단",
  tel = "",
  kakaoUrl = "",
  ctaHref = "/contact",
  threshold = STICKY_CTA_THRESHOLD,
  previewOnDesktop = false,
}: MobileStickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setVisible(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return (
    <div
      className={cn(
        "border-border fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 backdrop-blur-[10px]",
        // 데스크톱에는 헤더 CTA 가 상시 노출된다 → 하단 바는 모바일 전용
        !previewOnDesktop && "lg:hidden",
        // 아이폰 홈 인디케이터 영역을 피한다
        "pb-[env(safe-area-inset-bottom)]",
        "ease-brand transition-[transform,opacity] duration-[240ms]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      // 화면에 없을 때 스크린리더·키보드에서도 제외한다.
      // React 19 는 inert 를 boolean 속성으로 그대로 받는다.
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <a
          href={tel ? `tel:${tel}` : undefined}
          className="text-body-sm bg-brand-100 text-brand border-brand-200 tap ease-standard flex flex-1 items-center justify-center gap-1.5 rounded-sm border font-semibold transition-colors duration-[160ms] active:bg-[var(--color-brand-200)]"
        >
          <Phone size={18} weight="regular" aria-hidden />
          {telLabel}
        </a>

        <Link
          href={ctaHref}
          className="text-body-sm bg-brand tap ease-standard flex flex-[1.5] items-center justify-center rounded-sm font-semibold text-white shadow-[var(--shadow-cta)] transition-colors duration-[160ms] active:bg-[var(--color-brand-active)]"
        >
          {ctaLabel}
        </Link>

        {/*
          카카오톡 — 틀(배경·보더·radius·섀도우)은 우리 디자인 시스템을 따르고,
          말풍선 마크만 카카오 고유 형태를 유지한다.
          노란 면을 쓰지 않으므로 형태 자체가 채널을 인지시킨다.
        */}
        <a
          href={kakaoUrl || undefined}
          target={kakaoUrl ? "_blank" : undefined}
          rel={kakaoUrl ? "noopener noreferrer" : undefined}
          aria-label="카카오톡 상담"
          className="border-border tap ease-standard flex w-14 shrink-0 items-center justify-center rounded-sm border bg-white shadow-[var(--shadow-card)] transition-colors duration-[160ms] active:bg-[var(--color-bg-subtle)]"
        >
          <SiKakaotalk size={22} color="#3C1E1E" aria-hidden />
        </a>
      </div>
    </div>
  );
}
