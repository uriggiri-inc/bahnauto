/**
 * 브랜드 심볼로 멀티사이즈 favicon.ico 를 만든다.
 *
 * create-next-app 이 넣어둔 Vercel 삼각형 아이콘을 대체한다.
 * ICO 컨테이너는 헤더 6바이트 + 항목당 16바이트 디렉터리 + 페이로드 구조다.
 * 페이로드로 PNG 를 넣는 방식(PNG-in-ICO)은 Windows Vista 이상과
 * 모든 현행 브라우저가 지원한다.
 *
 * 16px 에서는 링 구멍이 뭉개지므로 심볼을 여백 없이 꽉 채워 넣는다.
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "public", "brand", "symbol.svg");
/**
 * 16/32/48 만 넣는다. 256px 항목은 Windows 바탕화면 바로가기용이라
 * 웹사이트에는 쓰이지 않으면서 파일을 15KB 더 불린다.
 * iOS 홈화면은 apple-touch-icon.png 가 따로 담당한다.
 */
const SIZES = [16, 32, 48];

const pngs = [];
for (const size of SIZES) {
  pngs.push({
    size,
    // density 를 올려야 벡터가 목표 크기에서 선명하게 래스터화된다
    data: await sharp(SOURCE, { density: Math.max(72, size * 12) })
      .resize(size, size)
      .png({ compressionLevel: 9, palette: size <= 48 })
      .toBuffer(),
  });
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(pngs.length, 4);

const dir = Buffer.alloc(16 * pngs.length);
let offset = header.length + dir.length;

pngs.forEach((p, i) => {
  const o = i * 16;
  dir.writeUInt8(p.size >= 256 ? 0 : p.size, o + 0); // width  (0 = 256)
  dir.writeUInt8(p.size >= 256 ? 0 : p.size, o + 1); // height
  dir.writeUInt8(0, o + 2); // 팔레트 색 수 (0 = 트루컬러/미사용)
  dir.writeUInt8(0, o + 3); // reserved
  dir.writeUInt16LE(1, o + 4); // color planes
  dir.writeUInt16LE(32, o + 6); // bits per pixel
  dir.writeUInt32LE(p.data.length, o + 8);
  dir.writeUInt32LE(offset, o + 12);
  offset += p.data.length;
});

const ico = Buffer.concat([header, dir, ...pngs.map((p) => p.data)]);
const out = join(ROOT, "src", "app", "favicon.ico");
writeFileSync(out, ico);

console.log(
  `favicon.ico 생성 — ${pngs.map((p) => `${p.size}px/${p.data.length}B`).join(", ")}  총 ${(ico.length / 1024).toFixed(1)}KB`,
);
