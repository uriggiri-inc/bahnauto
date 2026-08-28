import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Mark } from "@/components/ui/Mark";
import type { FeatureDetail } from "@/content/feature-details";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 기능 상세 도입부 — 번호·영문 라벨 · 2줄 헤드라인 · 리드 · 칩.
 *
 * ── `FeatureHero` 를 대체한다 (사용자 확정 2026-08-18) ──
 * 8/14~8/18 오전까지는 이 자리가 "한 화면을 꽉 채우는 히어로"였다. 참고 시안에는
 * 그런 화면이 없다 — 페이지를 열면 **사이드바와 본문이 바로 보인다.** 그래서
 *   · `100svh` 높이 계산과 스크롤 유도 버튼(`ScrollCue`)을 없앴다
 *   · 배경 그라디언트도 없앴다(시안은 흰 배경이다)
 *   · 문구가 **왼쪽 정렬**이다(히어로는 가운데 정렬이었다)
 *
 * ── 오른쪽 도넛 게이지는 삭제됐다 (사용자 지시 2026-08-18) ──
 * 시안을 따라 `FeatureVisual`(브랜드 컬러 도넛 + `체크리스트 92% 완료` 배지)을
 * 잠깐 두었다가 **사용자 지시로 통째로 지웠다.** 그래서 이 도입부는 2열 격자가
 * 아니라 한 덩어리다. 다시 넣을 일이 생기면 컴포넌트부터 새로 만든다 —
 * 되살릴 껍데기를 남겨 두지 않았다.
 *
 * ── 정렬이 왼쪽인 이유 ──
 * 왼쪽에 사이드바가 서 있어 본문 영역의 광학적 중심이 화면 중앙과 다르다.
 * 가운데 정렬을 쓰면 사이드바 쪽으로 쏠려 보인다.
 *
 * ── 강조는 색교체 하나 ──
 * `headline[1]` 을 브랜드 색으로 바꾼다. 요금·도입 절차는 굵은 밑줄이다
 * (`Mark` 주석의 배분표 참조). 여기에 다른 형태를 섞지 않는다.
 *
 * ── 모션 없음 ──
 * 페이지 최상단이라 LCP 요소다. 모션 라이브러리도 `Reveal` 도 쓰지 않는다
 * (CLAUDE.md §4).
 */

export function FeatureIntro({
  detail,
  no,
  title,
  scrollTargetId,
}: {
  detail: FeatureDetail;
  no: number;
  title: string;
  /**
   * 도입부 아래 첫 섹션의 id — 칩 아래 안내 문장이 가리킨다.
   *
   * **없을 수 있다.** ⑦ A/S 바로출동서비스는 아래에 그릴 내용이 없다("준비 중"
   * 두 줄뿐이다). 그때도 링크를 두면 눌러도 아무 데도 가지 않는 링크가 된다.
   */
  scrollTargetId?: string;
}) {
  return (
    <section id={`${detail.key}-intro`}>
      {/* 번호 · 영문 라벨 — 시안의 `01 · OPERATION DASHBOARD` */}
      <p className="text-label text-brand flex items-center gap-2 font-semibold tracking-[0.14em]">
        <span className="tabular-nums">{String(no).padStart(2, "0")}</span>
        <span aria-hidden>·</span>
        <span>{detail.eyebrow}</span>
      </p>

      {/* `text-display`(최대 58px) → `text-h1`(최대 42px). 도입부가 한 화면에
          담기지 않는다는 요청(2026-08-18) 때문이다. 두 줄 헤드라인에서 30px 넘게
          줄어든다. 홈 히어로는 그대로 `text-display` 다 — 거기는 첫 화면 전체를
          쓰므로 크기가 커도 담긴다 */}
      <h1 className="text-h1 text-ink mt-5">
        {detail.headline[0]}
        <br />
        <Mark tone="color">{detail.headline[1]}</Mark>
      </h1>

      <p className="text-body-lg text-text-sub mt-6 max-w-[38rem]">{formatCopy(detail.sub)}</p>

      {/* 칩이 없는 기능(⑦)에서는 목록 자체를 그리지 않는다 — 빈 `<ul>` 을 두면
          `mt-7` 만 남아 리드와 다음 요소 사이가 이유 없이 벌어진다 */}
      {detail.chips.length > 0 && (
        <ul className="mt-7 flex flex-wrap gap-2">
          {detail.chips.map((c) => (
            <li key={c}>
              <Badge tone="brand" className="border-brand-200 bg-brand-50 border px-3 py-1.5">
                {c}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      {/*
        ── 이 줄은 정본 HTML 문장 그대로다 (사용자 지시 2026-08-28) ──
        8/27 에 "기본 요금과 옵션 구성은 [요금 안내]에서" 로 고쳐 두었는데,
        담당자 정본(`반오토 주요기능 수정.html`)이 **"포함 항목은 [요금제 구성]에서"**
        로 적고 있어 되돌렸다.

        ⚠️ 정본을 따르되 어긋난 점은 남겨 둔다: `/pricing` 은 2026-08-27 개편으로
           **요금제가 없어졌다**(기본료 하나 + 옵션 목록). "요금제 구성" 이 가리킬
           대상이 화면에 없다. 확인이 필요하다.

        ⑦ A/S 바로출동 서비스에는 이 줄이 **없다.** 정본 HTML 의 그 페이지에만
        `meta-line` 이 빠져 있다 — 아직 요금에 넣을 것이 없기 때문이다.
        본문이 없는 기능(= `scrollTargetId` 가 없는 기능)이 그것 하나뿐이라
        같은 조건으로 함께 가린다.
      */}
      {scrollTargetId && (
        <p className="text-caption text-text-sub mt-5">
          {title} · 포함 항목은{" "}
          <Link href="/pricing" className="text-brand underline underline-offset-2">
            요금제 구성
          </Link>
          에서 확인하실 수 있습니다.{" "}
          {/* 스크롤 유도 버튼을 없앤 대신 본문으로 가는 앵커를 남긴다 —
              키보드 사용자에게 도입부를 건너뛰는 경로가 된다 */}
          <a href={`#${scrollTargetId}`} className="text-brand underline underline-offset-2">
            기능 자세히 보기
          </a>
        </p>
      )}
    </section>
  );
}
