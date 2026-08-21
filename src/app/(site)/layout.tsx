import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/structured-data";

/**
 * 마케팅 사이트 공통 셸.
 *
 * 루트 레이아웃이 아니라 `(site)` 라우트 그룹에 둔다 — `/design-system` 과 `/lab` 은
 * 검증용 화면이라 GNB·푸터·하단 CTA 가 붙으면 안 되기 때문이다. 라우트 그룹은
 * URL 에 영향을 주지 않으므로 홈은 그대로 `/` 다.
 *
 * GA4 도 루트가 아니라 여기 둔다. 루트에 두면 `/design-system` 과 `/lab` 의
 * 내부 확인 트래픽까지 집계에 섞인다 — 두 화면은 운영 도메인에도 올라가 있어
 * 호스트 검사만으로는 걸러지지 않는다.
 *
 * 발행 주체 정보(Organization)도 같은 이유로 여기다 — 검증용 화면이 회사를
 * 대표하는 페이지로 신고되면 안 된다. 화면에는 아무것도 그리지 않는다.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 발행 주체 정보. 값의 정본은 `content/company.ts` 다 */}
      <JsonLd data={organizationJsonLd()} />

      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* 하단 고정 바가 푸터 마지막 줄을 덮지 않게 자리를 비워둔다 */}
      <div className="h-[72px] lg:hidden" aria-hidden />
      <MobileStickyCTA />

      <GoogleAnalytics />
    </>
  );
}
