import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeatureDetailSection } from "@/components/marketing/FeatureDetailSection";
import { FeatureIntro } from "@/components/marketing/FeatureIntro";
import { FeatureSideNav } from "@/components/marketing/FeatureSideNav";
import { formatCopy } from "@/components/ui/Copy";
import { buttonClasses } from "@/components/ui/Button";
import { FEATURES } from "@/content/features";
import { DEFAULT_DETAIL_CTA, FEATURE_DETAIL_BY_KEY } from "@/content/feature-details";
import { FEATURE_CAROUSELS } from "@/content/app-screens";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";

/**
 * `/features/[key]` — 기능별 상세 페이지. **기능 7종이 각각 한 페이지**다.
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
 * ── CTA 섹션은 사이드바 바깥이다 (lg 이상) ──
 * 사이드바(`sticky h-svh`)는 부모가 끝날 때까지 따라온다. CTA 를 같은 부모에
 * 넣으면 브랜드 컬러 섹션 옆에 흰 300px 기둥이 남는다. 그래서 lg 이상에서는
 * FAQ·CTA 를 사이드바의 부모(안쪽 div) 밖에 둔다.
 *
 * 좁은 화면은 반대다 — 목차 띠가 CTA 위까지 따라와야 한다(사용자 지시
 * 2026-08-25). 두 요구를 한꺼번에 만족시키는 방법은 아래 `return` 주석에 있다.
 *
 * 정적 내보내기(`output: "export"`)와 호환되도록 `generateStaticParams` 로
 * 일곱 경로를 전부 미리 만든다. 목록에 없는 키는 404 다.
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
  /*
    기능 이름을 앞에 두는 이유: 이 페이지를 찾는 검색어는 "무인매장 관리" 가 아니라
    기능 자체("출퇴근 인증", "인허가 관리")다. 주력 키워드는 뒤에 붙여 이 페이지가
    무엇의 일부인지만 알린다 — 일곱 페이지 title 을 모두 같은 말로 시작하면
    브라우저 탭에서 구분이 안 되고 검색엔진에도 스터핑으로 읽힌다.
  */
  return {
    title: `${feature.title} — 무인매장 관리`,
    description: detail.sub,
  };
}

export default async function FeatureDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const index = FEATURES.findIndex((f) => f.key === key);
  const feature = FEATURES[index];
  const detail = FEATURE_DETAIL_BY_KEY[key];
  if (!feature || !detail) notFound();

  /*
    본문(그룹 카드 · 실제 화면 · 도입 효과)이 하나라도 있는가.
    ⑦ A/S 바로출동서비스는 담당자 문서가 "준비 중" 두 줄뿐이라 셋 모두 비어 있다.
    그대로 그리면 빈 `<section>` 이 남고 도입부의 앵커가 아무 데도 가지 않는다.
  */
  const hasDetailBody =
    detail.groups.length > 0 ||
    detail.screens.length > 0 ||
    FEATURE_CAROUSELS[key] !== undefined ||
    detail.effect !== undefined;

  /* 페이지 맨 아래 버튼 — 기능별로 다를 수 있다(⑦ 만 다르다) */
  const cta = detail.cta ?? DEFAULT_DETAIL_CTA;

  /* 목록에도 상태를 보여준다 — 오픈 예정 기능은 들어가기 전에 알 수 있어야 한다 */
  const navItems = FEATURES.map((f) => ({
    key: f.key,
    label: f.title,
    badge: FEATURE_DETAIL_BY_KEY[f.key]?.notice?.badge,
  }));

  return (
    /*
      ══ 왜 div 가 두 겹인가 (겉·안) ═════════════════════════════
      겉 div — **페이지 전체**를 감싼다. 두 가지 일을 한다.

      ① 좁은 화면에서 목차 띠(`sticky`)의 **기준 상자**가 된다. `sticky` 는 자기
         부모 상자 안에서만 움직이므로, 부모가 본문까지만이면 띠는 FAQ 직전에서
         멈춰 사라진다. 겉 div 가 FAQ·최종 CTA 까지 품으므로 띠가 페이지 끝까지
         헤더 아래에 붙어 따라온다(사용자 지시 2026-08-25). 푸터는 `<main>` 밖이라
         여전히 겹치지 않는다.
      ② Next 의 **스크롤 기준점**이 된다. 라우트가 바뀌면 Next 는 이 세그먼트의
         첫 요소를 찾아 "이미 화면에 보이면 스크롤하지 않는다" 로 판정한다
         (`layout-router.js` 의 `shouldSkipElement`). 그 함수는 **박스가 없는
         요소**(rect 가 전부 0 — `display: contents` 가 그렇다)를 건너뛰고 다음
         형제로 넘어간다. 그래서 겉을 `contents` 로 만들면 기준점이 FAQ 섹션으로
         밀려 "이미 보인다" 로 잘못 판정되고, **페이지를 옮겨도 맨 위로 올라가지
         않는다.** 겉은 반드시 실제 상자여야 한다.

      `no-header-pad` — `globals.css` 의 "첫 섹션에 헤더 높이만큼 여백" 규칙에서
      빼는 표시다. 사이드바가 화면 맨 위(y=0)에서 시작해야 하고, 본문 칸이 자기 위
      여백을 직접 계산한다(아래 `lg:pt-[...]`). 밖에서 여백을 주면 사이드바가
      통째로 72px 밀려 로고가 화면 중턱에 떠 보인다.

      안 div — 좁은 화면에서 `contents`(상자를 만들지 않음)라 위 ①이 성립하고,
      lg 이상에서는 `lg:flex` 가 이겨 사이드바+본문 2단이 된다. 그때는 이쪽이
      기준 상자이므로 `h-svh` 패널이 본문 구간에서만 따라온다 — FAQ·CTA 위로는
      넘어오지 않는다(의도한 동작).
    */
    <div className="no-header-pad">
      <div className="contents lg:flex">
        <FeatureSideNav items={navItems} activeKey={key} />

        <div className="min-w-0 flex-1">
          {/*
            lg 이상에서 위 여백이 큰 이유: 헤더가 `fixed` 라 자리를 먹지 않는다.
            그만큼(72px)을 본문이 직접 확보하지 않으면 첫 줄이 접힌 GNB 알약과
            같은 높이에 놓여 겹친다.
          */}
          <div className="mx-auto w-full max-w-[1140px] px-[var(--gutter)] pt-8 pb-[var(--section-py)] lg:pt-[calc(var(--header-h)+28px)]">
            {/*
              ── 오픈 예정 띠 (사용자 지시 2026-08-27) ──
              아직 열지 않은 기능은 **맨 위에서 먼저** 알린다. 내용은 그대로 두고
              띠만 얹는다 — 오픈 전에도 무엇을 제공할지는 보여줘야 문의가 들어오고,
              동시에 지금 쓸 수 있다고 오해하면 안 되기 때문이다.

              색만으로 상태를 말하지 않는다(`../../CLAUDE.md` §4) — 배지에 글자를
              넣고, 제목·본문으로 한 번 더 적는다.
            */}
            {detail.notice && (
              <div className="border-brand/25 bg-brand-50 mb-9 rounded-[18px] border p-5 md:p-6">
                <p className="text-caption text-brand bg-brand/10 mb-2.5 inline-flex rounded-full px-2.5 py-1 font-bold tracking-[0.08em]">
                  {detail.notice.badge}
                </p>
                <p className="text-h4 text-ink">{detail.notice.title}</p>
                <p className="text-body-sm text-text-sub mt-1.5 max-w-[64ch]">
                  {formatCopy(detail.notice.body)}
                </p>
              </div>
            )}

            <FeatureIntro
              detail={detail}
              no={index + 1}
              title={feature.title}
              /*
                아래에 그릴 것이 하나도 없는 기능(⑦ A/S 바로출동서비스)은 앵커를
                주지 않는다. 링크를 남겨 두면 눌러도 아무 데도 가지 않는다.
              */
              scrollTargetId={hasDetailBody ? `${key}-detail` : undefined}
            />

            {/* 도입부와 본문 사이 여백을 0.75배로 — 도입부가 한 화면에 담겨야 한다 */}
            {hasDetailBody && (
              <div className="mt-[calc(var(--section-py)*0.75)]">
                <FeatureDetailSection detail={detail} title={feature.title} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ 자주 묻는 질문 — 하단 CTA 바로 위 (사용자 지시 2026-08-18) ═════
          겉 div 안에 있어야 한다 — 좁은 화면에서 목차 띠가 여기까지 따라오는 근거다 */}
      <FaqTeaser
        groupId="features"
        offset={0}
        tone="subtle"
        title="기능에 대해 많이 묻는 것들"
        lead="앱과 관리 범위에 대해 도입 전에 가장 많이 받는 질문입니다."
      />

      {/*
        ══ 최종 CTA ═════════════════════════════════════════════
        버튼 두 개의 문구·도착지는 **정본 HTML 의 `page-footer` 그대로**다
        (사용자 지시 2026-08-28). 여섯 기능은 `무료체험 시작하기` / `요금 먼저 보기`,
        ⑦ A/S 바로출동 서비스만 `오픈 알림 받기` / `다른 기능 보기` 다 — 아직
        신청할 것이 없어 상담으로 보낸다. 정본은 `feature-details.ts` 의 `cta` 다.

        ⚠️ 제목과 리드는 정본 HTML 에 **없다.** 그 문서는 카피 목업이라 이 브랜드
           컬러 띠 자체를 그리지 않고 버튼 두 개만 나열한다. 넓은 면에 버튼만 두면
           미완성으로 보이므로 우리 문장을 유지했다 — 여기가 HTML 을 글자 그대로
           옮기지 않은 유일한 자리다.
      */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">
            어디까지 맡기실지부터 정하시면 됩니다
          </h2>
          <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
            매장 상황을 알려주시면 필요한 관리 범위와 옵션 구성을 안내해 드립니다. 상담은
            무료입니다.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={cta.primary.href}
              className={buttonClasses({ variant: "onDark", size: "lg" })}
            >
              {cta.primary.label}
            </Link>
            <Link
              href={cta.secondary.href}
              className={buttonClasses({
                variant: "ghost",
                size: "lg",
                className: "text-white/85 hover:bg-white/12 hover:text-white",
              })}
            >
              {cta.secondary.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
