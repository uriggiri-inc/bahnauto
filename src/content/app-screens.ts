import type { Shot } from "@/components/marketing/ScreenStack";
import type { CarouselSlide } from "@/components/marketing/ScreenCarousel";

/**
 * 앱 화면 캡처 정본 — 경로·설명·**실제 픽셀 크기**를 한 곳에 모은다.
 *
 * ── 크기를 왜 코드에 적어 두는가 ──
 * `ScreenStack` 은 화면비를 강제하지 않고 `width`/`height` 로 비율을 잡는다.
 * 그래서 **여기 적힌 숫자가 실제 파일과 달라지면 화면이 찌그러진다.** 페이지마다
 * 숫자를 손으로 적으면 언젠가 어긋나므로 한 파일에 모아 둔다.
 *
 * 값은 `public/app/*.webp` 를 실측한 것이다. 캡처를 교체할 때는 **크기도 함께**
 * 고친다 — 해상도가 바뀌는 경우가 흔하다(실제로 리포트만 1910×861 이고 나머지
 * PC 는 2000×1093 이다).
 *
 * ── 마스킹 상태 ──
 * 전부 개인정보 마스킹을 거친 파일이다(원본은 저장소 밖 `웹앱 이미지 캡처/`).
 * 가린 것: 로그인 사용자 실명 · 이메일 3건 · 지점명 · 게시판 작성자 실명.
 * 남긴 것: 역할명(매장 관리자·운영팀 슈퍼바이저·인사팀), `점주`/`매장 매니저`
 * 라벨, 푸터의 사업자 정보(이미 공개된 값).
 *
 * ⚠️ **마스킹하지 않은 캡처를 여기에 넣지 않는다.** 이 파일에 경로가 적히면
 *    그대로 배포된다.
 *
 * ⚠️ 데이터가 비어 있는 캡처는 홍보 효과가 없다. `report-pc` 만 완료율 50%·
 *    출근 2명 등 실제 데이터가 채워진 날짜(7/29)의 화면이고, 나머지는 활동이
 *    적은 날이다. 채워진 캡처가 들어오면 교체한다.
 */

const PC = { width: 2000, height: 1093 } as const;
const MOBILE = { width: 756, height: 1466 } as const;

/** 정의만 모아 두고 아래에서 `Shot` 으로 조립한다 */
function pc(file: string, alt: string, size: { width: number; height: number } = PC): Shot {
  return { src: `/app/${file}.webp`, alt, ...size };
}
function mobile(file: string, alt: string): Shot {
  return { src: `/app/${file}.webp`, alt, ...MOBILE };
}
/** 2026-08-26 이후 캡처는 해상도가 제각각이라 크기를 직접 준다 */
function shot(file: string, alt: string, width: number, height: number): Shot {
  return { src: `/app/${file}.webp`, alt, width, height };
}

export const SCREENS = {
  /** 데일리 리포트 — **유일하게 데이터가 채워진 캡처**(7/29, 완료율 50%) */
  reportPc: pc("report-pc", "반오토 앱 오늘의 리포트 화면 (PC)", { width: 1910, height: 861 }),
  reportMobile: mobile("report-mobile", "반오토 앱 오늘의 리포트 화면 (모바일)"),

  dashboardPc: pc("dashboard-pc", "반오토 앱 대시보드 화면 (PC)"),

  checklistPc: pc("checklist-pc", "반오토 앱 업무 체크리스트 화면 (PC)"),
  checklistMobile: mobile("checklist-mobile", "반오토 앱 업무 체크리스트 화면 (모바일)"),
  checklistPhotoMobile: mobile("checklist-photo-mobile", "체크리스트 항목별 사진 기록 화면"),

  attendanceMobile: mobile("attendance-mobile", "반오토 앱 출퇴근관리 화면 (모바일)"),
  attendancePhotoMobile: mobile("attendance-photo-mobile", "출퇴근 사진 촬영 인증 화면"),

  inventoryPc: pc("inventory-pc", "반오토 앱 재고관리 화면 (PC)"),
  inventoryMobile: mobile("inventory-mobile", "반오토 앱 재고관리 화면 (모바일)"),

  orderingMobile: mobile("ordering-mobile", "반오토 앱 발주요청 화면 (모바일)"),

  boardPc: pc("board-pc", "반오토 앱 게시판 화면 (PC)"),
  boardMobile: mobile("board-mobile", "반오토 앱 게시판 화면 (모바일)"),

  manualPc: pc("manual-pc", "반오토 앱 매뉴얼 화면 (PC)"),
  manualMobile: mobile("manual-mobile", "반오토 앱 매뉴얼 화면 (모바일)"),

  /* ── 2026-08-26 담당자 전달분 ─────────────────────────────────
     빈 공간이 화면 절반을 차지하는 모바일 캡처는 목록 끝까지 자른 뒤 하단 탭바를
     붙여 이었다(짧은 기기에서 실제로 보이는 모습이다). 그래서 세로 길이가
     제각각이다 — `shot()` 으로 실측값을 그대로 준다. */

  // 매니저 지원센터
  supportBoardPc: shot("support-board-pc", "본사·매니저 공통 게시판 (PC)", 1600, 720),
  supportBoardMobile: shot("support-board-mobile", "본사·매니저 공통 게시판 (모바일)", 700, 1018),
  supportChatWidget: shot("support-chat-widget", "앱 안에서 여는 문의 위젯", 537, 598),
  supportChatThread: shot("support-chat-thread", "AI 챗봇이 답변한 문의 대화", 700, 1146),

  // 경영지원
  opsStockPc: shot("ops-stock-pc", "유통기한·재고 현황 화면 (PC)", 1600, 723),
  opsStockMobile: shot("ops-stock-mobile", "유통기한·재고 현황 화면 (모바일)", 700, 1521),
  opsOrderPc: shot("ops-order-pc", "발주 요청 목록과 진행 단계 (PC)", 1600, 725),
  opsOrderMobile: shot("ops-order-mobile", "발주 요청 목록과 진행 단계 (모바일)", 700, 1521),
  opsOrderDetailPc: shot("ops-order-detail-pc", "발주 요청 상세 · 품목 목록 (PC)", 733, 816),
  opsOrderDetailMobile: shot(
    "ops-order-detail-mobile",
    "발주 요청 상세 · 품목 목록 (모바일)",
    700,
    1521,
  ),
  opsSettleMobile: shot("ops-settle-mobile", "정산 요청 목록 (모바일)", 700, 819),
  opsSettleDetailMobile: shot(
    "ops-settle-detail-mobile",
    "정산 요청 상세 · 영수증·입금 증빙 (모바일)",
    700,
    1521,
  ),

  // 인허가·서류 관리 (2026-08-27 전달분)
  docsStatusPc: shot("docs-status-pc", "인허가·계약 만료 현황 화면", 592, 723),
  docsUploadPc: shot("docs-upload-pc", "서류 등록 화면", 596, 722),

  // 네이버 플레이스 관리 (2026-08-27 전달분)
  placeSmartplacePc: shot("place-smartplace-pc", "네이버 스마트플레이스 관리 화면", 876, 891),

  // 매출관리·홍보지원
  revenueReport: shot("revenue-report", "월간 매출 리포트 (가맹점명·금액 가림)", 1596, 727),
} as const;

/**
 * PC·모바일 한 쌍 — `ScreenStack` 에 그대로 넘긴다.
 *
 * 쌍이 없는 화면(대시보드·경영지원)은 여기 없다. 짝이 없는 것을 억지로 붙이면
 * 서로 다른 기능을 한 화면처럼 보여주게 된다.
 */
export const SCREEN_PAIRS = {
  report: { pc: SCREENS.reportPc, mobile: SCREENS.reportMobile },
  checklist: { pc: SCREENS.checklistPc, mobile: SCREENS.checklistMobile },
  inventory: { pc: SCREENS.inventoryPc, mobile: SCREENS.inventoryMobile },
  board: { pc: SCREENS.boardPc, mobile: SCREENS.boardMobile },
  manual: { pc: SCREENS.manualPc, mobile: SCREENS.manualMobile },
} as const;

/**
 * 기능별 화면 슬라이드 — `ScreenCarousel` 에 그대로 넘긴다.
 *
 * ── 왜 여기 있나 ──
 * 이 파일이 캡처의 경로·크기·설명을 이미 들고 있다. 슬라이드 구성은 "어느 캡처를
 * 어떻게 묶는가" 이므로 자산 쪽에 두는 것이 맞다. 카피(제목·리드)는
 * `feature-details.ts` 가 계속 정본이다.
 *
 * ── 묶는 규칙 ──
 * **한 주제 = 한 슬라이드.** 같은 주제의 PC·모바일은 반드시 같은 슬라이드에
 * 넣는다(사용자 지시 2026-08-26). 떼어 놓으면 서로 다른 기능처럼 읽힌다.
 *
 * `desc` 와 `note` 는 장식이 아니다 — 캡처만 보고는 무슨 화면인지 알 수 없으므로
 * **화면마다 무엇을 보는 자리인지** 적어 둔다.
 *
 * ── 2026-08-27 기능 7종 재편에 맞춰 키를 다시 붙였다 ──
 * 옛 `manager-support`·`docs` 슬라이드는 ① `dashboard` 로 합쳐졌고(그 두 기능이
 * 대시보드 안의 그룹이 되었다), 옛 `ops-support` 의 재고 슬라이드도 ① 로 왔다 —
 * 담당자 문서가 **재고 관리를 ① 의 항목**으로 적었기 때문이다. 발주·정산은
 * ⑤ `field-ops` 로 갔고, 옛 `place`·`revenue` 는 ③ `biz-support` 에 합쳤다.
 *
 * ⚠️ 챗봇 대화 캡처는 **매니저**가 체크리스트 수정 방법을 물은 화면이다. ④ 고객센터
 *    (매장 이용고객 응대)에 쓰면 다른 것을 보여주는 셈이라 ① 에 둔다. ④ 는 캡처가
 *    확보될 때까지 "실제 화면" 섹션 없이 나간다.
 *
 * 캡처가 아직 없는 기능(② 기본서비스 · ④ 고객센터 · ⑥ 방문관리서비스 ·
 * ⑦ A/S 바로출동서비스)은 여기 없다. ⑥·⑦ 은 오픈 예정 알림만 걸려 있다
 * (`feature-details.ts` 의 `notice`).
 */
export const FEATURE_CAROUSELS: Record<string, readonly CarouselSlide[]> = {
  /* ① 운영 대시보드 — 세 기능이 합쳐져 슬라이드가 일곱이다. 탭이 다섯을 넘으면
     `ScreenCarousel` 이 탭 줄을 감싸 두 줄로 내린다(가로 스크롤은 쓰지 않는다). */
  dashboard: [
    {
      id: "checklist",
      title: "업무 체크리스트",
      desc: [
        "매장에서 해야 할 일이 항목으로 내려오고,",
        "매니저가 사진을 붙여 완료를 증빙합니다.",
        "본사와 점주는 같은 목록을 PC에서 봅니다.",
      ],
      shots: [
        { shot: SCREENS.checklistPc, kind: "pc", note: "매장별 완료율과 항목 상태를 한눈에" },
        {
          shot: SCREENS.checklistMobile,
          kind: "mobile",
          note: "현장에서 항목을 체크하고 사진을 남깁니다",
        },
      ],
    },
    {
      id: "attendance",
      title: "출퇴근 관리",
      desc: [
        "출퇴근은 GPS·Wi-Fi·단말기 화면 촬영 중",
        "매장이 정한 방식으로 인증합니다.",
        "기록이 사진과 함께 남아 나중에 확인할 수 있습니다.",
      ],
      shots: [
        { shot: SCREENS.attendanceMobile, kind: "mobile", note: "출근·퇴근 기록과 근무 시간" },
        {
          shot: SCREENS.attendancePhotoMobile,
          kind: "mobile",
          badge: "사진 인증",
          note: "단말기 화면을 촬영해 근무를 증빙",
        },
      ],
    },
    {
      id: "stock",
      title: "재고 관리",
      desc: [
        "품목별 유통기한을 D-day로 세어",
        "폐기 대상과 임박 상품을 먼저 띄웁니다.",
        "매니저가 매장에서 확인하고, 본사는 같은 화면을 PC에서 봅니다.",
      ],
      shots: [
        {
          shot: SCREENS.opsStockPc,
          kind: "pc",
          note: "폐기 대상·임박·정상을 숫자로 요약하고 품목별로 나열",
        },
        { shot: SCREENS.opsStockMobile, kind: "mobile", note: "잔여일 순으로 정렬해 바로 확인" },
      ],
    },
    {
      id: "report",
      title: "데일리 리포트",
      desc: [
        "오늘 매장에서 무슨 일이 있었는지",
        "체크리스트 완료율·출근 인원·특이사항을 한 장으로 정리합니다.",
      ],
      shots: [
        { shot: SCREENS.reportPc, kind: "pc", note: "핵심 지표와 처리 내역·이번 달 누적" },
        { shot: SCREENS.reportMobile, kind: "mobile", note: "같은 리포트를 이동 중에 확인" },
      ],
    },
    {
      id: "support-board",
      title: "공통 게시판",
      desc: [
        "본사·점주·매니저가 같은 게시판에서 공지와 현장 이슈를 주고받습니다.",
        "카테고리로 나뉘어 있어 놓치는 글이 없고, 공지는 누가 확인했는지까지 남습니다.",
      ],
      shots: [
        {
          shot: SCREENS.supportBoardPc,
          kind: "pc",
          note: "카테고리·작성자·확인 인원을 한 화면에서 관리",
        },
        {
          shot: SCREENS.supportBoardMobile,
          kind: "mobile",
          note: "현장에서 바로 확인하고 글을 올립니다",
        },
      ],
    },
    {
      id: "support-chat",
      title: "챗봇 문의",
      desc: [
        "앱 안에서 바로 문의하면 AI가 먼저 답하고,",
        "해결되지 않으면 본사 담당자로 이어집니다.",
        "매니저가 전화를 기다리지 않아도 됩니다.",
      ],
      shots: [
        {
          shot: SCREENS.supportChatWidget,
          kind: "mobile",
          badge: "문의 위젯",
          note: "앱 어디서든 열리는 문의 창구",
        },
        {
          shot: SCREENS.supportChatThread,
          kind: "mobile",
          note: "체크리스트 수정 방법을 즉시 안내받은 실제 대화",
        },
      ],
    },
    {
      id: "docs",
      title: "인허가·서류",
      desc: [
        "소방·안전·보험·가맹계약의 만료일을 한 화면에 모아 D-day로 셉니다.",
        "보건증·자격증 같은 서류도 만료일과 함께 올려 둡니다.",
      ],
      shots: [
        {
          shot: SCREENS.docsStatusPc,
          kind: "pc",
          badge: "만료 현황",
          note: "항목별 만료일과 남은 날짜를 한 줄에",
        },
        {
          shot: SCREENS.docsUploadPc,
          kind: "pc",
          badge: "서류 등록",
          note: "서류명·유형·만료일·대상을 지정해 등록",
        },
      ],
    },
  ],

  /* ⑤ 현장 운영 지원 — 발주 대행과 실비 정산이 여기 온다 */
  "field-ops": [
    {
      id: "ops-order",
      title: "발주 요청",
      desc: [
        "재고 화면에서 그대로 발주로 넘어가고,",
        "작성 → 검토 → 수령 → 완료",
        "네 단계가 어디까지 왔는지 한 줄로 보입니다.",
      ],
      shots: [
        { shot: SCREENS.opsOrderPc, kind: "pc", note: "요청별 진행 단계와 항목 수·금액" },
        {
          shot: SCREENS.opsOrderMobile,
          kind: "mobile",
          note: "상태 필터로 대기·완료를 나눠 봅니다",
        },
      ],
    },
    {
      id: "ops-order-detail",
      title: "발주 상세",
      desc: [
        "요청 하나를 열면 품목·수량·단가와 유통기한, 보관 장소까지 함께 확인합니다.",
        "검토 단계에서 무엇을 승인하는지 분명해집니다.",
      ],
      shots: [
        { shot: SCREENS.opsOrderDetailPc, kind: "pc", note: "품목별 수량·단가·소계를 나열" },
        {
          shot: SCREENS.opsOrderDetailMobile,
          kind: "mobile",
          note: "같은 상세를 모바일에서 그대로 검토",
        },
      ],
    },
    {
      id: "ops-settle",
      title: "정산 요청",
      desc: [
        "매니저가 쓴 비용은 정산 요청으로 올라가고,",
        "작성 → 검토 → 입금 → 완료까지 기록됩니다.",
        "영수증과 입금 증빙을 같은 건에 붙입니다.",
      ],
      shots: [
        { shot: SCREENS.opsSettleMobile, kind: "mobile", note: "요청 목록과 처리 단계" },
        {
          shot: SCREENS.opsSettleDetailMobile,
          kind: "mobile",
          badge: "모바일 · 상세",
          note: "영수증 사진과 입금 사진을 건별로 보관",
        },
      ],
    },
  ],

  /* ③ 경영지원 — 옛 `place` + `revenue` */
  "biz-support": [
    {
      id: "place-smartplace",
      title: "스마트플레이스 관리",
      desc: [
        "예약 현황과 고객 응대, 리뷰와 방문 추이를",
        "반오토가 대신 확인하고 관리합니다.",
        "매장 정보와 새소식도 함께 올립니다.",
      ],
      shots: [
        {
          shot: SCREENS.placeSmartplacePc,
          kind: "pc",
          badge: "스마트플레이스",
          note: "예약 · 톡톡 문의 · 미답변 리뷰를 한 화면에서 확인",
        },
      ],
    },
    {
      id: "revenue-report",
      title: "월간 매출 리포트",
      desc: [
        /* 앞의 항목 나열을 굵게 — 무엇이 담기는지가 이 슬라이드의 핵심이다 */
        "**매출·지출·순이익 추이, 광고 대비 매출, 검색 노출과 리뷰, 예약 시간대**까지",
        "한 문서로 정리해 매달 드립니다.",
        "실제 리포트 화면이며 가맹점명과 금액만 가렸습니다.",
      ],
      shots: [
        {
          shot: SCREENS.revenueReport,
          kind: "pc",
          badge: "리포트",
          note: "요약 · 매출·지출 상세 · 마케팅 인사이트 · 고객 분석 네 개 탭",
        },
      ],
    },
  ],
};

/* ⚠️ `SCREENS` 중 어느 슬라이드에도 쓰이지 않는 것들 — `dashboardPc` ·
   `checklistPhotoMobile` · `inventoryPc` · `inventoryMobile` · `orderingMobile` ·
   `boardPc` · `boardMobile` · `manualPc` · `manualMobile` 이다. 지우지 않는 이유:
   `/system` 과 `/service` · `/careers` 가 이들을 직접 쓴다(재고는 옛 캡처보다
   `opsStock*` 이 최신이라 슬라이드에서만 교체했다). */
