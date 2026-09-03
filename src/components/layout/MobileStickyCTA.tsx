"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { TEL_HREF } from "@/content/company";
import { STICKY_CTA_THRESHOLD } from "./stickyCta";

/**
 * 모바일 하단 고정 CTA — 스크롤 400px 이후 등장.
 *
 * 2분할: **전화 상담 · 무료 방문 진단**
 * 폼 작성을 꺼리는 점주를 위한 대안 접점이다(PRD §7.6).
 *
 * ── 카카오톡 버튼을 뺐다 (사용자 지시 2026-08-27) ──
 * 오른쪽에 폭 56px 짜리 카카오 아이콘 버튼이 하나 더 있었다. 뺀 자리를 남은 둘이
 * 나눠 갖는다 — 비율(1 : 1.5)은 그대로라 "무료 방문 진단" 이 계속 더 크다.
 *
 * 애초에 이 버튼은 **채널 주소가 확정되지 않아 눌러도 아무 일도 하지 않는
 * 상태**였다(`kakaoUrl` 기본값이 빈 문자열이고 넘겨 주는 호출부가 없었다).
 * 좁은 화면에서 56px 을 죽은 링크에 쓰고 있던 셈이다.
 *
 * ⚠️ 2026-09-03 `/contact` 의 `폼 작성이 번거로우시면` 상자(전화·카카오톡 상담)도
 *    지웠다. 즉 **사이트에 카카오톡 상담 경로가 남아 있지 않다.** 채널 주소가
 *    확정되면 어디에 되살릴지부터 정해야 한다.
 *
 * ⚠️ 되살릴 때는 `kakaoUrl` prop 과 `@icons-pack/react-simple-icons` 의
 *    `SiKakaotalk` 을 함께 되살려야 한다. 그 패키지는 이제 이 저장소에서
 *    아무 곳도 쓰지 않는다.
 *
 * 이 바가 올라오면 헤더의 CTA 는 사라진다(임계값 공유) — 같은 전환 경로를
 * 화면에 두 번 두지 않는다.
 *
 * 채널톡 위젯이 우하단에 뜨므로 위젯 쪽 `bottom` 을 이 바 높이만큼 올려야 한다(§9.4).
 */

export type MobileStickyCTAProps = {
  telLabel?: string;
  ctaLabel?: string;
  /**
   * 전화 버튼이 거는 번호. 기본값은 `content/company.ts` 의 대표번호다.
   *
   * 2026-09-03 사용자 확정으로 **실제 번호가 연결됐다**(그 전까지 기본값이 빈
   * 문자열이라 눌러도 아무 일도 일어나지 않았다). 값을 여기 다시 적지 않고
   * `TEL_HREF` 를 쓰는 이유는, 푸터에 뜨는 번호와 버튼이 거는 번호가 갈라지면
   * 어느 쪽이 맞는지 알 수 없게 되기 때문이다.
   */
  tel?: string;
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
  tel = TEL_HREF,
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
      </div>
    </div>
  );
}
