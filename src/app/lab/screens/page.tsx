import type { Metadata } from "next";
import { ScreenStack } from "@/components/marketing/ScreenStack";

/**
 * 앱 화면 배치 비교 화면.
 *
 * ── 왜 별도 페이지인가 ──
 * `/design-system` 은 페이지가 길어서 이 섹션까지 스크롤해 내려가야 하고,
 * 배치 A 와 배치 B 를 **동시에** 볼 수 없다. 결정을 내리려면 나란히 놓고
 * 봐야 한다 — `/lab/responsive` 가 뷰포트를 나란히 놓는 것과 같은 이유다.
 *
 * 배치는 **B(나란히 · 밝은 배경)로 확정**됐다(2026-08-25). 이 페이지는 그 결정의
 * 근거로 남긴다 — 나중에 "왜 겹치지 않게 했나" 를 다시 묻게 되면 네 안을 나란히
 * 놓고 비교할 수 있다. 실제 페이지에는 B 만 쓴다.
 *
 * 캡처는 마스킹을 거친 실제 자산이다(`public/app/*.webp`).
 *
 * 검색엔진에 노출하지 않는다 — `/lab` 전체가 noindex 다.
 */

export const metadata: Metadata = {
  title: "앱 화면 배치 비교",
  robots: { index: false, follow: false },
};

/** 실측한 캡처 해상도. 비율 유지에 쓰이므로 원본 값을 그대로 넣는다 */
const PC = {
  src: "/app/report-pc.webp",
  alt: "반오토 앱 오늘의 리포트 화면 (PC)",
  width: 1910,
  height: 861,
};
const MOBILE = {
  src: "/app/checklist-mobile.webp",
  alt: "반오토 앱 업무 체크리스트 화면",
  width: 756,
  height: 1466,
};

function Case({
  no,
  title,
  note,
  onDark = false,
  children,
}: {
  no: string;
  title: string;
  note: string;
  onDark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-caption text-brand font-bold tracking-widest">{no}</span>
        <h2 className="text-h4 text-ink">{title}</h2>
      </div>
      <p className="text-body-sm text-text-sub mb-5 max-w-[62ch]">{note}</p>
      <div className={onDark ? "bg-ink rounded-2xl p-8 md:p-12" : ""}>{children}</div>
    </section>
  );
}

export default function LabScreensPage() {
  return (
    <div className="container-ba py-12 md:py-16">
      <header className="mb-14 max-w-[70ch]">
        <p className="text-caption text-brand mb-2 font-bold tracking-widest">LAB · SCREENS</p>
        <h1 className="text-h1 text-ink mb-4">앱 화면 배치 비교</h1>
        <p className="text-body text-text-sub">
          네 가지를 나란히 두었습니다. 공통점은 <strong>화면비를 강제하지 않는다</strong>는 것
          입니다 — 캡처 원본 비율을 그대로 쓰므로 어느 쪽도 잘리지 않습니다. 차이는 모바일 화면이 PC
          를 <strong>가리는지</strong>, 그리고 배경이 밝은지 어두운지뿐입니다.
        </p>
        <p className="text-body-sm text-text-sub mt-4">
          창 폭을 줄여 보세요. 좁아지면 나란히 배치는 세로로 쌓이고, 겹침 배치는 모바일이
          작아집니다.
        </p>
      </header>

      <Case
        no="A"
        title="겹침 · 밝은 배경"
        note="모바일이 PC 왼쪽 위로 올라앉습니다. 한 덩어리로 읽혀 밀도가 높지만 PC 사이드바(대시보드·출퇴근관리 등 메뉴)가 가려집니다."
      >
        <div className="max-w-[860px]">
          <ScreenStack pc={PC} mobile={MOBILE} />
        </div>
      </Case>

      <Case
        no="B ✓ 확정"
        title="나란히 · 밝은 배경"
        note="둘 다 온전히 보입니다. 사이드바 메뉴까지 보여줘야 할 때 유리하고, 대신 가로 폭을 더 씁니다."
      >
        <div className="max-w-[860px]">
          <ScreenStack layout="side" pc={PC} mobile={MOBILE} />
        </div>
      </Case>

      <Case
        no="C"
        title="겹침 · 어두운 배경"
        note="보내주신 참고 이미지에 가장 가까운 쪽입니다. 화면이 도드라져 임팩트가 큽니다. 다만 홈에서 어두운 섹션은 1~2회만 쓸 수 있어(브랜드 규칙) 어디에 쓸지 정해야 합니다."
        onDark
      >
        <div className="max-w-[760px]">
          <ScreenStack onDark pc={PC} mobile={MOBILE} />
        </div>
      </Case>

      <Case
        no="D"
        title="나란히 · 어두운 배경"
        note="어두운 배경의 임팩트와 가려지지 않는 장점을 함께 가져갑니다."
        onDark
      >
        <div className="max-w-[760px]">
          <ScreenStack layout="side" onDark pc={PC} mobile={MOBILE} />
        </div>
      </Case>

      <footer className="border-border text-body-sm text-text-sub max-w-[70ch] border-t pt-8">
        <p className="mb-3">
          <strong>넣지 않은 것</strong> — 참고 이미지의 <code>이번 달 인건비 18% 절감</code> 같은
          성과 배지는 근거 없이 쓰면 표시광고법 위반이라 자리조차 만들지 않았습니다. 기울기(3D 회전)
          도 넣지 않았습니다 — 참고 이미지는 기울여서 잘린 부분을 감추는데, 우리는 잘리지 않으므로
          필요가 없고 기울이면 글자가 더 안 읽힙니다.
        </p>
        <p>
          여기 쓰인 캡처는 <strong>배치 확인용 임시 자산</strong>입니다. 배치가 정해지면 이 페이지와
          임시 자산은 함께 지우고, 확정된 캡처로 실제 페이지에 넣습니다.
        </p>
      </footer>
    </div>
  );
}
