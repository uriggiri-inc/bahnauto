import type { Metadata } from "next";
import { ScrollStory } from "@/components/brand/ScrollStory";

export const metadata: Metadata = {
  title: "스크롤 서사 가설검증",
  robots: { index: false, follow: false },
};

export default function LabStoryPage() {
  return (
    <>
      <section className="container-ba flex min-h-[60svh] flex-col justify-center py-16">
        <div className="text-label text-brand mb-4 uppercase">앞 섹션 (스크롤 시작점)</div>
        <h1 className="text-h1 text-ink">여기서 아래로 스크롤하세요</h1>
        <p className="text-body-lg text-text-sub mt-4 max-w-2xl">
          다음 구간이 스크롤에 반응하는 브랜드 서사입니다. 스크롤을 멈추면 애니메이션도 멈추고, 위로
          올리면 되감깁니다. 재생 속도의 통제권이 사용자에게 있습니다.
        </p>
      </section>

      <div id="brand-story">
        <ScrollStory />
      </div>

      <section className="container-ba flex min-h-[60svh] flex-col justify-center py-16">
        <div className="text-label text-brand mb-4 uppercase">뒤 섹션 (스크롤 종료점)</div>
        <h2 className="text-h2 text-ink">서사 구간을 빠져나왔습니다</h2>
        <p className="text-body-lg text-text-sub mt-4 max-w-2xl">
          여기까지 오는 데 스크롤이 얼마나 필요했는지 체감해 보세요. 이 거리가 곧 하단 섹션(요금 ·
          Before/After)의 도달률을 결정합니다.
        </p>
        <ul className="text-body-sm text-text-sub mt-8 list-disc space-y-2 pl-5">
          <li>모바일에서 헤드라인이 단어 중간에 잘리지 않는가</li>
          <li>스크롤을 멈췄을 때 씬이 어중간하게 걸치지 않는가</li>
          <li>iOS 에서 주소창이 접히며 화면이 튀지 않는가 (100svh 적용)</li>
          <li>되감기(위로 스크롤)가 자연스러운가</li>
          <li>진행 표시 점으로 남은 길이를 예측할 수 있는가</li>
        </ul>
      </section>
    </>
  );
}
