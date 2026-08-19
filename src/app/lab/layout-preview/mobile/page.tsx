import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";

export const metadata: Metadata = {
  title: "모바일 레이아웃 검증",
  robots: { index: false, follow: false },
};

/**
 * 부모 화면의 390px iframe 에서 로드되는 모바일 레이아웃.
 * iframe 폭이 390px 이므로 `lg:hidden` 이 실제로 작동해
 * 데스크톱에서도 모바일 동작을 그대로 확인할 수 있다.
 */
export default function LayoutPreviewMobilePage() {
  return (
    <>
      <Header active="/system" />

      <main className="container-ba flex-1 py-10">
        <h1 className="text-h3 text-ink mb-3">모바일 레이아웃</h1>
        <p className="text-body-sm text-text-sub mb-8">
          아래로 스크롤하면 400px 지점부터 하단 고정 CTA 가 올라옵니다.
        </p>

        <div className="bg-bg-subtle border-border mb-6 flex h-[320px] items-center justify-center rounded-lg border">
          <p className="text-caption text-text-sub">스크롤 0 ~ 400px · CTA 숨김</p>
        </div>
        <div className="bg-brand-50 border-brand-200 mb-6 flex h-[320px] items-center justify-center rounded-lg border">
          <p className="text-caption text-brand font-semibold">400px 통과 · CTA 등장</p>
        </div>
        <div className="bg-bg-subtle border-border mb-6 flex h-[320px] items-center justify-center rounded-lg border">
          <p className="text-caption text-text-sub">계속 스크롤 · CTA 유지</p>
        </div>
      </main>

      <Footer />
      <MobileStickyCTA />
    </>
  );
}
