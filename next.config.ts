import type { NextConfig } from "next";

/**
 * `STATIC_EXPORT=1` 로 빌드하면 **드래그앤드롭으로 올릴 수 있는 정적 사이트**가 나온다.
 *
 * 기본 빌드(Cloudflare Workers)는 서버 런타임이 있어 폼 제출(서버 액션)이 동작한다.
 * 정적 내보내기에는 서버가 없으므로 서버 액션을 쓸 수 없고, 이미지 최적화 API 도 없다.
 * 그래서 이 모드에서는 폼이 접수되지 않는다 — **화면 검토 전용**이다.
 *
 * 지금은 어차피 저장소가 연결돼 있지 않아 운영 빌드에서도 접수되지 않으므로,
 * 검토 목적으로는 두 빌드의 차이가 없다.
 */
/**
 * Cloudflare **Pages** 빌드는 `CF_PAGES=1` 을 자동으로 넣어준다.
 * Workers 빌드에는 이 값이 없다. 즉 이 한 줄로 배포 대상이 구분된다.
 *
 * 대시보드에 `STATIC_EXPORT` 환경변수를 손으로 넣는 걸 잊으면
 * 정적 내보내기가 일어나지 않아 `out/` 이 생기지 않고, Pages 는 올릴 게 없어
 * **모든 경로가 404** 가 된다. 사람이 기억해야만 성립하는 설정은 언젠가 어긋난다.
 */
const isStatic = process.env.STATIC_EXPORT === "1" || process.env.CF_PAGES === "1";

const nextConfig: NextConfig = {
  ...(isStatic && {
    output: "export",
    // 정적 호스팅에는 이미지 최적화 서버가 없다. 원본을 그대로 내보낸다.
    images: { unoptimized: true },
    // 폴더별 index.html 로 내보내 어떤 정적 호스팅에서도 /system 같은 경로가 열린다.
    trailingSlash: true,
    turbopack: {
      resolveAlias: {
        // 서버 액션을 정적 스텁으로 갈아끼운다.
        // 이게 없으면 "Server Actions are not supported with static export" 로 빌드가 멈춘다.
        "@/lib/form-submit": "./src/lib/form-submit.static.ts",
      },
    },
  }),
};

export default nextConfig;
