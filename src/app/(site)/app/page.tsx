import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

/**
 * `/app` — 앱 안내 (PRD §7.9).
 *
 * ⚠️⚠️ **앱은 계약 체결 후에만 사용할 수 있다.**
 * 그래서 다운로드를 공개 CTA 로 쓰면 안 된다(PRD §2.1 · CLAUDE.md §5).
 * 계약 없는 방문자가 받아서 로그인에 실패하면 그 사람은 그대로 이탈한다.
 * 다운로드 버튼에는 예외 없이 **"계약 점주·매니저 전용"** 라벨이 붙는다.
 *
 * ── 다운로드 카드 하나만 남겼다 (사용자 지시 2026-08-18) ──
 * 이전에는 세 섹션이었다: 히어로(앱 소개 + 폰 목업) · "누가 무엇을 보는가"
 * (점주용/매니저용 기능 목록 2열) · 다운로드 카드. 사용자 지시로 **카드 하나만**
 * 남긴다.
 *
 * 그 판단이 이 페이지의 성격과 맞는다: 앱은 계약자만 쓰므로 이 화면에 오는
 * 사람은 대개 **이미 계약한 점주·매니저**다. 그들에게 필요한 것은 앱 소개가
 * 아니라 받는 곳이다. 계약 전 방문자를 위한 설명은 `/features/dashboard` 와
 * `/system` 이 이미 자세히 하고 있다.
 *
 * ⚠️ 지운 두 섹션의 카피(점주용·매니저용 각 4항목, 히어로 문구)는 이 파일에서
 *    사라졌다. 되살릴 일이 생기면 git 이력(2026-08-18 이전)에서 가져온다 —
 *    화면에 쓰지 않는 배열을 파일에 남겨 두면 다음 사람이 왜 안 그려지는지
 *    찾는 데 시간을 쓴다.
 *
 * ── 제목이 `h1` 이다 ──
 * 히어로가 사라져 이 카드가 페이지의 유일한 제목이 됐다. `h2` 로 두면 문서에
 * `h1` 이 없는 페이지가 된다.
 */

export const metadata: Metadata = {
  title: "앱 안내",
  description:
    "반오토 앱은 계약 점주와 매장 매니저를 위한 관리 도구입니다. 계약 체결 후 계정이 발급됩니다.",
};

export default function AppPage() {
  return (
    /*
      이 섹션이 페이지의 첫 자식이라 `globals.css` 의
      `main > :first-child { padding-top: var(--header-h) }` 규칙을 받는다 —
      투명 헤더 뒤로 배경이 이어지고 카드만 헤더 아래에서 시작한다.
    */
    <section className="section-py bg-bg-subtle">
      <div className="container-ba">
        {/* 계약 고객 전용이라는 사실을 버튼과 같은 자리에서 말한다 */}
        <div className="border-border mx-auto max-w-[720px] rounded-lg border bg-white p-8 text-center shadow-[var(--shadow-card)]">
          <Badge tone="warning" className="mb-4">
            계약 점주 · 매니저 전용
          </Badge>
          <h1 className="text-h3 text-ink mb-3">앱 다운로드</h1>
          <p className="text-body text-text-sub mb-6">
            계약 체결 후 계정이 발급됩니다. 계정이 없으면 로그인할 수 없습니다. PC 에서는 웹
            대시보드로, 모바일에서는 iOS·Android 앱으로 같은 기록을 보십니다.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {/* 스토어 링크는 §13-F 확정 대기 */}
            {["Google Play", "App Store"].map((store) => (
              <span
                key={store}
                className="border-border-strong text-body-sm text-text-sub inline-flex min-h-[52px] items-center justify-center rounded-sm border bg-white px-7 font-semibold"
              >
                {store} · <span className="text-warning ml-1">링크 확정 필요</span>
              </span>
            ))}
          </div>

          <p className="text-caption text-text-sub mt-6">
            아직 계약 전이시라면{" "}
            <Link href="/contact" className="text-brand font-semibold underline underline-offset-2">
              무료 방문 진단
            </Link>
            부터 신청해 주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
