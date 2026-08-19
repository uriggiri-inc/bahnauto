import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "반응형 가설검증",
  robots: { index: false, follow: false },
};

/** 원본 시그니처 영상 캔버스 규격 */
const CANVAS_W = 1920;
const HEADLINE_PX = 62;
const CAPTION_PX = 38;
const MIN_READABLE = 14;

const VIEWPORTS = [
  { w: 360, h: 720, name: "Galaxy S", note: "국내 안드로이드 최소권" },
  { w: 390, h: 780, name: "iPhone 14", note: "가장 흔한 모바일" },
  { w: 768, h: 700, name: "iPad 세로", note: "태블릿" },
  { w: 1280, h: 760, name: "노트북", note: "데스크톱 기준" },
];

function scaleAt(w: number) {
  return w / CANVAS_W;
}

export default function LabPage() {
  const breakEvenWidth = Math.ceil((MIN_READABLE / CAPTION_PX) * CANVAS_W);

  return (
    <main className="container-ba py-14">
      <header className="border-border border-b pb-10">
        <div className="text-label text-brand mb-4 uppercase">Hypothesis Lab</div>
        <h1 className="text-h1 text-ink mb-4">반응형 가설검증</h1>
        <p className="text-body-lg text-text-sub max-w-3xl">
          전체 구현 전에 두 가지 가설을 실측으로 검증합니다. 아래 프레임은 실제 라우트를 각 뷰포트
          폭으로 렌더한 것이라, 브라우저 창을 줄이는 것과 동일한 결과입니다.
        </p>
      </header>

      {/* ── 가설 1 ── */}
      <section className="border-border-light border-b py-12">
        <h2 className="text-h2 text-ink mb-3">
          가설 1 — 고정 16:9 캔버스는 모바일에서 자막을 읽을 수 없다
        </h2>
        <p className="text-body text-text-sub mb-8 max-w-3xl">
          시그니처 로고 영상은 <strong>1920×1080 고정 캔버스</strong>이고 텍스트가 SVG{" "}
          <code>foreignObject</code> 안에 있어 반응형 재배치가 불가능합니다. 뷰포트 폭에 맞춰 통째로
          축소되므로 폰트 크기도 같은 비율로 줄어듭니다.
        </p>

        <div className="border-border overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="bg-bg-subtle">
                {[
                  "뷰포트",
                  "스케일",
                  `헤드라인 ${HEADLINE_PX}px`,
                  `자막 ${CAPTION_PX}px`,
                  "판정",
                ].map((h) => (
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
              {VIEWPORTS.map((v) => {
                const s = scaleAt(v.w);
                const head = HEADLINE_PX * s;
                const cap = CAPTION_PX * s;
                const ok = cap >= MIN_READABLE;
                return (
                  <tr key={v.w} className="border-border-light border-b last:border-0">
                    <td className="text-body-sm text-ink px-4 py-3 font-semibold">
                      {v.w}px
                      <span className="text-caption text-text-sub ml-2 font-normal">{v.name}</span>
                    </td>
                    <td className="text-body-sm text-text-sub px-4 py-3 tabular-nums">
                      {s.toFixed(3)}
                    </td>
                    <td className="text-body-sm text-text-sub px-4 py-3 tabular-nums">
                      {head.toFixed(1)}px
                    </td>
                    <td
                      className={`text-body-sm px-4 py-3 font-semibold tabular-nums ${ok ? "text-success" : "text-danger"}`}
                    >
                      {cap.toFixed(1)}px
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-caption rounded-full px-2.5 py-1 font-semibold ${
                          ok ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
                        }`}
                      >
                        {ok ? "판독 가능" : "판독 불가"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-danger/30 bg-danger-bg mt-6 rounded-lg border p-5">
          <div className="text-body-sm text-danger mb-1 font-semibold">가설 1 — 참(검증됨)</div>
          <p className="text-body-sm text-ink">
            자막이 최소 가독선 {MIN_READABLE}px 에 닿으려면 뷰포트 폭이{" "}
            <strong>{breakEvenWidth.toLocaleString("ko-KR")}px 이상</strong> 이어야 합니다. 모바일
            전 구간이 미달입니다. 원본 영상을 히어로에 그대로 넣을 수 없습니다.
          </p>
        </div>
      </section>

      {/* ── 가설 2 ── */}
      <section className="border-border-light border-b py-12">
        <h2 className="text-h2 text-ink mb-3">가설 2 — 저장된 HTML은 성능 예산을 초과한다</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "babel.min.js", size: "3,137KB", bad: true },
            { label: "react-dom + react", size: "142KB", bad: true },
            { label: "PRD 초기 JS 예산", size: "200KB", bad: false },
          ].map((d) => (
            <div
              key={d.label}
              className={`rounded-lg border p-5 ${d.bad ? "border-danger/30 bg-danger-bg" : "border-success/30 bg-success-bg"}`}
            >
              <div className="text-caption text-text-sub">{d.label}</div>
              <div
                className={`text-h3 mt-1 tabular-nums ${d.bad ? "text-danger" : "text-success"}`}
              >
                {d.size}
              </div>
            </div>
          ))}
        </div>
        <div className="border-danger/30 bg-danger-bg mt-6 rounded-lg border p-5">
          <div className="text-body-sm text-danger mb-1 font-semibold">가설 2 — 참(검증됨)</div>
          <p className="text-body-sm text-ink">
            저장 HTML은 Claude Design 런타임에 의존해 <strong>예산의 약 16배</strong>를 소비합니다.
            히어로에 배치하면 LCP 2.5초 목표 달성이 불가능합니다.
          </p>
        </div>
      </section>

      {/* ── 대안 검증 ── */}
      <section className="py-12">
        <h2 className="text-h2 text-ink mb-3">대안 — 경량 재구현 히어로</h2>
        <p className="text-body text-text-sub mb-8 max-w-3xl">
          영상 씬 1~3의 링 드로잉 모션만 발췌해 <strong>순수 SVG + CSS(JS 0바이트)</strong> 로
          재구현하고, 텍스트는 캔버스 밖 실제 DOM 에 두어 브레이크포인트마다 재배치되게 했습니다.
          아래에서 각 폭의 실제 렌더를 확인하세요.
        </p>

        <div className="flex flex-col gap-10">
          {VIEWPORTS.map((v) => (
            <figure key={v.w} className="min-w-0">
              <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-h4 text-ink">{v.name}</span>
                <span className="text-body-sm text-text-sub tabular-nums">
                  {v.w} × {v.h}
                </span>
                <span className="text-caption text-text-muted">{v.note}</span>
              </figcaption>
              <div className="border-border bg-bg-subtle overflow-x-auto rounded-lg border p-3">
                <iframe
                  src="/lab/hero"
                  title={`히어로 시안 — ${v.name} ${v.w}px`}
                  width={v.w}
                  height={v.h}
                  className="border-border block rounded-md border bg-white"
                  style={{ minWidth: v.w }}
                />
              </div>
            </figure>
          ))}
        </div>

        <div className="border-success/30 bg-success-bg mt-8 rounded-lg border p-5">
          <div className="text-body-sm text-success mb-2 font-semibold">확인 항목</div>
          <ul className="text-body-sm text-ink list-disc space-y-1.5 pl-5">
            <li>360px 에서 헤드라인이 단어 중간에 잘리지 않는가 (word-break: keep-all)</li>
            <li>CTA 두 개가 모바일에서 세로로 쌓이고 각각 최소 높이 52px 를 유지하는가</li>
            <li>플로팅 카드가 모바일에서 겹치지 않고 문서 흐름으로 내려오는가</li>
            <li>가로 스크롤이 발생하지 않는가</li>
            <li>링 애니메이션이 1회만 재생되고 멈추는가</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
