import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeatureDetailSection } from "@/components/marketing/FeatureDetailSection";
import { FeatureIntro } from "@/components/marketing/FeatureIntro";
import { FeatureSideNav } from "@/components/marketing/FeatureSideNav";
import { buttonClasses } from "@/components/ui/Button";
import { FEATURES } from "@/content/features";
import { FEATURE_DETAIL_BY_KEY } from "@/content/feature-details";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";

/**
 * `/features/[key]` — 기능별 상세 페이지. **8기능이 각각 한 페이지**다.
 *
 * ── 참고 시안 배치로 전면 교체 (사용자 확정 2026-08-18) ──
 * 8/18 오전까지는 "풀스크린 히어로 → 스크롤하면 목차 등장" 이었다. 참고 시안에는
 * 그런 첫 화면이 없다 — **열면 사이드바와 본문이 바로 보인다.** 그래서
 *   · `FeatureHero`(100svh + 스크롤 유도) → `FeatureIntro`(왼쪽 정렬 문구 한 덩어리.
 *     오른쪽 도넛 게이지를 잠깐 뒀다가 사용자 지시로 삭제했다)
 *   · `FeatureNav`(본문 격자의 240px 칸) → `FeatureSideNav`(화면 높이 전체 패널 + 로고)
 *   · 상단 GNB 는 흰 알약 패널로 우측 상단에 선다(`Header.tsx`). 8/18 오전에는
 *     눌러야 펼쳐지는 접힘 메뉴였는데, 사용자 지시로 펼친 상태로 고정되고
 *     그 모양이 **전 페이지 공통**이 됐다
 *
 * ── 왜 `container-ba` 를 쓰지 않는가 ──
 * 왼쪽 사이드바가 300~332px 를 먹으므로 그 안에서 다시 1440px 컨테이너를
 * 가운데 정렬하면 본문이 오른쪽으로 쏠린다. 남은 폭 안에서 자체 상한
 * (1140px)을 두고 거터만 준다.
 *
 * ── CTA 섹션은 사이드바 바깥이다 ──
 * 사이드바(`sticky h-svh`)는 부모가 끝날 때까지 따라온다. CTA 를 같은 부모에
 * 넣으면 브랜드 컬러 섹션 옆에 흰 300px 기둥이 남는다.
 *
 * 정적 내보내기(`output: "export"`)와 호환되도록 `generateStaticParams` 로
 * 8개 경로를 전부 미리 만든다. 목록에 없는 키는 404 다.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURES.map((f) => ({ key: f.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const feature = FEATURES.find((f) => f.key === key);
  const detail = FEATURE_DETAIL_BY_KEY[key];
  if (!feature || !detail) return {};
  return {
    title: `${feature.title} — 주요기능`,
    description: detail.sub,
  };
}

export default async function FeatureDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const index = FEATURES.findIndex((f) => f.key === key);
  const feature = FEATURES[index];
  const detail = FEATURE_DETAIL_BY_KEY[key];
  if (!feature || !detail) notFound();

  const navItems = FEATURES.map((f) => ({ key: f.key, label: f.title }));

  return (
    <>
      {/*
        ══ 사이드바 + 본문 ═══════════════════════════════════════
        `no-header-pad` — `globals.css` 의 "첫 섹션에 헤더 높이만큼 여백" 규칙에서
        빼는 표시다. 이 페이지는 사이드바가 화면 맨 위(y=0)에서 시작해야 하고,
        본문 칸이 자기 위 여백을 직접 계산한다(아래 `lg:pt-[...]`). 밖에서 여백을
        주면 사이드바가 통째로 72px 밀려 로고가 화면 중턱에 떠 보인다.
      */}
      <div className="no-header-pad lg:flex">
        <FeatureSideNav items={navItems} activeKey={key} />

        <div className="min-w-0 flex-1">
          {/*
            lg 이상에서 위 여백이 큰 이유: 헤더가 `fixed` 라 자리를 먹지 않는다.
            그만큼(72px)을 본문이 직접 확보하지 않으면 첫 줄이 접힌 GNB 알약과
            같은 높이에 놓여 겹친다.
          */}
          <div className="mx-auto w-full max-w-[1140px] px-[var(--gutter)] pt-8 pb-[var(--section-py)] lg:pt-[calc(var(--header-h)+28px)]">
            <FeatureIntro
              detail={detail}
              no={index + 1}
              title={feature.title}
              scrollTargetId={`${key}-detail`}
            />

            {/* 도입부와 본문 사이 여백을 0.75배로 — 도입부가 한 화면에 담겨야 한다 */}
            <div className="mt-[calc(var(--section-py)*0.75)]">
              <FeatureDetailSection detail={detail} title={feature.title} />
            </div>
          </div>
        </div>
      </div>

      {/* ══ 자주 묻는 질문 — 하단 CTA 바로 위 (사용자 지시 2026-08-18) ═════ */}
      <FaqTeaser
        groupId="features"
        offset={0}
        tone="subtle"
        title="기능에 대해 많이 묻는 것들"
        lead="앱과 관리 범위에 대해 도입 전에 가장 많이 받는 질문입니다."
      />

      {/* ══ 최종 CTA ═════════════════════════════════════════════ */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">
            어디까지 맡기실지부터 정하시면 됩니다
          </h2>
          <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
            매장 상황을 알려주시면 필요한 관리 범위와 구독 플랜을 안내해 드립니다. 상담은
            무료입니다.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className={buttonClasses({ variant: "onDark", size: "lg" })}>
              무료 도입 상담 신청
            </Link>
            <Link
              href="/pricing"
              className={buttonClasses({
                variant: "ghost",
                size: "lg",
                className: "text-white/85 hover:bg-white/12 hover:text-white",
              })}
            >
              요금 먼저 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
