"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * 반응형 동시 확인 화면.
 *
 * 브라우저 창을 줄였다 늘렸다 하며 확인하면 **한 번에 하나씩만** 볼 수 있고,
 * 방금 본 화면과 지금 화면을 나란히 비교할 수 없다. 여기서는 같은 페이지를
 * 여러 뷰포트 폭으로 **동시에** 렌더해 경계에서 무엇이 바뀌는지 눈으로 잡는다.
 *
 * iframe 은 실제 라우트를 그대로 띄운다 — 목업이 아니라 진짜 화면이므로
 * 스크롤·햄버거·하단 고정 CTA·스크롤 서사가 전부 프레임 안에서 동작한다.
 *
 * 축소는 `transform: scale` 이다. iframe 의 내부 뷰포트 폭은 `width` 속성이
 * 결정하고 scale 은 그리기만 줄이므로, **미디어쿼리는 원래 폭 기준으로 평가된다.**
 * (width 를 줄여서 축소하면 다른 브레이크포인트가 걸려 검증이 무의미해진다)
 *
 * 검색엔진에 노출하지 않는다 — 아래 metadata 는 클라이언트 컴포넌트라
 * export 할 수 없으므로 layout.tsx 에서 처리한다.
 */

type Device = {
  key: string;
  group: "모바일" | "태블릿" | "데스크톱";
  label: string;
  w: number;
  h: number;
  /** 이 폭에서 무엇이 달라지는지 — 확인 목적을 명시한다 */
  note: string;
};

const DEVICES: Device[] = [
  {
    key: "s360",
    group: "모바일",
    label: "360 × 800",
    w: 360,
    h: 800,
    note: "국내 안드로이드 최소권. 카드 1열, 버튼 세로 쌓임",
  },
  {
    key: "m390",
    group: "모바일",
    label: "390 × 844",
    w: 390,
    h: 844,
    note: "가장 흔한 모바일. 하단 고정 CTA 동작 구간",
  },
  {
    key: "t768",
    group: "태블릿",
    label: "768 × 1024",
    w: 768,
    h: 1024,
    note: "sm 이상 — 카드가 2열로 전환",
  },
  {
    key: "l1024",
    group: "태블릿",
    label: "1024 × 768",
    w: 1024,
    h: 768,
    note: "lg — 히어로 2열, 알림 카드는 아직 폰 아래 3열",
  },
  {
    key: "x1280",
    group: "데스크톱",
    label: "1280 × 800",
    w: 1280,
    h: 800,
    note: "xl — 알림 레일 등장, 하단 고정 CTA 사라짐",
  },
  {
    key: "x1440",
    group: "데스크톱",
    label: "1440 × 900",
    w: 1440,
    h: 900,
    note: "여유 폭. 컨테이너 1120px 로 고정되는지 확인",
  },
];

const ROUTES = [
  { path: "/", label: "홈" },
  { path: "/design-system", label: "디자인 시스템" },
];

const ZOOMS = [0.4, 0.5, 0.65, 0.8, 1];

export default function ResponsiveLabPage() {
  const [route, setRoute] = useState(ROUTES[0].path);
  const [zoom, setZoom] = useState(0.5);
  const [only, setOnly] = useState<string | null>(null);
  /** 값을 바꾸면 iframe 이 통째로 다시 마운트된다 = 전체 새로고침 */
  const [nonce, setNonce] = useState(0);

  const shown = only ? DEVICES.filter((d) => d.key === only) : DEVICES;

  return (
    <main className="bg-bg-subtle min-h-screen">
      {/* ── 조작부 ── */}
      <header className="border-border sticky top-0 z-10 border-b bg-white/95 backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-4 px-6 py-4">
          <div>
            <p className="text-label text-brand mb-1">Responsive Lab</p>
            <h1 className="text-h4 text-ink">모바일 · 태블릿 · PC 동시 확인</h1>
          </div>

          <Group label="페이지">
            {ROUTES.map((r) => (
              <Chip key={r.path} on={route === r.path} onClick={() => setRoute(r.path)}>
                {r.label}
              </Chip>
            ))}
          </Group>

          <Group label="배율">
            {ZOOMS.map((z) => (
              <Chip key={z} on={zoom === z} onClick={() => setZoom(z)}>
                {Math.round(z * 100)}%
              </Chip>
            ))}
          </Group>

          <Group label="보기">
            <Chip on={only === null} onClick={() => setOnly(null)}>
              전체
            </Chip>
            {DEVICES.map((d) => (
              <Chip key={d.key} on={only === d.key} onClick={() => setOnly(d.key)}>
                {d.w}
              </Chip>
            ))}
          </Group>

          <button
            type="button"
            onClick={() => setNonce((n) => n + 1)}
            className="text-body-sm text-brand border-border-strong hover:bg-brand-50 ease-standard ml-auto rounded-sm border px-3.5 py-2 font-semibold transition-colors duration-[160ms]"
          >
            전체 새로고침
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <p className="text-body-sm text-text-sub mb-6">
          프레임 안에서 스크롤·클릭이 그대로 동작합니다. 축소는 화면에 그리는 크기만 줄이므로
          미디어쿼리는 <strong className="text-ink">원래 폭 기준</strong>으로 평가됩니다.
        </p>

        {/* 폭이 큰 프레임이 있으므로 가로 스크롤을 허용한다 */}
        <div className="flex flex-wrap items-start gap-8">
          {shown.map((d) => (
            <figure key={d.key}>
              <figcaption className="mb-3">
                <p className="text-body-sm text-ink font-semibold">
                  {d.group} · {d.label}
                </p>
                <p className="text-caption text-text-sub mt-1 max-w-[38ch]">{d.note}</p>
              </figcaption>

              {/*
                바깥 상자는 **축소된 크기**를 차지해야 한다. scale 은 레이아웃 공간을
                바꾸지 않으므로, 여기서 명시하지 않으면 프레임끼리 겹친다.
              */}
              <div
                className="border-border-strong overflow-hidden rounded-lg border bg-white shadow-[var(--shadow-card)]"
                style={{ width: d.w * zoom, height: d.h * zoom }}
              >
                <iframe
                  key={`${d.key}-${route}-${nonce}`}
                  src={route}
                  title={`${d.group} ${d.label} 미리보기`}
                  width={d.w}
                  height={d.h}
                  className="block border-0"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                  }}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption text-text-sub mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "text-caption ease-standard rounded-sm border px-3 py-1.5 font-semibold",
        "transition-colors duration-[160ms]",
        on
          ? "border-brand bg-brand text-white"
          : "border-border text-text-sub hover:border-border-strong hover:text-brand bg-white",
      )}
    >
      {children}
    </button>
  );
}
