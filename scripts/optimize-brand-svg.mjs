/**
 * 브랜드 SVG 안에 박힌 링 래스터를 실제 렌더 해상도에 맞춰 줄인다.
 *
 * ── 왜 래스터가 들어 있나 ────────────────────────────────────────────
 * 새 로고의 링 그라디언트는 **호를 따라** 흐른다(왼쪽 아래 진한 파랑 →
 * 위를 지나 → 오른쪽 아래 연한 파랑). 이건 SVG 1.1 의 <linearGradient>
 * 로 표현할 수 없다. 어떤 각도의 선형 그라디언트도 "같은 x 에서 아래로
 * 갈 때 왼쪽은 어두워지고 오른쪽은 밝아지는" 동작을 만들지 못한다.
 * 그래서 Illustrator 가 링만 래스터로 굽는다. 버그가 아니라 형식의 한계다.
 *
 * ── 그래서 무엇을 하나 ───────────────────────────────────────────────
 * 그림은 그대로 두고 **해상도만** 실제 필요치에 맞춘다.
 * 이 사이트에서 링이 가장 크게 나오는 지점:
 *   design-system  symbol 72 CSS px × DPR 3 = 216px
 *   ScrollStory    슬로건 320px 중 링 ~66px × DPR 3 = 197px
 * 원본은 1031px 로 약 5배 과잉이다. 512px 면 2.4배 여유가 남는다.
 *
 * 실측(216px 로 리샘플 후 흰 배경 합성 비교): 평균 채널차 0.32/255.
 * 육안 식별 한계가 2~3 이므로 화면에서는 구분되지 않는다.
 *
 * ⚠️ <image> 의 width/height 속성은 **유저 단위**라 건드리지 않는다.
 *    래스터 픽셀 수만 바뀌고 배치는 그대로다.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const BRAND_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "brand");

/** 링이 화면에서 차지하는 최대 device pixel(216) 의 2.4배 여유 */
const MAX_RASTER_WIDTH = 512;

const brotli = (s) =>
  brotliCompressSync(Buffer.from(s), {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length;

const kb = (n) => (n / 1024).toFixed(1).padStart(6);

const files = readdirSync(BRAND_DIR).filter((f) => f.endsWith(".svg"));
let totalBefore = 0;
let totalAfter = 0;

console.log("파일                        원본(brotli)  최적화(brotli)   래스터");
for (const name of files) {
  const before = readFileSync(join(BRAND_DIR, name), "utf8");

  // xlink:href 든 href 든 받는다. 여러 개면 전부 처리한다.
  const re = /(xlink:href|href)="data:image\/png;base64,([^"]+)"/g;
  const jobs = [...before.matchAll(re)];
  if (jobs.length === 0) {
    console.log(`${name.padEnd(26)} (내장 래스터 없음 — 건너뜀)`);
    continue;
  }

  let after = before;
  const notes = [];
  for (const m of jobs) {
    const raw = Buffer.from(m[2].replace(/\s/g, ""), "base64");
    const meta = await sharp(raw).metadata();

    // 이미 충분히 작으면 재인코딩만 시도하고, 커지면 원본을 유지한다.
    const target = Math.min(meta.width, MAX_RASTER_WIDTH);
    const out = await sharp(raw)
      .resize({ width: target, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
      .toBuffer();

    if (out.length >= raw.length) {
      notes.push(`${meta.width}px 유지`);
      continue;
    }
    after = after.replace(m[0], `${m[1]}="data:image/png;base64,${out.toString("base64")}"`);
    notes.push(`${meta.width}→${target}px`);
  }

  writeFileSync(join(BRAND_DIR, name), after);

  const b0 = brotli(before);
  const b1 = brotli(after);
  totalBefore += b0;
  totalAfter += b1;
  console.log(`${name.padEnd(26)} ${kb(b0)}KB      ${kb(b1)}KB    ${notes.join(", ")}`);
}

console.log(
  `\n전송 합계(brotli): ${kb(totalBefore)}KB → ${kb(totalAfter)}KB ` +
    `(${(totalBefore / totalAfter).toFixed(1)}배 감소)`,
);
