/**
 * 홈 화면 구성 정본 — **`/lab/editor` 가 이 파일을 고쳐 쓴다.**
 *
 * 섹션의 순서·표시 여부·문구·크기 토큰이 전부 여기 모여 있다. `page.tsx` 는
 * 이 배열을 위에서부터 그리기만 한다. 그래서 구성을 바꾸는 데 JSX 를 건드릴
 * 필요가 없다.
 *
 * ── 손으로 고쳐도 된다 ──
 * 편집기를 거치지 않고 이 파일을 직접 수정해도 똑같이 동작한다. 편집기는
 * 같은 구조를 GUI 로 만들어 줄 뿐이다.
 *
 * ── 자유 픽셀값을 두지 않는 이유 ──
 * 크기·여백·배경은 전부 **정해진 토큰 중 하나**다(`titleSize`, `padY`, `bg`).
 * 임의 px 을 허용하면 1920px 에서 맞춘 값이 390px 에서 깨진다. 반응형 배율은
 * `globals.css` 의 `clamp()` 토큰이 이미 처리하고 있으므로, 여기서는 "어느
 * 단계인가" 만 고른다.
 *
 * ⚠️ 편집기가 이 파일을 통째로 다시 쓴다. **직접 수정할 때도 아래 형식을
 *    유지한다** — 주석과 타입 선언은 보존되고 `HOME_CONFIG` 값만 교체된다.
 */

/* ─── 스타일 토큰 (편집기 드롭다운의 선택지와 1:1) ───────────── */

/** 섹션 제목 크기. globals.css 의 타이포 토큰 이름과 같다 */
export const TITLE_SIZES = ["display", "h1", "h2", "h3"] as const;
export type TitleSize = (typeof TITLE_SIZES)[number];

/** 위아래 여백. `--section-py` 를 기준으로 한 배율 */
export const PAD_YS = ["sm", "md", "lg"] as const;
export type PadY = (typeof PAD_YS)[number];

/** 섹션 배경 */
export const BGS = ["white", "subtle", "tint", "ink", "brand"] as const;
export type Bg = (typeof BGS)[number];

export const ALIGNS = ["left", "center"] as const;
export type Align = (typeof ALIGNS)[number];

/** 카드 격자의 열 수 (lg 이상 기준) */
export const COLS = [2, 3, 4] as const;
export type Cols = (typeof COLS)[number];

/**
 * 섹션 종류.
 *
 *   builtin — 전용 컴포넌트가 붙어 있다. 추가·삭제는 되지만 내부 구조는
 *             편집기에서 바꾸지 않는다(문구와 스타일만 바뀐다)
 *   generic — 편집기에서 **새로 만들 수 있는** 범용 틀
 */
export const BUILTIN_KINDS = [
  "hero",
  "pains",
  "beforeAfter",
  "why",
  "features",
  "pricing",
  "reviews",
  "process",
  "contact",
] as const;

export const GENERIC_KINDS = ["text", "cards", "twoCol"] as const;

export type SectionKind = (typeof BUILTIN_KINDS)[number] | (typeof GENERIC_KINDS)[number];

export type SectionStyle = {
  titleSize: TitleSize;
  padY: PadY;
  bg: Bg;
  align: Align;
  /** cards 종류에서만 쓰인다 */
  cols?: Cols;
};

export type SectionText = {
  /** 제목 위 작은 라벨 */
  label?: string;
  title?: string;
  /** 제목 아래 설명 */
  lead?: string;
};

/** generic 틀이 그리는 항목 */
export type SectionItem = {
  id: string;
  title: string;
  body: string;
};

export type HomeSection = {
  /** DOM 앵커이자 SNB 링크. 영문 소문자·하이픈만 */
  id: string;
  /** SNB 에 표시되는 짧은 이름 */
  navLabel: string;
  kind: SectionKind;
  /** 끄면 화면에서도 SNB 에서도 사라진다. 값은 남는다 */
  enabled: boolean;
  /** SNB 에 노출할지. 히어로처럼 목차에 넣을 필요 없는 섹션은 false */
  inNav: boolean;
  text: SectionText;
  style: SectionStyle;
  /** generic 종류가 쓰는 항목들 */
  items?: SectionItem[];
};

export type HomeConfig = {
  /** 편집기가 저장할 때마다 올린다. 되돌릴 때 기준점이 된다 */
  revision: number;
  sections: HomeSection[];
};

/* ─── 구성 ────────────────────────────────────────────────────
   ⚠️ 아래 HOME_CONFIG 는 편집기가 통째로 교체한다.            */

export const HOME_CONFIG: HomeConfig = {
  revision: 1,
  sections: [
    {
      id: "hero",
      navLabel: "홈",
      kind: "hero",
      enabled: true,
      inNav: false,
      text: {
        label: "무인매장 위탁 관리",
        lead: "출퇴근확인부터 마케팅까지, 이제 반오토에 맡기세요.",
      },
      style: { titleSize: "display", padY: "lg", bg: "white", align: "center" },
    },
    {
      id: "problem",
      navLabel: "문제제기",
      // 기획 확정(2026-08-14): 페인 카드 4장 → **한 화면을 꽉 채우는 문제 패널 5장**.
      // 중간에 핀 스크롤 서사를 한 판 거쳤다가 폐기했다 — 사용자 확정으로
      // **스크롤 애니메이션을 쓰지 않는다**(읽는 속도를 화면이 정하면 안 된다).
      // `kind` 이름은 그대로 두었다(편집기 선택지·기존 설정 호환). `page.tsx` 가
      // 이 종류만 껍데기 없이 `ProblemStory` 로 그린다 — 문제 데이터는 그 파일에 있다.
      // 리드는 비웠다. 패널이 상황·불편·손실을 직접 말하므로 리드가 있으면 같은 말을 두 번 한다.
      // `style` 은 이 종류에서 쓰이지 않는다(배경·여백을 컴포넌트가 직접 정한다).
      kind: "pains",
      enabled: true,
      inNav: true,
      text: {
        label: "무인매장의 현실",
        title: "무인이라는 말은 손님에게만 해당됩니다",
      },
      style: { titleSize: "h1", padY: "md", bg: "subtle", align: "left", cols: 4 },
    },
    {
      id: "before-after",
      navLabel: "관리 전후",
      kind: "beforeAfter",
      // 기획 확정(2026-08-14): 전면 교체 시안에 이 섹션이 없다. 다만 **삭제가 아니라
      // 보류**다 — 사진 자산이 확정되면 되살린다. 그래서 컴포넌트·문구는 그대로 두고
      // 여기 한 줄만 내린다. 화면에서도 SNB 에서도 함께 사라진다.
      enabled: false,
      inNav: false,
      text: {
        label: "관리 전후",
        title: "설명보다 빠른 건 직접 보시는 겁니다",
        lead: "왼쪽이 관리 전, 오른쪽이 관리 후입니다. 가운데 손잡이를 좌우로 밀어보세요. 같은 매장, 같은 각도에서 촬영한 기록입니다.",
      },
      style: { titleSize: "h1", padY: "md", bg: "white", align: "left" },
    },
    {
      id: "why",
      navLabel: "출시 이유",
      kind: "why",
      enabled: true,
      inNav: true,
      text: {
        label: "반오토를 만든 이유",
        title: "우리도 매장을 합니다",
        lead: "반오토는 우리끼리(주)가 직영 무인키즈카페를 운영하며 만든 관리 체계입니다. 체크리스트도, 앱도, 매일 무엇이 문제가 되는지 겪으면서 현장에서 나왔습니다.",
      },
      style: { titleSize: "h1", padY: "md", bg: "white", align: "left", cols: 3 },
    },
    {
      id: "features",
      navLabel: "주요기능",
      kind: "features",
      enabled: true,
      inNav: true,
      text: {
        label: "주요기능",
        title: "여덟 가지를 하나의 기준으로 묶어 관리합니다",
        lead: "필요한 만큼만 고르실 수 있습니다. 아래 요금제가 이 여덟 가지를 어떻게 묶는지 보여드립니다.",
      },
      style: { titleSize: "h1", padY: "md", bg: "subtle", align: "left", cols: 4 },
    },
    {
      id: "pricing",
      navLabel: "요금",
      kind: "pricing",
      enabled: true,
      inNav: true,
      text: {
        label: "요금 안내",
        title: "맡기는 범위만큼만 지불하세요",
        lead: "세 가지 요금제로 나뉩니다. 어디까지 맡기실지에 따라 고르시면 됩니다.",
      },
      style: { titleSize: "h1", padY: "md", bg: "white", align: "left" },
    },
    // 기획 확정(2026-08-14): 도입 절차가 후기보다 위로 온다. 요금을 본 사람의
    // 다음 질문은 "그래서 어떻게 시작하나"이고, 후기는 그 답을 뒷받침하는
    // 자리이기 때문이다. 배경(white ↔ subtle)은 자리와 함께 옮겨 두 섹션이
    // 나란히 같은 색으로 붙지 않게 한다.
    {
      id: "process",
      navLabel: "도입 절차",
      kind: "process",
      enabled: true,
      inNav: true,
      text: { label: "도입 절차", title: "상담부터 관리 시작까지" },
      style: { titleSize: "h1", padY: "md", bg: "subtle", align: "left" },
    },
    {
      id: "reviews",
      navLabel: "후기",
      kind: "reviews",
      enabled: true,
      inNav: true,
      text: {
        label: "점주 후기",
        title: "먼저 쓰고 계신 분들의 이야기",
        lead: "우리끼리 무인키즈카페에서 반오토를 이용 중인 점주들의 후기입니다.",
      },
      style: { titleSize: "h1", padY: "md", bg: "white", align: "left" },
    },
    {
      id: "contact",
      navLabel: "상담 신청",
      kind: "contact",
      enabled: true,
      inNav: true,
      text: {
        label: "도입 상담",
        // 기획 확정 B안. `/contact` 히어로와 **같은 문장**을 쓴다 —
        // 두 화면에서 말이 달라지면 같은 신청인지 알 수 없다.
        title: "반오토에 맡기고 싶으시다면, 확인해드리겠습니다.",
        lead: "전화, 카카오톡, 채널톡 어디로든 편하게 문의하실 수 있습니다. 매장 규모와 운영 상황을 알려주시면 필요한 관리 범위와 구독 플랜을 안내해 드립니다. 상담은 무료이며, 도입을 강요하지 않습니다.",
      },
      style: { titleSize: "h1", padY: "md", bg: "tint", align: "left" },
    },
  ],
};

/** 켜져 있는 섹션만, 설정 순서대로 */
export const activeSections = () => HOME_CONFIG.sections.filter((s) => s.enabled);

/** SNB 에 들어갈 항목 */
export const navSections = () => activeSections().filter((s) => s.inNav);
