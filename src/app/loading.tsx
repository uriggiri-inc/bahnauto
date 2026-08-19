import { FullscreenLoader } from "@/components/ui/Loader";

/**
 * App Router 의 루트 로딩 UI.
 *
 * Next.js 가 이 파일을 자동으로 Suspense 폴백으로 사용한다 — 라우트 전환이
 * 즉시 끝나지 않거나 서버 컴포넌트가 스트리밍 중일 때 표시된다.
 * 별도로 import 하거나 상태를 만들 필요가 없다.
 *
 * 하위 라우트에 개별 로딩이 필요하면 해당 폴더에 `loading.tsx` 를 추가한다
 * (예: `app/cases/loading.tsx`). 가장 가까운 것이 우선한다.
 */
export default function Loading() {
  return <FullscreenLoader />;
}
