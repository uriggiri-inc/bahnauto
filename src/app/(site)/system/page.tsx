import type { Metadata } from "next";
import Link from "next/link";
import { ScreenStack } from "@/components/marketing/ScreenStack";
import { SCREEN_PAIRS, SCREENS } from "@/content/app-screens";
import { ChecklistDemo } from "@/components/marketing/ChecklistDemo";
import { ZigzagFeature } from "@/components/marketing/ZigzagFeature";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buttonClasses } from "@/components/ui/Button";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";

/**
 * `/system` — 반오토 운영 시스템.
 *
 * **이 프로젝트의 가장 중요한 산출물이다**(PRD §7.2). 경쟁사가 복제할 수 없는 자산
 * (실제 운영 중인 앱)을 유일하게 전면에 드러내는 곳이고, 홈에서 "정말 제대로 하나?"
 * 라는 질문을 안고 넘어온 사람이 도착하는 페이지다.
 *
 * 그래서 여기 실리는 문장은 전부 **앱에서 실제로 확인된 동작**이어야 한다.
 * 그럴듯한 기능 설명을 지어내는 순간 이 페이지의 존재 이유가 사라진다.
 * 아래 내용은 PRD §7.2 · 부록 A 에서 확인된 것만 옮겼다.
 */

export const metadata: Metadata = {
  title: "무인매장 관리 시스템",
  description:
    "무인매장 관리 결과를 증명하는 방법입니다. 매장 전용 체크리스트, 항목별 사진 기록, 출퇴근 인증, 유통기한 D-day 재고 관리로 매일 기록을 남깁니다.",
};

export default function SystemPage() {
  return (
    <>
      {/* ══ 히어로 ═══════════════════════════════════════════════ */}
      {/*
        ── 히어로 구조를 바꿨다 (2026-08-25, 사용자 확정) ──
        이전에는 2단(텍스트 | 화면 380px)이었다. 실제 캡처가 들어오면서 그 폭으로는
        PC 화면을 담을 수 없다 — 사이드바 9개 메뉴가 보이지 않으면 "이걸로 다
        관리한다" 가 전달되지 않는다.

        그래서 텍스트를 위에 두고 화면을 **컨테이너 전체 폭**으로 내렸다.
        `ScreenStack` 의 나란히 배치라 PC·모바일 둘 다 온전히 보인다.

        ⚠️ 히어로는 LCP 요소다. 모션 라이브러리를 쓰지 않고(`../CLAUDE.md` §4),
           PC 이미지에만 `priority` 를 준다.
      */}
      <section className="from-brand-50 bg-gradient-to-b to-white">
        <div className="container-ba pt-12 pb-16 md:pt-20 md:pb-20">
          <div className="max-w-[46rem]">
            <SectionLabel className="mb-3">반오토 운영 시스템</SectionLabel>
            <h1 className="text-display text-ink mb-5">
              관리의 결과를,
              <br />
              매일 기록으로 확인하세요
            </h1>
            <p className="text-body-lg text-text-sub mb-8 max-w-[34rem]">
              반오토 매니저는 매장 전용 체크리스트대로 일합니다. 무엇을 언제 했는지 사진과 시각이
              함께 남고, 그 기록이 매일 사장님께 발송됩니다.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className={buttonClasses({ size: "lg" })}>
                무료 방문 진단 신청
              </Link>
              <Link
                href="/#pricing"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                예상 견적 보기
              </Link>
            </div>
          </div>

          <ScreenStack
            layout="side"
            priority
            pc={SCREEN_PAIRS.report.pc}
            mobile={SCREEN_PAIRS.report.mobile}
            className="mt-12 md:mt-14"
          />
        </div>
      </section>

      {/* ══ 1. 체크리스트 ════════════════════════════════════════
          REVIEW-001 F-3 — 319 를 헤드라인에서 내리고 항목명을 앞세운다.
          검증할 수 없는 큰 수는 확인 욕구만 키우지만, 항목명은 나열하는 순간 검증된다. */}
      <section className="section-py">
        <div className="container-ba">
          <ZigzagFeature
            label="매장 전용 체크리스트"
            title="사람이 바뀌어도, 기준은 바뀌지 않습니다"
            body="매장마다 업종과 면적에 맞춰 전용 체크리스트를 만듭니다. 매일 하는 상시근무 항목과 주차별로 도는 항목이 나뉘어 있어, 담당자가 바뀌어도 같은 순서로 같은 일이 수행됩니다."
            points={[
              "상시근무 항목은 방문할 때마다 전부 수행합니다",
              "1~4주차 항목이 따로 있어 주기적인 관리가 빠지지 않습니다",
              "무인키즈카페의 경우 상시근무와 주차별 항목을 합쳐 총 319개입니다",
            ]}
            screen={{ ...SCREENS.checklistMobile, maxW: "max-w-[300px]" }}
          >
            <ChecklistDemo />
          </ZigzagFeature>
        </div>
      </section>

      {/* ══ 2. 사진 기록 ═════════════════════════════════════════ */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <ZigzagFeature
            flip
            label="사진 기록"
            title="항목마다 사진이 남습니다"
            body="체크만 하고 넘어갈 수 없습니다. 항목을 완료하려면 사진을 첨부해야 하고, 필요하면 여러 장을 남길 수 있습니다. 그래서 '했다'는 말과 '한 것'이 분리되지 않습니다."
            points={[
              "항목별 사진 첨부는 선택이 아니라 필수입니다",
              "한 항목에 여러 장을 첨부할 수 있습니다",
              "특이사항은 메모로 함께 남깁니다",
              "완료 처리하면 진행률에 자동으로 반영됩니다",
            ]}
            screen={{
              ...SCREENS.checklistPhotoMobile,
              caption: "항목별 사진 기록",
              maxW: "max-w-[300px]",
            }}
          />
        </div>
      </section>

      {/* ══ 3. 출퇴근 인증 ═══════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-ba">
          <ZigzagFeature
            label="출퇴근 인증"
            title={
              <>
                방문했다는 말이 아니라,
                <br />
                증거입니다
              </>
            }
            body="매니저는 매장 입구 단말기 화면을 촬영해 출퇴근을 인증합니다. 사진 속 시각이 자동으로 인식되므로, 실제로 그 시간에 매장에 있었다는 사실이 기록으로 남습니다."
            points={[
              "입구 단말기 화면을 촬영해 인증합니다",
              "촬영된 화면의 시각을 자동으로 인식합니다",
              "인정 시간은 18:00~10:00 입니다",
            ]}
            screen={{
              ...SCREENS.attendancePhotoMobile,
              caption: "단말기 촬영 · 시각 자동 인식",
              maxW: "max-w-[300px]",
            }}
          />
        </div>
      </section>

      {/* ══ 4. 재고 · 발주 ═══════════════════════════════════════ */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <ZigzagFeature
            flip
            label="재고 · 발주"
            title="폐기 대상은 미리 알려드립니다"
            body="등록된 상품의 유통기한을 기준으로 D-day 를 자동 산출합니다. 폐기해야 할 상품이 생기기 전에 알 수 있고, 발주는 작성부터 완료까지 단계별로 기록됩니다."
            points={[
              "유통기한 D-day 를 자동으로 계산합니다",
              "폐기 대상 · D-30 · 정상 · 전체 등록 네 가지로 나눠 보여줍니다",
              "발주 요청은 작성 → 검토 → 수령 → 완료 4단계로 진행됩니다",
              "문제가 생기면 이슈로 보고합니다",
            ]}
            screen={{
              ...SCREENS.inventoryPc,
              caption: "유통기한 D-day 산출",
              maxW: "max-w-[560px]",
            }}
          />
        </div>
      </section>

      {/* ══ 5. 소통 채널 ═════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-ba">
          <ZigzagFeature
            label="소통 채널"
            title="급한 일은 기다리지 않습니다"
            body="분실물부터 기기 고장까지, 현장에서 생기는 일은 카테고리별 게시판으로 올라옵니다. 즉시 확인이 필요한 건은 채널톡으로 바로 연결됩니다."
            points={[
              "게시판 카테고리: 분실물 · 긴급발주 · AS요청 · 장난감 파손 보고 · 기타",
              "채널톡으로 실시간 문의가 가능합니다",
            ]}
            screen={{ ...SCREENS.boardPc, caption: "카테고리별 게시판", maxW: "max-w-[560px]" }}
          />
        </div>
      </section>

      {/* ══ 6. 데일리 리포트 ═════════════════════════════════════ */}
      <section className="section-py bg-bg-subtle">
        <div className="container-ba">
          <ZigzagFeature
            flip
            label="데일리 리포트"
            title="매장에 가지 않아도 상태를 아십니다"
            body="하루치 관리 수행 결과가 사진과 함께 정리되어 발송됩니다. 매장에 들르지 않아도 무엇이 되었고 무엇이 남았는지 확인하실 수 있습니다."
            points={[
              "일일 관리 수행 결과를 요약해 드립니다",
              "항목별 사진 기록이 함께 첨부됩니다",
              "월간 종합 리포트도 제공합니다",
            ]}
            /*
              "리포트 실물"(인쇄물·메일 캡처)은 아직 없다. 대신 점주가 실제로 보는
              리포트 화면을 넣었다 — 없는 것을 자리표시자로 비워 두기보다
              사실인 화면을 보여주는 편이 맞다. 실물이 확보되면 교체한다.
            */
            screen={{
              ...SCREENS.reportPc,
              alt: "점주가 받는 데일리 리포트 화면",
              caption: "매일 발송되는 리포트",
              maxW: "max-w-[560px]",
            }}
          />
        </div>
      </section>

      {/* ══ 자주 묻는 질문 — 하단 CTA 바로 위 (사용자 지시 2026-08-18) ═════ */}
      <FaqTeaser
        groupId="features"
        offset={2}
        tone="white"
        title="운영 화면에 대해 많이 묻는 것들"
        lead="체크리스트와 기록이 실제로 어떻게 남는지에 대한 질문입니다."
      />

      {/* ══ 최종 CTA ═════════════════════════════════════════════ */}
      <section className="bg-brand section-py text-white">
        <div className="container-ba text-center">
          <Reveal>
            <h2 className="text-h1 mx-auto mb-4 max-w-[24ch]">직접 보시는 게 가장 빠릅니다</h2>
            <p className="text-body-lg mx-auto mb-8 max-w-[46rem] text-white/80">
              방문 진단 때 실제 앱 화면과 리포트 샘플을 그대로 보여드립니다. 진단까지는 비용이
              발생하지 않습니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={buttonClasses({ variant: "onDark", size: "lg" })}>
                무료 방문 진단 신청
              </Link>
              <Link
                href="/service"
                className={buttonClasses({
                  variant: "ghost",
                  size: "lg",
                  className: "text-white/85 hover:bg-white/12 hover:text-white",
                })}
              >
                서비스 전체 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
