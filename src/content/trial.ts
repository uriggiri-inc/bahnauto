/**
 * 무료체험 도착지 — **반오토 웹버전 대시보드 주소 한 곳**.
 *
 * 신청 완료 화면(`/trial/complete`)과 그 외 체험을 여는 자리가 전부 이 상수를
 * 본다. 주소가 바뀔 때 화면을 뒤지지 않으려고 분리해 뒀다.
 *
 * ⚠️ 외부 도메인이다. 링크로 이동만 하므로(스크립트·fetch 아님) CSP 허용
 *    목록 대상은 아니지만, `target="_blank"` 로 열 때는 예외 없이
 *    `rel="noopener noreferrer"` 를 붙인다.
 *
 * ⚠️ 이 주소는 임시 호스팅(vercel.app)이다. 자체 도메인이 확정되면 여기만 고친다.
 */
export const TRIAL_APP_URL = "https://uri-manager.vercel.app/";
