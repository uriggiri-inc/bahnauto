import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 디자인시스템 원본(감사·대조용 사본). 프로젝트 소스가 아니므로 검사하지 않는다.
    "docs/**",
    // 외부 설치 스킬 — 우리가 작성한 코드가 아니다.
    ".agents/**",
    ".claude/**",
    // Cloudflare 어댑터 빌드 산출물
    ".open-next/**",
    ".wrangler/**",
    // 배포 자료 묶음 — .open-next 사본이다
    "dist-deploy/**",
  ]),
]);

export default eslintConfig;
