import raw from "./news.json";

/**
 * 공지사항 — **노션이 원본, `news.json` 이 사이트가 읽는 파일**.
 *
 * ── 왜 두 곳인가 ──
 * ```
 * 노션 DB  ──(빌드 직전 scripts/fetch-news.mjs)──▶  src/content/news.json  ──▶  /news
 *                                                        ▲
 *                                     노션을 못 읽으면 이 파일이 그대로 쓰인다
 * ```
 * 방문자는 노션을 불러오지 않는다. 빌드 때 값이 페이지에 **박혀서** 나가므로
 * 노션이 멈춰도 사이트는 멀쩡하고 속도도 정적 페이지 그대로다.
 *
 * `news.json` 은 저장소에 커밋된다. 그래서 노션 장애·토큰 만료로 읽기가
 * 실패해도 **마지막으로 성공한 목록**이 배포된다. 공지사항이 텅 빈 채로
 * 나가는 것이 가장 나쁜 결과다.
 *
 * ⚠️ 커밋된 `news.json` 은 시간이 지나면 노션과 어긋난다. **정본은 노션**이고
 *    이 파일은 안전망이다. 손으로 고치지 않는다 — 고치면 다음 빌드에서
 *    노션 값으로 덮인다.
 *
 * ── `dummy.ts` 에서 떼어낸 이유 ──
 * 원래 `DUMMY_NEWS` 였다. 실제 공지는 **샘플 데이터가 아니다** — 요금·실적처럼
 * `DUMMY_CONTENT` 게이트로 가릴 대상이 아니고, 게이트를 끄는 날 함께 사라져도
 * 안 된다. 그래서 별도 파일로 옮겼다(2026-08-18).
 */

export type NewsCategory = "공지" | "서비스" | "이벤트" | "안내";

export type NewsPost = {
  /** 노션 페이지 id. 노션 연결 전 임시 글은 `n-1` 같은 값이다 */
  id: string;
  /** `YYYY-MM-DD`. 화면 표시와 정렬에 함께 쓴다 */
  date: string;
  category: NewsCategory;
  title: string;
  /** 목록에 보이는 한두 줄 */
  summary: string;
};

/**
 * 최신순으로 정렬해 돌려준다.
 *
 * 노션 쪽에서도 정렬해 받지만 여기서 한 번 더 한다 — 손으로 고친 `news.json`
 * 이나 옛 안전망 파일이 순서가 뒤엉킨 상태일 수 있다. 화면 순서를 데이터
 * 제공자에게 의존하지 않는다.
 */
export const NEWS: readonly NewsPost[] = (raw as NewsPost[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));
