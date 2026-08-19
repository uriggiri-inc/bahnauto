import { cn } from "@/lib/cn";

/**
 * 히어로의 앱 상태 알림 카드.
 *
 * ── 폭 계산이 이 컴포넌트의 전부다 ──
 * 1차 구현에서 제목("출근 확인 완료")과 설명이 전부 두세 줄로 접히고 카드 높이가
 * 제각각이 됐다. 원인은 취향이 아니라 산수였다. viewport 1280px 기준:
 *
 *   container-ba 1120 − 그리드 gap 56 = 1064 → 우측 컬럼 1064 × 1.05/2 = 558px
 *   558 − 폰 330 − gap 16 = 212px 가 레일 폭
 *   212 − 패딩 32 − 테두리 2 = 178px 가 카드 내부
 *   설명은 아이콘(28) + gap(10) 만큼 들여써서 **가용 140px**
 *
 * "고객센터 1차 처리 후 정리" 는 약 163px 이라 140px 안에 들어갈 방법이 없었다.
 *
 * 그래서 세 가지를 동시에 바꿨다.
 *   1. 폰을 300px 로 줄여 레일을 **242px** 로 넓혔다 (카드 내부 208px)
 *   2. 설명을 제목과 같은 열에서 시작하게 해 들여쓰기 38px 를 되찾았다
 *   3. 문구를 12자 이내로 줄이고 `truncate` 를 걸었다
 *
 * `truncate` 가 핵심이다. 문구가 예상보다 길어져도 **줄이 늘지 않고 말줄임표로 끝난다** —
 * 즉 카드 높이가 제목 1줄 + 설명 1줄로 고정되므로 다섯 장의 높이가 항상 같다.
 * 나중에 문구를 고치는 사람이 길이를 잘못 잡아도 레이아웃은 무너지지 않는다.
 *
 * ── xl 미만 ──
 * 우측 컬럼(lg 에서 421px)에 2열로 넣으면 카드가 204px 로 더 좁아진다.
 * 그래서 레일을 포기하고 **컨테이너 전체 폭을 쓰는 행**으로 내린다(변형 `row`).
 *
 * ── 모션 ──
 * 히어로는 LCP 요소다 — 모션 라이브러리를 쓰지 않는다(디자인 시스템 규정).
 * 등장만 CSS 로 순차 지연시킨다. 세로 표류(.ba-float)는 뺐다 —
 * 카드가 같은 크기로 정렬된 지금은 위아래로 흔들리면 정렬이 어긋나 보인다.
 *
 * ⚠️ 카드 문구에 매장 데이터를 지어내지 않는다.
 * "우유 2박스", "09:02" 같은 값은 실제처럼 읽히지만 근거가 없다(REVIEW-001 F-9 ·
 * PRD §13-B5). 대신 **동작 방식**을 쓴다 — PRD §7.2 에서 확인된 사실이다.
 */

type Tone = "success" | "brand" | "warning";

type StatusCard = {
  key: string;
  /** 전부 7자로 맞춘다 — 길이가 같아야 다섯 장이 한 벌로 읽힌다 */
  title: string;
  /** 12자 이내. 넘으면 truncate 되어 말줄임표가 된다 */
  detail: string;
  tone: Tone;
  icon: React.ReactNode;
};

const DOT: Record<Tone, string> = {
  success: "bg-success",
  brand: "bg-brand",
  warning: "bg-warning",
};

const DOT_VAR: Record<Tone, string> = {
  success: "#16a34a",
  brand: "#004acc",
  warning: "#d97706",
};

/** 공통 stroke 아이콘 — 인라인 SVG 라 JS 0바이트다 */
function Ico({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {d.split("|").map((seg) => (
        <path key={seg} d={seg} />
      ))}
    </svg>
  );
}

const CARDS: StatusCard[] = [
  {
    key: "in",
    title: "출근 확인 완료",
    detail: "단말기 촬영 인식",
    tone: "success",
    icon: <Ico d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4|M10 17l5-5-5-5|M15 12H3" />,
  },
  {
    key: "done",
    title: "오늘 관리 완료",
    detail: "항목별 사진 첨부",
    tone: "success",
    icon: <Ico d="M9 11l3 3L22 4|M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  },
  {
    key: "order",
    title: "발주 확인 완료",
    detail: "작성·검토·수령·완료",
    tone: "brand",
    icon: <Ico d="M16 16h6M19 13v6|M21 10V7l-9-5-9 5v10l9 5 3.5-1.94|M3 7l9 5 9-5|M12 12v10" />,
  },
  {
    key: "ask",
    title: "문의 접수 완료",
    detail: "고객센터 1차 처리",
    tone: "brand",
    icon: <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
  {
    key: "out",
    title: "퇴근 확인 완료",
    detail: "18:00~10:00 인정",
    tone: "warning",
    icon: <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9" />,
  },
];

function StatusItem({ card, index }: { card: StatusCard; index: number }) {
  return (
    <div
      className={cn(
        "ba-card-in",
        "border-border flex h-full items-center gap-3 rounded-lg border bg-white/95 p-4",
        "shadow-[var(--shadow-float)] backdrop-blur-[6px]",
      )}
      style={
        {
          "--card-delay": `${360 + index * 130}ms`,
          "--dot-color": DOT_VAR[card.tone],
        } as React.CSSProperties
      }
    >
      <span className="text-brand bg-brand-100 flex size-8 shrink-0 items-center justify-center rounded-full">
        {card.icon}
      </span>

      {/* min-w-0 이 없으면 flex 자식이 콘텐츠 폭만큼 벌어져 truncate 가 동작하지 않는다 */}
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-ink flex items-center gap-1.5 font-semibold">
          <span
            aria-hidden
            className={cn("ba-dot-ping size-1.5 shrink-0 rounded-full", DOT[card.tone])}
          />
          <span className="truncate">{card.title}</span>
        </p>
        {/* 제목과 같은 열에서 시작한다 — 아이콘 아래로 들여쓰면 가용 폭을 38px 잃는다 */}
        <p className="text-caption text-text-sub mt-0.5 truncate">{card.detail}</p>
      </div>
    </div>
  );
}

export type HeroStatusCardsProps = {
  /**
   * `rail` — xl 이상, 폰 오른쪽 세로 레일
   * `row`  — xl 미만, 컨테이너 전체 폭을 쓰는 행
   */
  variant: "rail" | "row";
};

export function HeroStatusCards({ variant }: HeroStatusCardsProps) {
  if (variant === "rail") {
    return (
      <div className="hidden xl:flex xl:min-w-0 xl:flex-1 xl:flex-col xl:justify-center xl:gap-3">
        {CARDS.map((c, i) => (
          <StatusItem key={c.key} card={c} index={i} />
        ))}
      </div>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:hidden">
      {CARDS.map((c, i) => (
        <li key={c.key}>
          <StatusItem card={c} index={i} />
        </li>
      ))}
    </ul>
  );
}
