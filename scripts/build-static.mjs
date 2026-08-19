import { spawnSync } from "node:child_process";
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

/**
 * 드래그앤드롭용 정적 사이트를 만든다.
 *
 * ── 왜 스크립트인가 ──
 * `STATIC_EXPORT=1 next build` 는 Windows PowerShell 에서 그대로 동작하지 않는다.
 * (`VAR=값 명령` 형식이 없다) 환경변수를 코드에서 넣어 OS 를 가리지 않게 한다.
 *
 * ── 왜 DEPLOY.md 를 site/ 밖에 두는가 ──
 * 안내 문서에는 미해결 법무 이슈와 내부 판단이 적혀 있다. 업로드 폴더 안에 있으면
 * 배포되는 순간 `/DEPLOY.md` 로 **누구나 읽을 수 있다.** 그래서 한 단계 밖에 둔다.
 *   dist-deploy/site/      ← 이 폴더만 드래그앤드롭
 *   dist-deploy/DEPLOY.md  ← 사람이 읽는 문서
 */

const ROOT = process.cwd();
const OUT = join(ROOT, "dist-deploy");
const SITE = join(OUT, "site");

async function dirSize(dir) {
  let total = 0;
  let files = 0;
  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const s = await stat(join(entry.parentPath ?? entry.path, entry.name));
    total += s.size;
    files += 1;
  }
  return { total, files };
}

console.log("정적 빌드 시작 (STATIC_EXPORT=1)…\n");

const build = spawnSync("npx", ["next", "build"], {
  cwd: ROOT,
  env: { ...process.env, STATIC_EXPORT: "1" },
  stdio: "inherit",
  shell: true,
});

if (build.status !== 0) {
  console.error("\n빌드 실패. 위 오류를 먼저 해결하세요.");
  process.exit(build.status ?? 1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(SITE, { recursive: true });

await cp(join(ROOT, "out"), SITE, { recursive: true });
await cp(join(ROOT, "scripts", "DEPLOY.md"), join(OUT, "DEPLOY.md"));

const { total, files } = await dirSize(SITE);
console.log(`\n묶음 완료`);
console.log(
  `  업로드 폴더 : dist-deploy/site  (${files}개 파일, ${(total / 1024 / 1024).toFixed(1)}MB)`,
);
console.log(`  안내 문서   : dist-deploy/DEPLOY.md  ← 업로드하지 마세요`);
