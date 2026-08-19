/**
 * 노션 공지사항 데이터베이스 → `src/content/news.json`
 *
 * 빌드 **직전**에 자동으로 돈다(`package.json` 의 `prebuild`·`prebuild:static`).
 * Cloudflare Pages 의 빌드 명령이 `npm run build` 이므로 대시보드에 따로
 * 설정할 것이 없다 — 기억에 의존하는 설정은 언젠가 어긋난다(scripts/DEPLOY.md).
 *
 * ── 새 패키지를 쓰지 않는다 ──
 * Node 22 의 내장 `fetch` 만 쓴다. 노션 SDK 를 넣으면 의존성이 하나 늘고,
 * 우리가 쓰는 것은 엔드포인트 하나뿐이다(../CLAUDE.md §1.2).
 *
 * ── 실패해도 배포를 막지 않는다 ──
 * 토큰이 없거나 노션을 못 읽으면 **`news.json` 을 건드리지 않고 그대로 끝낸다.**
 * 저장소에 커밋된 마지막 성공본이 그대로 배포된다. 대신 로그에 크게 남긴다 —
 * 조용한 실패가 가장 나쁘다. `process.exit(1)` 을 하지 않는 이유가 이것이다:
 * 공지 하나 때문에 사이트 전체 배포가 멈추면 손해가 더 크다.
 *
 * ── 시크릿 ──
 * `NOTION_TOKEN` · `NOTION_NEWS_DB_ID` 두 개를 환경변수로 받는다.
 * 로컬은 `.env.local`(gitignored), 배포는 Cloudflare 환경변수.
 * **이 파일에도, 저장소 어디에도 값을 적지 않는다**(../CLAUDE.md §1.1 S1).
 */

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "content", "news.json");

/**
 * 노션 API 버전. **바꿀 곳은 여기 한 줄이다.**
 * 노션이 이 버전을 내리면 아래 `QUERY_PATH` 와 함께 갱신한다 —
 * 신버전에서 데이터베이스 조회 경로가 바뀐 적이 있다.
 */
const NOTION_VERSION = "2022-06-28";
const API = "https://api.notion.com/v1";

/** 노션 DB 의 칸 이름. 노션에서 이름을 바꾸면 여기도 바꾼다 */
const FIELD = {
  title: "제목",
  status: "상태",
  date: "날짜",
  category: "분류",
  summary: "요약",
};

/** 이 상태인 글만 사이트에 나간다. 쓰다 만 글이 새어나가지 않게 하는 장치 */
const PUBLISHED = "게시완료";

/** 화면이 아는 분류. 노션에 없는 값이 들어오면 안내로 떨어뜨린다 */
const CATEGORIES = new Set(["공지", "서비스", "이벤트", "안내"]);

function warn(msg) {
  // 빌드 로그에서 눈에 걸리게 한다
  console.warn(`\n[fetch-news] ⚠ ${msg}\n[fetch-news] → news.json 을 건드리지 않고 넘어간다.\n`);
}

/** rich_text 배열 → 평문 */
function plain(rich) {
  if (!Array.isArray(rich)) return "";
  return rich
    .map((t) => t?.plain_text ?? "")
    .join("")
    .trim();
}

function toPost(page) {
  const p = page.properties ?? {};
  const title = plain(p[FIELD.title]?.title);
  const date = p[FIELD.date]?.date?.start ?? "";
  const rawCategory = p[FIELD.category]?.select?.name ?? "";
  const summary = plain(p[FIELD.summary]?.rich_text);

  // 제목·날짜가 없으면 화면에 빈 줄이 생긴다. 그런 글은 건너뛴다
  if (!title || !date) return null;

  return {
    id: page.id,
    // 노션 날짜는 `2026-08-04` 또는 `2026-08-04T09:00:00.000+09:00` 로 온다
    date: date.slice(0, 10),
    category: CATEGORIES.has(rawCategory) ? rawCategory : "안내",
    title,
    summary,
  };
}

async function queryAll(token, dbId) {
  const posts = [];
  let cursor;

  // 노션은 한 번에 최대 100건만 준다. 커서로 끝까지 따라간다
  do {
    const res = await fetch(`${API}/databases/${dbId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 100,
        start_cursor: cursor,
        filter: { property: FIELD.status, select: { equals: PUBLISHED } },
        sorts: [{ property: FIELD.date, direction: "descending" }],
      }),
    });

    if (!res.ok) {
      // 노션 오류 메시지를 그대로 보여준다 — 원인 파악이 이것 하나로 끝난다
      const body = await res.text();
      throw new Error(`노션 응답 ${res.status}: ${body.slice(0, 400)}`);
    }

    const json = await res.json();
    for (const page of json.results ?? []) {
      const post = toPost(page);
      if (post) posts.push(post);
    }
    cursor = json.has_more ? json.next_cursor : undefined;
  } while (cursor);

  return posts;
}

async function main() {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_NEWS_DB_ID;

  if (!token || !dbId) {
    // 아직 노션을 연결하지 않은 상태. 정상 경로다 — 경고만 남기고 넘어간다
    console.log(
      "[fetch-news] NOTION_TOKEN / NOTION_NEWS_DB_ID 가 없다. " +
        "저장소의 news.json 을 그대로 쓴다(노션 연결 전 정상 동작).",
    );
    return;
  }

  let posts;
  try {
    posts = await queryAll(token, dbId);
  } catch (err) {
    warn(`노션을 읽지 못했다 — ${err instanceof Error ? err.message : String(err)}`);
    return;
  }

  if (posts.length === 0) {
    // 전부 임시저장이거나 칸 이름이 어긋난 경우. 덮어쓰면 공지가 사라진다
    warn("게시완료 상태인 글이 0건이다. 칸 이름과 상태 값을 확인하라.");
    return;
  }

  // 내용이 같으면 쓰지 않는다 — 배포 로그에 의미 없는 변경이 남지 않는다
  const next = `${JSON.stringify(posts, null, 2)}\n`;
  const prev = await readFile(OUT, "utf8").catch(() => "");
  if (prev === next) {
    console.log(`[fetch-news] 변경 없음 (${posts.length}건).`);
    return;
  }

  await writeFile(OUT, next, "utf8");
  console.log(`[fetch-news] ${posts.length}건을 news.json 에 반영했다.`);
}

await main();
