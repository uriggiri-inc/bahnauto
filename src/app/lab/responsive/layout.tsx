import type { Metadata } from "next";

/**
 * 검증 화면이므로 색인에서 제외한다.
 * page.tsx 는 클라이언트 컴포넌트라 metadata 를 export 할 수 없어 레이아웃에서 처리한다.
 */
export const metadata: Metadata = {
  title: "반응형 동시 확인",
  robots: { index: false, follow: false },
};

export default function ResponsiveLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
