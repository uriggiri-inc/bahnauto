import { formatCopy } from "@/components/ui/Copy";
import type { FaqItem } from "@/content/faq";

/**
 * 질문·답변 아코디언 목록. `/faq` 와 요금 페이지 발췌가 **같은 것을 쓴다.**
 *
 * ── 왜 `<details>` 인가 ──
 * **JS 0바이트**에 키보드·스크린리더가 기본 동작하고, 브라우저 내 검색(Ctrl+F)이
 * 닫힌 항목까지 찾아 펼쳐 준다. 직접 만든 아코디언은 이 셋을 전부 다시 구현해야
 * 하고 대개 하나쯤 빠뜨린다.
 *
 * ── 왜 컴포넌트로 뽑았나 ──
 * 요금 페이지가 요금 문항 3개를 발췌한다(사용자 확정 2026-08-18). 목록 마크업을
 * 두 곳에 복사해 두면 한쪽만 손질되어 같은 질문이 두 화면에서 다르게 보인다.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="border-border divide-border divide-y overflow-hidden rounded-lg border bg-white">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="text-body text-ink hover:bg-bg-subtle ease-standard flex cursor-pointer items-center justify-between gap-4 px-5 py-5 font-semibold transition-colors duration-[160ms] [&::-webkit-details-marker]:hidden">
            {f.q}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="ease-standard shrink-0 transition-transform duration-[200ms] group-open:rotate-180"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <p className="text-body text-text-sub px-5 pb-5">{formatCopy(f.a)}</p>
        </details>
      ))}
    </div>
  );
}
