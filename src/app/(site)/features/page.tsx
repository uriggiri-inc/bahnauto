"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * `/features` — 첫 기능 상세로 넘기는 통로.
 *
 * 목차(개요) 페이지가 잠깐 있었는데 **사용자 확정(2026-08-14)으로 삭제**했다 —
 * GNB "주요기능"을 누르면 목차를 거치지 않고 1번 기능 상세(`/features/dashboard`)가
 * 바로 보여야 한다. 기능 간 이동은 상세 페이지의 SNB 가 맡는다.
 *
 * 내부 링크는 전부 `/features/dashboard` 로 직접 걸었으므로 이 페이지는
 * 옛 주소(`/features`)로 들어온 사람을 위한 안전망이다. 정적 내보내기
 * (`output: "export"`)에서는 서버 리다이렉트를 쓸 수 없어 클라이언트에서
 * 옮긴다 — JS 가 실패해도 이동할 수 있게 링크를 남겨 둔다.
 */
export default function FeaturesIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/features/dashboard");
  }, [router]);

  return (
    <div className="container-ba section-py">
      <p className="text-body text-text-sub">
        주요기능 상세 페이지로 이동합니다.{" "}
        <Link href="/features/dashboard" className="text-brand underline underline-offset-2">
          바로 가기
        </Link>
      </p>
    </div>
  );
}
