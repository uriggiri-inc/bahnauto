import Link from "next/link";
import { FaqList } from "@/components/marketing/FaqList";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { FAQ_GROUPS } from "@/content/faq";

/**
 * 페이지 하단 CTA **바로 위**에 붙는 자주 묻는 질문 발췌 (사용자 지시 2026-08-18).
 *
 * ── 왜 CTA 위인가 ──
 * 페이지를 끝까지 읽은 사람이 상담 버튼 앞에서 멈추는 이유는 대개 "아직 모르는 게
 * 하나 남아서"다. 그 자리에서 답을 주면 이탈이 문의로 바뀐다. CTA 아래에 두면
 * 이미 결정한 사람만 본다.
 *
 * ── 문항이 페이지마다 달라야 한다 ──
 * 그룹이 5개인데 붙을 페이지가 더 많다. 모든 페이지가 같은 그룹의 앞 3문항을
 * 보여주면 사이트를 둘러보는 사람에게는 같은 질문이 계속 나온다. `offset` 으로
 * 시작 지점을 옮겨 겹침을 줄인다.
 *
 * ── 카피 정본은 `content/faq.ts` ──
 * 질문·답변을 여기에 적지 않는다. `/faq` 와 **같은 아코디언**(`FaqList`)을 쓰므로
 * 펼침 동작·마크업도 한 곳에서만 관리된다.
 */

export function FaqTeaser({
  groupId,
  title,
  lead,
  /** 그룹에서 몇 번째 문항부터 보여줄지 */
  offset = 0,
  limit = 3,
  /**
   * 배경. **바로 위 섹션과 같은 색을 쓰지 않는다** — 두 섹션이 한 덩어리로
   * 붙어 보여 발췌가 앞 내용의 일부처럼 읽힌다.
   */
  tone = "subtle",
}: {
  groupId: string;
  title: string;
  lead?: string;
  offset?: number;
  limit?: number;
  tone?: "subtle" | "white";
}) {
  const group = FAQ_GROUPS.find((g) => g.id === groupId);
  if (!group) return null;

  /*
    `offset` 이 그룹 끝을 넘으면 앞에서 채운다 — 빈 발췌가 나가는 것보다
    앞 문항을 다시 보여주는 편이 낫다.
  */
  const items =
    group.items.length <= limit
      ? group.items
      : [...group.items.slice(offset), ...group.items.slice(0, offset)].slice(0, limit);

  return (
    <section className={cn("section-py", tone === "subtle" && "bg-bg-subtle")}>
      <div className="container-ba">
        <SectionHeader label="자주 묻는 질문" title={title} lead={lead} />

        <div className="mx-auto max-w-[52rem]">
          <FaqList items={items} />

          <p className="text-body-sm text-text-sub mt-5 text-center">
            <Link href="/faq" className="text-brand underline underline-offset-2">
              자주 묻는 질문 전체 보기
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
