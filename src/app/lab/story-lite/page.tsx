import type { Metadata } from "next";
import { ScrollStoryLite } from "@/components/brand/ScrollStoryLite";

export const metadata: Metadata = {
  title: "스크롤 서사 (무의존성)",
  robots: { index: false, follow: false },
};

export default function LabStoryLitePage() {
  return (
    <>
      <section className="container-ba flex min-h-[60svh] flex-col justify-center py-16">
        <div className="text-label text-brand mb-4 uppercase">무의존성 버전</div>
        <h1 className="text-h1 text-ink">여기서 아래로 스크롤하세요</h1>
        <p className="text-body-lg text-text-sub mt-4 max-w-2xl">
          motion 라이브러리 없이 구현했습니다. JS 는 스크롤 진행도를 CSS 변수 하나로 써 넣는 일만
          하고, 나머지 시각 표현은 전부 CSS 가 계산합니다.
        </p>
      </section>

      <ScrollStoryLite />

      <section className="container-ba flex min-h-[60svh] flex-col justify-center py-16">
        <h2 className="text-h2 text-ink">서사 구간을 빠져나왔습니다</h2>
        <p className="text-body-lg text-text-sub mt-4 max-w-2xl">
          <code>/lab/story</code>(motion 판)와 번갈아 보시면서 움직임 차이가 느껴지는지 확인해
          주세요. 차이가 없다면 42KB 를 아끼는 이쪽이 맞습니다.
        </p>
      </section>
    </>
  );
}
