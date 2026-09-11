/**
 * 한글 조판 — 문장 분리와 어구 묶기.
 *
 * ── 왜 렌더 층에서 처리하는가 ──
 * 카피 원문(`content/*.ts`, 페이지 JSX)은 **손대지 않는다.** 문자열에 `<br />` 이나
 * 줄바꿈 금지 공백을 박아 넣으면
 *   · 원문이 무엇인지 알 수 없게 된다(카피 검수·법무 대조가 불가능해진다)
 *   · 폭이 바뀌면 박아 둔 줄바꿈이 오히려 어색해진다
 *   · 새로 추가되는 카피는 규칙에서 빠진다
 * 그래서 여기서 계산하고 `components/ui/Copy.tsx` 가 그린다.
 *
 * ── 전역 CSS 로는 안 되는 이유 ──
 * `globals.css` 에 이미 `word-break: keep-all` + `text-wrap: pretty` 가 걸려 있다.
 * `pretty` 는 **마지막 줄 외톨이만** 막고, `keep-all` 은 **어절 내부**만 지킨다.
 * 「하실 일과」처럼 **어절 두 개가 하나의 의미 단위**인 경우는 둘 다 막지 못한다.
 */

/* ── 문장 분리 ────────────────────────────────────────────── */

/**
 * 문장 경계 — 마침표·물음표·느낌표 **뒤의 공백**에서 끊는다.
 *
 * 판정은 문장부호 **앞 글자**로 한다. 한글·닫는 괄호·닫는 따옴표일 때만 끊는다 —
 * 숫자를 넣으면 `+34.4%`·`1.5배` 같은 소수점에서 문장이 갈라진다.
 * ⚠️ **숫자 앞 조건을 넓히지 마라.** 이 목록에 `0-9` 가 없는 것이 그 장치다.
 *
 * 닫는 따옴표(`”`·`"`·`’`)를 넣은 이유(2026-09-09): 인용이 끝나고 마침표가 오는
 * 문장이 있다 — 「“키오스크가 안 돼요”. 결제가 막히니…」(홈 통증 카드). 앞 글자가
 * `”` 라 한글 조건에 걸리지 않아 문장이 하나로 붙어 있었다.
 * 이 규칙은 사이트 전체가 공유한다. 넓힐 때는 산출물 39개 페이지의 `<br>` 개수를
 * 변경 전과 대조해 다른 화면이 흔들리지 않는지 확인한다.
 */
const SENTENCE_BREAK = String.raw`(?<=[가-힣)\]”"’][.?!])\s+`;

/**
 * 마침표·물음표·느낌표 뒤에서 문장을 끊는다. 문장부호는 앞 문장에 남긴다.
 */
export function splitSentences(text: string): string[] {
  const parts = text.split(new RegExp(SENTENCE_BREAK));
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

/* ── 조각 배열의 문장 분리 ─────────────────────────────────── */

/** 조판 대상 조각. `hl` 이 있으면 그리는 쪽이 형광펜 `<span>` 으로 감싼다 */
export type TextSegment = string | { hl: string };

const textOf = (seg: TextSegment): string => (typeof seg === "string" ? seg : seg.hl);

/**
 * **일부 구절이 형광펜으로 감싸인 문단**을 문장 단위 줄로 나눈다.
 *
 * ── 왜 `splitSentences` 로 안 되는가 ──
 * 형광펜 카피는 `["…남긴 ", {hl:"과자 부스러기"}, "이 매트 위에…"]` 처럼 조각
 * 배열이다. 조각을 하나씩 따로 넘기면 문장 끝을 놓친다 — 마침표 **앞 글자가 다른
 * 조각에 있는** 경우가 있기 때문이다(`{hl:"…놓지 못합니다"}`, `". 매장은 무인인데…"`).
 * 그래서 이어 붙인 전체 문장에서 경계를 찾고, 그 위치를 조각으로 되돌린다.
 *
 * ── 지키는 것 ──
 * · **글자를 바꾸지 않는다.** 경계의 공백만 사라지고(그 자리에 줄바꿈이 들어간다)
 *   나머지 공백은 그대로다. 조각 사이 공백을 지우면 「남긴 과자」가 「남긴과자」가 된다
 * · **형광펜 조각은 쪼개지 않는다.** 경계가 형광펜 안쪽이면 그 경계는 버린다 —
 *   칠해진 구절이 두 조각으로 갈라지는 것보다 한 줄로 흐르는 편이 낫다
 * · 어구 묶기(`bindPhrases`)는 **걸지 않는다.** 묶어야 할 두 어절이 형광펜 경계로
 *   갈라져 있으면 조각별 처리로는 판정이 어긋난다. 이 함수는 줄 나눔만 한다
 */
export function splitSegmentLines(segments: readonly TextSegment[]): TextSegment[][] {
  const full = segments.map(textOf).join("");

  // 조각의 시작 위치 — 전체 문자열 기준
  const starts: number[] = [];
  let at = 0;
  for (const seg of segments) {
    starts.push(at);
    at += textOf(seg).length;
  }

  // 잘라낼 공백 구간 [from, to). 한 평문 조각 안에 온전히 들어가는 것만 쓴다
  const cuts: { seg: number; from: number; to: number }[] = [];
  for (const m of full.matchAll(new RegExp(SENTENCE_BREAK, "g"))) {
    const from = m.index;
    const to = from + m[0].length;
    const i = segments.findIndex(
      (seg, k) => typeof seg === "string" && starts[k]! <= from && to <= starts[k]! + seg.length,
    );
    if (i >= 0) cuts.push({ seg: i, from: from - starts[i]!, to: to - starts[i]! });
  }

  const lines: TextSegment[][] = [[]];
  const add = (seg: TextSegment) => {
    if (typeof seg === "string" && seg.length === 0) return;
    lines[lines.length - 1]!.push(seg);
  };

  segments.forEach((seg, i) => {
    if (typeof seg !== "string") {
      add(seg);
      return;
    }
    let cursor = 0;
    for (const cut of cuts) {
      if (cut.seg !== i) continue;
      add(seg.slice(cursor, cut.from));
      lines.push([]);
      cursor = cut.to;
    }
    add(seg.slice(cursor));
  });

  return lines.filter((line) => line.length > 0);
}

/* ── 어구 묶기 ────────────────────────────────────────────── */

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_COUNT = 28;

/** 종성 인덱스 — ㄴ = 4, ㄹ = 8 (한글 음절 조합 순서) */
const JONGSEONG_N = 4;
const JONGSEONG_L = 8;

/** 한글 음절의 종성 인덱스. 한글 음절이 아니면 null */
function jongseongOf(ch: string): number | null {
  const code = ch.codePointAt(0);
  if (code === undefined || code < HANGUL_START || code > HANGUL_END) return null;
  return (code - HANGUL_START) % JONGSEONG_COUNT;
}

/**
 * 앞말이 **관형사형 어미**로 끝나는가.
 *
 * 한국어에서 의존명사 앞에 오는 어미는 `-ㄴ/은/는/던`(종성 ㄴ)과
 * `-ㄹ/을`(종성 ㄹ) 두 갈래다. 이 둘로 끝나면 뒷말은 홀로 설 수 없는
 * 의존명사일 가능성이 높다 — 「하실 일」·「있는 것」·「할 수」.
 */
function endsWithAdnominal(word: string): boolean {
  const last = word[word.length - 1];
  if (last === undefined) return false;
  const jong = jongseongOf(last);
  return jong === JONGSEONG_N || jong === JONGSEONG_L;
}

/**
 * 관형사형 뒤에 붙는 의존명사. **한두 글자만** 넣는다 —
 * 긴 낱말까지 묶으면 좁은 화면에서 그 덩어리가 통째로 넘친다.
 */
const DEPENDENT_NOUNS = [
  "것",
  "수",
  "때",
  "중",
  "데",
  "바",
  "줄",
  "리",
  "채",
  "뿐",
  "일",
  "적",
  "터",
  "양",
  "편",
  "지",
  "만큼",
  "따름",
  "나름",
  "무렵",
];

/** 의존명사 뒤에 붙을 수 있는 조사. 「일과」·「것을」·「수가」를 잡기 위한 것 */
const PARTICLES = [
  "이",
  "가",
  "은",
  "는",
  "을",
  "를",
  "과",
  "와",
  "에",
  "의",
  "도",
  "만",
  "부터",
  "까지",
  "으로",
  "로",
  "보다",
  "처럼",
  "밖에",
  "이나",
  "나",
];

/** 「의존명사 + (조사) + (문장부호)」 한 낱말인가 */
function isDependentToken(word: string): boolean {
  const bare = word.replace(/[.,!?)\]·—]+$/u, "");
  if (bare.length === 0) return false;
  for (const noun of DEPENDENT_NOUNS) {
    if (bare === noun) return true;
    if (!bare.startsWith(noun)) continue;
    const rest = bare.slice(noun.length);
    if (PARTICLES.includes(rest)) return true;
  }
  return false;
}

/**
 * 줄바꿈 금지 공백(U+00A0).
 *
 * 이스케이프로 적는다 — 문자를 그대로 넣으면 보통 공백과 눈으로 구별되지 않아
 * 나중에 누가 "공백이 두 종류네" 하고 정리하다 규칙을 지운다.
 */
const NBSP = "\u00a0";

/**
 * 의미 단위로 묶여야 하는 어절 쌍을 줄바꿈 금지 공백으로 잇는다.
 *
 * 「각 단계에서 사장님이 하실 일과 반오토가」 → 「하실」과 「일과」 사이만 묶는다.
 * 세 어절 이상을 잇지 않는다 — 묶인 덩어리가 길면 좁은 화면에서 가로로 넘친다.
 */
export function bindPhrases(text: string): string {
  const words = text.split(" ");
  if (words.length < 2) return text;

  let out = words[0] ?? "";
  for (let i = 1; i < words.length; i += 1) {
    const prev = words[i - 1] ?? "";
    const cur = words[i] ?? "";
    // 이미 앞에서 묶인 어절은 다시 묶지 않는다 — 3어절 덩어리가 생긴다
    const alreadyBound = out.endsWith(NBSP + prev);
    const bind = !alreadyBound && endsWithAdnominal(prev) && isDependentToken(cur);
    out += (bind ? NBSP : " ") + cur;
  }
  return out;
}

/** 문장으로 끊고 각 문장의 어구를 묶는다 — `Copy` 컴포넌트가 쓰는 유일한 입구 */
export function formatKoreanLines(text: string): string[] {
  return splitSentences(text).map(bindPhrases);
}
