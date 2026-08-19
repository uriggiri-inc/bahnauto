import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { NEWS } from "@/content/news";
import { formatCopy } from "@/components/ui/Copy";

/**
 * `/news` — 공지사항 (PRD §7.9 · P2).
 *
 * ── 데이터 출처가 바뀌었다 (2026-08-18) ──
 * `content/dummy.ts` 의 `DUMMY_NEWS` → `content/news.ts` 의 `NEWS`.
 * 정본은 **노션 데이터베이스**이고, 빌드 직전 `scripts/fetch-news.mjs` 가 읽어
 * `content/news.json` 에 넣는다. 자세한 흐름은 `content/news.ts` 주석에 있다.
 *
 * ⚠️ **샘플 데이터 배너를 뗐다.** 공지사항은 요금·실적처럼 검증을 기다리는
 *    값이 아니다 — 올리는 즉시 사실이다. `DUMMY_CONTENT` 게이트를 끄는 날
 *    함께 사라져도 안 된다.
 *    지금 들어 있는 4건은 노션 연결 전 임시 글이므로, 연결 시 노션 내용으로
 *    덮인다.
 *
 * ⚠️ 상세 페이지가 아직 없다. 목록에서 제목을 링크로 만들면 404 로 보내게 된다.
 *    상세는 노션 본문(블록)까지 읽는 2단계 작업이다.
 */

export const metadata: Metadata = {
  title: "공지사항",
  description: "반오토 서비스 변경 사항과 매장 운영 관련 공지를 안내합니다.",
};

/** 2026-08-04 → 2026.08.04 */
function formatDate(iso: string) {
  return iso.replaceAll("-", ".");
}

export default function NewsPage() {
  return (
    <>
      <section className="bg-bg-subtle border-border border-b">
        <div className="container-ba py-12 md:py-16">
          <SectionLabel className="mb-3">공지사항</SectionLabel>
          <h1 className="text-h1 text-ink mb-4">서비스 소식</h1>
          <p className="text-body-lg text-text-sub max-w-[46rem]">
            체크리스트 항목 변경, 앱 업데이트 등 매장 운영에 영향을 주는 내용을 먼저 알려드립니다.
          </p>
        </div>
      </section>

      <section className="section-py">
        <div className="container-ba">
          <ul className="border-border divide-border divide-y overflow-hidden rounded-lg border bg-white">
            {NEWS.map((n, i) => (
              <li key={n.id}>
                <Reveal delayMs={i * 50}>
                  {/* 상세 페이지가 아직 없다. 링크로 만들면 404 로 보내게 된다 */}
                  <article className="flex flex-col gap-2 p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={n.category === "공지" ? "brand" : "neutral"}>{n.category}</Badge>
                      <time dateTime={n.date} className="text-caption text-text-sub tabular-nums">
                        {formatDate(n.date)}
                      </time>
                    </div>
                    <h2 className="text-h4 text-ink">{n.title}</h2>
                    <p className="text-body-sm text-text-sub">{formatCopy(n.summary)}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
