/**
 * 폼 제출 결과 — 상담 신청과 매니저 지원이 공유한다.
 *
 * 서버 액션 파일에 두지 않고 따로 뺀 이유: `"use server"` 모듈은 정적 내보내기
 * 빌드에서 통째로 교체되는데, 타입까지 거기 있으면 교체본이 타입을 다시 정의해야 한다.
 * 그러면 두 정의가 어긋날 수 있다.
 */
export type SubmitResult =
  { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string> };
