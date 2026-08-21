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
 *
 * ── 배너를 뗀 대가를 여기서 갚는다 (2026-08-20) ──
 * 배너가 없으므로 이 화면에 나오는 것은 **전부 사실이어야 한다.** 그런데
 * 노션 연결 전 임시 공지 4건이 `news.json` 에 커밋돼 있었고, 노션에 게시완료
 * 글이 0건이면 `fetch-news.mjs` 가 그 파일을 건드리지 않으므로(`return`)
 * 그 4건이 **검증 표시 없이 실제 공지처럼** 나가는 상태였다.
 *
 * 그래서 커밋된 `news.json` 을 빈 배열로 비웠고, 목록이 비었을 때를 아래에서
 * 명시적으로 처리한다. **비어 있다고 말하는 화면이 지어낸 공지보다 낫다.**
 *
 * ⚠️ 상세 페이지가 아직 없다. 목록에서 제목을 링크로 만들면 404 로 보내게 된다.
 *    상세는 노션 본문(블록)까지 읽는 2단계 작업이다.
 */

export const metadata: Metadata = {
  title: "공지사항",
  description:
    "반오토 무인매장 관리 서비스의 변경 사항과 매장 운영 관련 공지를 안내합니다. 체크리스트 항목 변경과 앱 업데이트를 먼저 알려드립니다.",
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
          {/*
            공지가 하나도 없을 때. 빈 테두리 상자만 남으면 "고장났나" 로 읽히므로
            상태를 문장으로 말해 준다. 노션에 게시완료 글이 올라오면 이 자리가
            목록으로 바뀐다(`deploy.yml` 의 예약 실행). 크론은 15분 주기로 설정돼
            있지만 GitHub 이 공개 저장소의 예약 실행을 미루므로 실제로는 15분~1시간
            이다 — 화면 문구에 시간을 약속하지 않는 이유다.
            (주의: 이 주석 안에 크론 표기를 그대로 쓰면 별표+슬래시가 JSX 주석을
            끊는다. 말로 적는다.)
          */}
          {NEWS.length === 0 ? (
            <div className="border-border rounded-lg border bg-white p-10 text-center">
              <p className="text-body text-ink mb-2 font-semibold">아직 등록된 공지가 없습니다</p>
              <p className="text-body-sm text-text-sub">
                {formatCopy(
                  "새로운 소식이 생기면 이곳에 먼저 올립니다. 매장 운영 관련 문의는 담당 매니저에게 연락해 주세요.",
                )}
              </p>
            </div>
          ) : (
            <ul className="border-border divide-border divide-y overflow-hidden rounded-lg border bg-white">
              {NEWS.map((n, i) => (
                <li key={n.id}>
                  <Reveal delayMs={i * 50}>
                    {/* 상세 페이지가 아직 없다. 링크로 만들면 404 로 보내게 된다 */}
                    <article className="flex flex-col gap-2 p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge tone={n.category === "공지" ? "brand" : "neutral"}>
                          {n.category}
                        </Badge>
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
          )}
        </div>
      </section>
    </>
  );
}
