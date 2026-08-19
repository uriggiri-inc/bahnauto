import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "레이아웃 검증",
  robots: { index: false, follow: false },
};

/**
 * 레이아웃 3종 검증 화면.
 *
 * MobileStickyCTA 는 `lg:hidden` 이라 데스크톱에서는 아무리 스크롤해도 나타나지 않는다.
 * 그게 의도한 동작이지만, 검증 화면에서는 그 사실이 드러나야 하고
 * 데스크톱에서도 동작을 눈으로 확인할 수 있어야 한다 → 모바일 폭 iframe 을 함께 띄운다.
 */
export default function LayoutPreviewPage() {
  return (
    <>
      <Header active="/system" />

      <main className="container-ba flex-1 py-16">
        <SectionLabel>Layout</SectionLabel>
        <h1 className="text-h1 text-ink mt-4 mb-4">레이아웃 컴포넌트 검증</h1>
        <p className="text-body-lg text-text-sub mb-10 max-w-2xl">
          Header · Footer · MobileStickyCTA 를 실제 배치한 화면입니다.
        </p>

        {/* 데스크톱에서 헛돌지 않도록 먼저 알린다 */}
        <div className="border-warning/40 bg-warning-bg mb-10 rounded-lg border p-5">
          <p className="text-body-sm text-ink font-semibold">
            하단 고정 CTA 는 이 화면(데스크톱)에서는 나타나지 않습니다
          </p>
          <p className="text-body-sm text-text-sub mt-2">
            <code>lg:hidden</code> — 1024px 미만에서만 동작합니다. 데스크톱에는 헤더에 CTA 가 상시
            노출되므로 하단 바까지 띄우면 같은 전환 경로가 중복됩니다. 아래{" "}
            <strong className="text-ink">모바일 프레임</strong>에서 스크롤해 확인하세요.
          </p>
        </div>

        <h2 className="text-h3 text-ink mb-4">데스크톱 확인 항목</h2>
        <ul className="text-body text-text-sub mb-14 list-disc space-y-2.5 pl-5">
          <li>
            <strong className="text-ink">상단 내비가 한 줄에 들어가는가</strong> — 두 줄이 되면
            항목을 줄여야 합니다
          </li>
          <li>유틸리티(매니저 지원 · 앱 로그인)가 구분선으로 메인 내비와 분리되는가</li>
          <li>
            <strong className="text-ink">푸터 컬럼이 우측 끝까지 고르게 퍼지는가</strong> — 가운데로
            뭉치면 안 됩니다
          </li>
          <li>푸터 사업자 정보가 미확정으로 드러나는가 (주황색 대괄호)</li>
          <li>푸터에서 개인정보처리방침만 굵게 강조되는가 (법적 권고)</li>
        </ul>

        <h2 className="text-h3 text-ink mb-2">모바일 프레임 · 390px</h2>
        <p className="text-body-sm text-text-sub mb-5">
          이 프레임 안에서 스크롤하면 400px 지점부터 하단 고정 CTA 가 올라옵니다. 햄버거도 여기서
          눌러보세요.
        </p>
        <div className="border-border bg-bg-subtle mb-14 inline-block rounded-xl border p-3">
          <iframe
            src="/lab/layout-preview/mobile"
            title="모바일 레이아웃 — 390px"
            width={390}
            height={780}
            className="border-border block rounded-lg border bg-white"
          />
        </div>

        <h2 className="text-h3 text-ink mb-4">모바일 확인 항목</h2>
        <ul className="text-body text-text-sub mb-10 list-disc space-y-2.5 pl-5">
          <li>
            <strong className="text-ink">[무료 방문 진단] 버튼이 헤더에 그대로 보이는가</strong> —
            햄버거 안에 숨기면 안 됩니다 (1순위 전환)
          </li>
          <li>햄버거를 눌러 오버레이가 열리는가 — Esc 로 닫히고 배경 스크롤이 잠기는가</li>
          <li>오버레이의 앱 로그인에 &ldquo;계약 고객 전용&rdquo; 라벨이 붙는가</li>
          <li>
            <strong className="text-ink">400px 스크롤 후 하단 CTA 가 올라오는가</strong> — 다시 위로
            올리면 내려가는가
          </li>
        </ul>

        <div className="bg-bg-subtle border-border flex h-[600px] items-center justify-center rounded-lg border">
          <p className="text-body-sm text-text-sub">푸터 확인용 여백</p>
        </div>
      </main>

      <Footer />
      <MobileStickyCTA />
    </>
  );
}
