import type { Shot } from "@/components/marketing/ScreenStack";

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
