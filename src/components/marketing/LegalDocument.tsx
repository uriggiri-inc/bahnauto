import { COMPANY } from "@/content/company";
import type { LegalBlock, LegalDoc } from "@/content/legal/types";

/**
 * 법정 문서 렌더러 — 이용약관·개인정보처리방침 공용.
 *
 * ── 읽히게 만드는 것이 목적이다 ──
 * 이런 문서는 "게시했으니 됐다"로 취급되기 쉽지만, 실제로는 분쟁이 생겼을 때
 * **읽을 수 있게 게시했는가**가 문제가 된다. 그래서
 *   · 본문 폭을 68자 안팎으로 제한하고
 *   · 조(條)마다 앵커를 걸어 특정 조항을 링크로 지목할 수 있게 하고
 *   · 표는 가로 스크롤 컨테이너에 넣어 모바일에서 잘리지 않게 한다
 *
 * 목차는 데스크톱에서 좌측에 고정한다 — 스무 개 가까운 조를 스크롤로만
 * 훑게 하면 원하는 조항을 찾지 못한다.
 */

/** "제1조 (목적)" → "제1조" 를 앵커 id 로 (한글 id 도 유효하지만 링크 공유 시 인코딩된다) */
function anchorId(heading: string, index: number) {
  const m = heading.match(/제(\d+)조/);
  return m ? `article-${m[1]}` : `section-${index}`;
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return <p className="text-body text-text-sub">{block}</p>;
  }

  if ("list" in block) {
    return (
      <ul className="border-border-light flex flex-col gap-2 border-l pl-4">
        {block.list.map((item) => (
          <li key={item} className="text-body text-text-sub">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    // 표는 모바일에서 반드시 넘친다. 페이지 전체가 가로로 밀리지 않도록 여기서만 스크롤한다.
    <div className="border-border overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[520px] border-collapse">
        <thead>
          <tr className="bg-bg-subtle">
            {block.table.head.map((h) => (
              <th
                key={h}
                className="text-label text-text-sub border-border-light border-b px-4 py-3 text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row.join("|")} className="border-border-light border-b last:border-0">
              {row.map((cell, i) => (
                <td
                  key={cell}
                  className={
                    i === 0
                      ? "text-body-sm text-ink px-4 py-3 align-top font-semibold"
                      : "text-body-sm text-text-sub px-4 py-3 align-top"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  const sections = doc.chapters.flatMap((c) => c.sections);

  return (
    <div className="container-ba section-py grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
      {/* ── 목차 ── */}
      <nav
        aria-label="목차"
        className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start"
      >
        <p className="text-label text-ink mb-4">목차</p>
        <ul className="border-border-light flex flex-col gap-2 border-l pl-4">
          {sections.map((s, i) => (
            <li key={s.heading}>
              <a
                href={`#${anchorId(s.heading, i)}`}
                className="text-caption text-text-sub hover:text-brand ease-standard transition-colors duration-[160ms]"
              >
                {s.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── 본문 ── */}
      <div>
        {doc.intro?.map((p) => (
          <p key={p} className="text-body text-text-sub border-border mb-8 border-b pb-8">
            {p}
          </p>
        ))}

        {doc.chapters.map((chapter, ci) => (
          <section key={chapter.heading ?? ci}>
            {chapter.heading && (
              <h2 className="text-h3 text-ink border-border mt-12 mb-8 border-b pb-4 first:mt-0">
                {chapter.heading}
              </h2>
            )}

            {chapter.sections.map((s, si) => (
              <article key={s.heading} id={anchorId(s.heading, si)} className="mb-10 last:mb-0">
                <h3 className="text-h4 text-ink mb-4">{s.heading}</h3>
                <div className="flex flex-col gap-3">
                  {s.blocks.map((b, bi) => (
                    <Block key={bi} block={b} />
                  ))}
                </div>
              </article>
            ))}
          </section>
        ))}

        {doc.appendix && (
          <section className="border-border mt-12 border-t pt-8">
            <h2 className="text-h4 text-ink mb-4">{doc.appendix.heading}</h2>
            <div className="flex flex-col gap-3">
              {doc.appendix.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </div>
          </section>
        )}

        {/* 사업자 정보 — 원본 문서 하단과 같은 내용을 같은 자리에 둔다 */}
        <div className="bg-bg-subtle border-border text-caption text-text-sub mt-12 rounded-lg border p-5">
          <p className="text-ink mb-1 font-semibold">{COMPANY.name}</p>
          <p>
            {COMPANY.address} · 사업자등록번호 {COMPANY.bizNo}
          </p>
          <p>
            전화 {COMPANY.tel} · 팩스 {COMPANY.fax} · 이메일 {COMPANY.email}
          </p>
        </div>
      </div>
    </div>
  );
}
