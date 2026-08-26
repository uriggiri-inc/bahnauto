import type { Metadata } from "next";
import Image from "next/image";
import { Phone, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Stat } from "@/components/ui/Stat";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { Loader } from "@/components/ui/Loader";
import { ScreenStack, ScreenShot } from "@/components/marketing/ScreenStack";

export const metadata: Metadata = {
  title: "디자인 시스템",
  robots: { index: false, follow: false },
};

/* ── 검증용 로컬 프리미티브 ─────────────────────────────────── */

function Section({
  id,
  label,
  title,
  note,
  children,
}: {
  id: string;
  label: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-border-light border-b py-14">
      <div className="text-label text-brand mb-4 uppercase">{label}</div>
      <h2 className="text-h2 text-ink mb-2">{title}</h2>
      {note && <p className="text-body-sm text-text-sub mb-8 max-w-2xl">{note}</p>}
      <div className={note ? "" : "mt-8"}>{children}</div>
    </section>
  );
}

function Swatch({
  name,
  value,
  contrast,
  warn,
}: {
  name: string;
  value: string;
  contrast?: string;
  warn?: boolean;
}) {
  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <div className="h-20 w-full" style={{ background: value }} />
      <div className="bg-white px-3 py-2.5">
        <div className="text-body-sm text-ink font-semibold">{name}</div>
        <div className="text-caption text-text-sub mt-0.5 uppercase tabular-nums">{value}</div>
        {contrast && (
          <div className={`text-caption mt-1 ${warn ? "text-danger" : "text-success"}`}>
            {contrast}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-border-light flex flex-col gap-3 border-b py-5 last:border-0 md:flex-row md:items-center md:gap-8">
      <div className="text-caption text-text-muted w-full shrink-0 font-mono md:w-56">{label}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/* ── 페이지 ────────────────────────────────────────────────── */

export default function DesignSystemPage() {
  return (
    <main className="container-ba py-16">
      <header className="border-border border-b pb-12">
        <div className="text-label text-brand mb-4 uppercase">Design System</div>
        <h1 className="text-display text-ink mb-4">반오토 디자인 시스템</h1>
        <p className="text-body-lg text-text-sub max-w-2xl">
          토큰 렌더링 검증용 리빙 스타일가이드입니다. 원본 명세는{" "}
          <code className="text-body-sm bg-bg-subtle rounded px-1.5 py-0.5">
            docs/design-system/
          </code>
          , 코드상 정본은{" "}
          <code className="text-body-sm bg-bg-subtle rounded px-1.5 py-0.5">
            src/app/globals.css
          </code>
          의 <code className="text-body-sm bg-bg-subtle rounded px-1.5 py-0.5">@theme</code>{" "}
          블록입니다.
        </p>
        <p className="text-body-sm text-text-muted mt-4">
          이 페이지는 <code>noindex</code> 입니다. 운영 배포에서 검색에 노출되지 않습니다.
        </p>
      </header>

      {/* ─── 로고 ─── */}
      <Section
        id="logo"
        label="Brand"
        title="로고"
        note="원본 SVG는 링 그라데이션이 래스터로 임베드돼 350KB였고, 디자인시스템이 SVG linearGradient로 재구성해 2.4KB로 복구했습니다. 어두운 배경에는 반드시 -dark 버전을 씁니다 — filter: invert() 는 링 그라데이션을 깨뜨리므로 금지."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-border rounded-xl border bg-white p-8">
            <div className="text-caption text-text-muted mb-6">워드마크형 · 최소 36px</div>
            <Image
              src="/brand/logo-horizontal.svg"
              alt="반오토"
              width={200}
              height={85}
              priority
              className="h-14 w-auto"
            />
          </div>
          <div className="border-border rounded-xl border p-8" style={{ background: "#262B3C" }}>
            <div className="text-caption mb-6" style={{ color: "#B9BFCE" }}>
              워드마크형 · dark
            </div>
            <Image
              src="/brand/logo-horizontal-dark.svg"
              alt="반오토"
              width={200}
              height={85}
              className="h-14 w-auto"
            />
          </div>
          <div className="border-border rounded-xl border bg-white p-8">
            <div className="text-caption text-text-muted mb-6">슬로건형 · 최소 60px</div>
            <Image
              src="/brand/logo-slogan.svg"
              alt="반오토 무인매장 위탁 관리 서비스"
              width={260}
              height={97}
              className="h-16 w-auto"
            />
          </div>
          <div className="border-border rounded-xl border bg-white p-8">
            <div className="text-caption text-text-muted mb-6">
              심볼 · 클리어스페이스 0.2X · 파비콘/그래픽 요소 전용
            </div>
            <Image
              src="/brand/symbol.svg"
              alt=""
              width={72}
              height={72}
              className="h-16 w-16"
              aria-hidden
            />
          </div>
        </div>
      </Section>

      {/* ─── 컬러 ─── */}
      <Section
        id="color"
        label="Color"
        title="컬러"
        note="블루가 유일한 브랜드 컬러입니다. 배경은 화이트가 기본이고 섹션 구분은 옅은 블루 틴트로만 합니다 — 한 페이지에 배경색은 최대 2종 + 다크 섹션 1~2회."
      >
        <h3 className="text-h4 text-ink mb-4">Brand</h3>
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          <Swatch name="brand" value="#004ACC" contrast="AAA 7.37:1" />
          <Swatch name="brand-hover" value="#003BA3" />
          <Swatch name="brand-active" value="#002F82" />
          <Swatch name="brand-400" value="#4D86F7" />
          <Swatch name="brand-300" value="#8FB4FF" />
          <Swatch name="brand-200" value="#DBE4FA" />
          <Swatch name="brand-100" value="#EEF3FF" />
          <Swatch name="brand-50" value="#F5F8FF" />
        </div>

        <h3 className="text-h4 text-ink mb-2">Ink / Text</h3>
        <p className="text-body-sm text-text-sub mb-4 max-w-2xl">
          어셋 PDF에 <code>#282828</code> 과 <code>R38 G43 B60</code> 이 함께 표기된 불일치가
          있었으나, 실제 아트워크 픽셀값과 CMYK 청색 편향에 근거해 <strong>#262B3C</strong> 를
          정본으로 확정했습니다.
        </p>
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <Swatch name="ink / text" value="#262B3C" contrast="AAA 14.4:1" />
          <Swatch name="ink-900" value="#1A1E2B" />
          <Swatch name="text-sub" value="#5A6070" contrast="AA 6.4:1" />
          <Swatch name="text-muted" value="#8B919E" contrast="3.1:1 — 본문 금지" warn />
          <Swatch name="on-dark-sub" value="#B9BFCE" />
          <Swatch name="bg" value="#FFFFFF" />
        </div>

        <h3 className="text-h4 text-ink mb-4">Surface / Border</h3>
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <Swatch name="bg-subtle" value="#F7F9FD" />
          <Swatch name="bg-tint" value="#F4F7FD" />
          <Swatch name="border" value="#E8ECF5" />
          <Swatch name="border-light" value="#EEF1F7" />
          <Swatch name="border-strong" value="#D5DCEA" />
        </div>

        <h3 className="text-h4 text-ink mb-2">Semantic</h3>
        <p className="text-body-sm text-text-sub mb-4">
          매장관리 앱의 상태 컬러와 동일하게 맞춰 브랜드 일관성을 유지합니다.
        </p>
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Swatch name="success · 정상" value="#16A34A" />
          <Swatch name="warning · D-30" value="#D97706" />
          <Swatch name="danger · 폐기" value="#DC2626" />
          <Swatch name="success-bg" value="#E9F7EF" />
          <Swatch name="warning-bg" value="#FEF4E6" />
          <Swatch name="danger-bg" value="#FDECEC" />
        </div>

        <h3 className="text-h4 text-ink mb-2">Gradient</h3>
        <p className="text-body-sm text-text-sub mb-4">
          입체·그라데이션 표현은 <strong>심볼 링과 CTA 게이지 단 두 곳</strong>에만 허용합니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="border-border overflow-hidden rounded-lg border">
            <div className="h-20" style={{ background: "var(--gradient-brand)" }} />
            <div className="text-body-sm text-ink px-3 py-2.5 font-semibold">
              gradient-brand
              <span className="text-caption text-text-sub ml-2 font-normal">CTA 게이지</span>
            </div>
          </div>
          <div className="border-border overflow-hidden rounded-lg border">
            <div className="h-20" style={{ background: "var(--gradient-ring)" }} />
            <div className="text-body-sm text-ink px-3 py-2.5 font-semibold">
              gradient-ring
              <span className="text-caption text-text-sub ml-2 font-normal">심볼 링</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 타이포그래피 ─── */}
      <Section
        id="type"
        label="Typography"
        title="타이포그래피"
        note="Pretendard 단일 서체(dynamic subset). 모든 헤딩에 word-break: keep-all 이 적용돼 한글 단어가 중간에서 잘리지 않습니다. 아래 크기는 clamp 기반이라 창 너비를 줄이면 함께 줄어듭니다."
      >
        <Row label="text-display · 700 / -0.035em">
          <div className="text-display text-ink">무인매장은 절반만 자동입니다</div>
        </Row>
        <Row label="text-h1 · 700 / -0.03em">
          <div className="text-h1 text-ink">관리의 결과를 매일 기록으로</div>
        </Row>
        <Row label="text-h2 · 700 / -0.03em">
          <div className="text-h2 text-ink">사람이 바뀌어도 기준은 바뀌지 않습니다</div>
        </Row>
        <Row label="text-h3 · 700 / -0.025em">
          <div className="text-h3 text-ink">체크리스트 기반 매장 관리</div>
        </Row>
        <Row label="text-h4 · 600">
          <div className="text-h4 text-ink">전담 매니저 고정 배치</div>
        </Row>
        <Row label="text-body-lg · 400 / 1.7">
          <p className="text-body-lg text-text-sub max-w-2xl">
            결제와 입장은 자동이지만 청소·재고·응대·점검은 그대로 남습니다.
          </p>
        </Row>
        <Row label="text-body · 400 / 1.75">
          <p className="text-body text-text-sub max-w-2xl">
            매장 업종과 면적에 맞춘 전용 체크리스트를 만들고, 방문마다 항목별 수행 여부와 사진을
            기록합니다.
          </p>
        </Row>
        <Row label="text-body-sm · 400 / 1.65">
          <p className="text-body-sm text-text-sub max-w-2xl">
            퇴근 후에도 쓰레기와 바닥 정리 때문에 다시 매장에 나갑니다.
          </p>
        </Row>
        <Row label="text-label · 600 / 0.06em">
          <div className="text-label text-brand uppercase">반오토 운영 시스템</div>
        </Row>
        <Row label="text-caption · 400">
          <div className="text-caption text-text-sub">VAT 별도 · 33㎡ 이하 매장 기준</div>
        </Row>
        <Row label="숫자 강조 (체크리스트 항목 수)">
          <div className="flex items-baseline gap-1.5">
            <span className="text-display text-brand tabular-nums">319</span>
            <span className="text-body-lg text-text-sub">개 항목</span>
          </div>
        </Row>
      </Section>

      {/* ─── 스페이싱 / Radius ─── */}
      <Section id="space" label="Spacing" title="스페이싱 · Radius">
        <h3 className="text-h4 text-ink mb-4">스페이싱 스케일</h3>
        <div className="mb-10 space-y-2">
          {[4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96].map((n) => (
            <div key={n} className="flex items-center gap-4">
              <span className="text-caption text-text-muted w-12 shrink-0 text-right tabular-nums">
                {n}
              </span>
              <div className="bg-brand-200 h-3 rounded-sm" style={{ width: n }} />
            </div>
          ))}
        </div>

        <h3 className="text-h4 text-ink mb-4">Radius</h3>
        <div className="flex flex-wrap gap-4">
          {[
            ["sm · 10px", "rounded-sm", "버튼 · 인풋"],
            ["md · 14px", "rounded-md", "아이콘 타일"],
            ["lg · 18px", "rounded-lg", "카드"],
            ["xl · 22px", "rounded-xl", "큰 패널"],
            ["2xl · 24px", "rounded-2xl", "폰 프레임"],
            ["full · 999px", "rounded-full", "배지 · 칩"],
          ].map(([label, cls, use]) => (
            <div key={label} className="text-center">
              <div className={`bg-brand-100 border-brand-200 size-24 border ${cls}`} />
              <div className="text-caption text-ink mt-2 font-semibold">{label}</div>
              <div className="text-caption text-text-muted">{use}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── 섀도우 ─── */}
      <Section
        id="shadow"
        label="Effects"
        title="섀도우"
        note="그림자는 항상 블루 틴트입니다. 검정 그림자는 쓰지 않습니다."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["shadow-card", "카드 기본", "0 4px 14px rgba(0,74,204,.06)"],
            ["shadow-float", "떠 있는 요소", "0 14px 34px rgba(24,32,52,.12)"],
            ["shadow-cta", "Primary CTA", "0 10px 24px rgba(0,74,204,.24)"],
          ].map(([cls, label, value]) => (
            <div key={cls}>
              <div className={`border-border rounded-lg border bg-white p-8 ${cls}`}>
                <div className="text-body-sm text-ink font-semibold">{label}</div>
              </div>
              <div className="text-caption text-text-muted mt-3 font-mono break-all">{value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── 모션 ─── */}
      <Section
        id="motion"
        label="Motion"
        title="모션"
        note="스크롤 진입은 opacity + translateY 24px, 500ms, cubic-bezier(0.16,1,0.3,1). 카드 그룹은 60ms 스태거. prefers-reduced-motion 이면 전부 opacity만 남습니다."
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["ease-brand", "cubic-bezier(0.16,1,0.3,1)", "스크롤 진입 · 기본"],
            ["ease-standard", "cubic-bezier(0.4,0,0.2,1)", "hover · 상태 전환"],
            ["dur-fast · 160ms", "버튼 hover", "translateY(-1px)"],
            ["dur-reveal · 500ms", "스크롤 진입", "translateY(24px)→0"],
          ].map(([a, b, c]) => (
            <div key={a} className="border-border rounded-lg border bg-white p-5">
              <div className="text-body-sm text-ink font-semibold">{a}</div>
              <div className="text-caption text-text-sub mt-1 font-mono break-all">{b}</div>
              <div className="text-caption text-text-muted mt-2">{c}</div>
            </div>
          ))}
        </div>
        <div className="bg-bg-subtle border-border mt-6 rounded-lg border p-8">
          <div className="text-body-sm text-ink mb-6 font-semibold">
            브랜드 전용 모션 — 심볼 링 위의 점이 궤도를 1회 돌고 멈춘다
          </div>
          <div className="animate-reveal">
            <Image src="/brand/symbol.svg" alt="" width={64} height={64} aria-hidden />
          </div>
          <p className="text-caption text-text-muted mt-4">
            = 비어 있는 궤도를 채우러 가는 반오토. 바운스·스프링·무한 루프는 쓰지 않습니다.
          </p>
        </div>
      </Section>

      {/* ─── 컴포넌트 ─── */}
      <Section
        id="screens"
        label="App Screens"
        title="앱 화면 — 틀을 쓰지 않는다"
        note="고정 화면비(틀)를 강제하지 않습니다. 캡처의 width/height 로 비율을 잡으므로 어떤 해상도가 와도 한 픽셀도 잘리지 않습니다. 이전에는 아이폰 베젤·카드 틀을 썼는데, 실제 캡처(PC 2000×1093 · 모바일 756×1466)가 그 화면비와 어긋나 탭바 양끝이 잘렸습니다."
      >
        <h3 className="text-h4 text-ink mb-1">ScreenStack · 나란히</h3>
        <p className="text-body-sm text-text-sub mb-4 max-w-[60ch]">
          PC 와 모바일을 한 장으로. 겹치지 않아 <strong>PC 사이드바 메뉴까지 온전히</strong>{" "}
          보입니다. 좁은 화면에서는 세로로 쌓입니다. 배치 비교는{" "}
          <code className="text-caption">/lab/screens</code> 에 있습니다.
        </p>
        <div className="mb-10 max-w-[860px]">
          <ScreenStack
            layout="side"
            pc={{
              src: "/app/report-pc.webp",
              alt: "반오토 앱 오늘의 리포트 화면 (PC)",
              width: 1910,
              height: 861,
            }}
            mobile={{
              src: "/app/checklist-mobile.webp",
              alt: "반오토 앱 업무 체크리스트 화면",
              width: 756,
              height: 1466,
            }}
          />
        </div>

        <h3 className="text-h4 text-ink mb-1">ScreenShot · 한 장</h3>
        <p className="text-body-sm text-text-sub mb-4 max-w-[60ch]">
          짝이 없거나 한 장으로 충분한 자리에 씁니다. 가로·세로 어느 쪽이든 원본 비율을 유지하므로
          호출부가 <code className="text-caption">max-w</code> 로 폭만 정합니다.
        </p>
        <div className="flex flex-wrap items-end gap-6">
          <ScreenShot
            shot={{
              src: "/app/inventory-pc.webp",
              alt: "반오토 앱 재고관리 화면 (PC)",
              width: 2000,
              height: 1093,
            }}
            caption="가로 · PC"
            sizes="560px"
            className="max-w-[560px]"
          />
          <ScreenShot
            shot={{
              src: "/app/checklist-mobile.webp",
              alt: "반오토 앱 업무 체크리스트 화면",
              width: 756,
              height: 1466,
            }}
            caption="세로 · 모바일"
            sizes="220px"
            className="max-w-[220px]"
          />
        </div>
      </Section>

      <Section
        id="components"
        label="Components"
        title="코어 컴포넌트"
        note="디자인시스템 원본은 인라인 스타일이라 hover·focus·미디어쿼리를 표현하지 못했습니다. API(.d.ts)는 그대로 두고 Tailwind로 옮겨 상태를 살렸습니다. 아래 요소에 마우스를 올리거나 Tab으로 이동해 확인해 보세요."
      >
        <h3 className="text-h4 text-ink mb-4">Button · variant</h3>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Button variant="primary">무료 방문 진단 신청</Button>
          <Button variant="secondary">예상 견적 보기</Button>
          <Button variant="ghost">자세히 보기</Button>
          <Button variant="tel" icon={<Phone size={17} weight="regular" />}>
            전화 상담
          </Button>
        </div>

        <h3 className="text-h4 text-ink mb-4">Button · size</h3>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Button size="lg">Large · 52px</Button>
          <Button size="md">Medium · 44px</Button>
          <Button size="sm">Small · 36px</Button>
        </div>

        <h3 className="text-h4 text-ink mb-4">Button · state</h3>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Button loading>제출 중</Button>
          <Button disabled>비활성</Button>
          <Button icon={<ArrowRight size={17} weight="bold" />}>아이콘 포함</Button>
        </div>

        <h3 className="text-h4 text-ink mb-4">Button · onDark</h3>
        <div className="bg-ink mb-10 flex flex-wrap items-center gap-3 rounded-lg p-6">
          <Button variant="onDark">도입 문의하기</Button>
          <Button variant="ghost" className="text-white/80 hover:bg-white/10 hover:text-white">
            서비스 살펴보기
          </Button>
        </div>

        <h3 className="text-h4 text-ink mb-2">Badge</h3>
        <p className="text-body-sm text-text-sub mb-4">
          시맨틱 톤은 매장관리 앱의 상태 컬러와 동일합니다. 이모지 대신 색 + 텍스트로 상태를
          표시합니다.
        </p>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="brand">체크리스트</Badge>
          <Badge tone="neutral">검토</Badge>
          <Badge tone="success">정상</Badge>
          <Badge tone="warning">D-30 임박</Badge>
          <Badge tone="danger">폐기 대상</Badge>
        </div>
        <div className="bg-ink mb-10 rounded-lg p-5">
          <Badge tone="onDark">다크 섹션 위</Badge>
        </div>

        <h3 className="text-h4 text-ink mb-4">SectionLabel</h3>
        <div className="mb-2 flex flex-wrap items-center gap-8">
          <SectionLabel>반오토 운영 시스템</SectionLabel>
          <SectionLabel tone="muted">도입 절차</SectionLabel>
        </div>
        <div className="bg-ink mb-4 rounded-lg p-5">
          <SectionLabel tone="onDark">요금 안내</SectionLabel>
        </div>
        <p className="text-body-sm text-danger mb-10">
          ⚠ 남용 금지 — 섹션 3개당 최대 1개. 모든 섹션에 붙이면 템플릿처럼 읽힙니다. 번호 매기기
          (001 · Capabilities) 는 쓰지 않습니다.
        </p>

        <h3 className="text-h4 text-ink mb-4">Card</h3>
        <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-h4 text-ink mb-2">default</p>
            <p className="text-body-sm text-text-sub">화이트 + 1px 보더 + 블루 틴트 섀도우</p>
          </Card>
          <Card tone="subtle">
            <p className="text-h4 text-ink mb-2">subtle</p>
            <p className="text-body-sm text-text-sub">섹션 내부 그룹핑</p>
          </Card>
          <Card tone="brand">
            <p className="text-h4 text-ink mb-2">brand</p>
            <p className="text-body-sm text-text-sub">강조 블록</p>
          </Card>
          <Card tone="dark">
            <p className="text-h4 mb-2 text-white">dark</p>
            <p className="text-body-sm text-white/70">다크 섹션 위</p>
          </Card>
        </div>
        <div className="mb-10">
          <Card hoverable className="max-w-sm">
            <p className="text-h4 text-ink mb-2">hoverable</p>
            <p className="text-body-sm text-text-sub">
              클릭 가능한 카드에만 씁니다. 마우스를 올려보세요.
            </p>
          </Card>
        </div>

        <h3 className="text-h4 text-ink mb-2">Stat</h3>
        <p className="text-body-sm text-danger mb-4">
          ⚠ 검증된 실측값에만 사용 — 표시광고법. 실적 수치 미확보 상태이므로 시스템에서 직접
          확인되는 값만 예시로 씁니다.
        </p>
        <div className="border-border mb-6 grid grid-cols-2 gap-6 rounded-lg border bg-white p-6 md:grid-cols-4">
          <Stat value="10" unit="개 항목" label="상시근무 체크리스트" />
          <Stat value="319" unit="개" label="체크리스트 총 항목" />
          <Stat value="4" unit="주차" label="주차별 점검 주기" />
          <Stat value="1" unit="장 이상" label="항목별 사진 기록" />
        </div>
        <div className="bg-ink mb-10 grid grid-cols-2 gap-6 rounded-lg p-6 md:grid-cols-4">
          <Stat
            value="10"
            unit="개 항목"
            label="상시근무 체크리스트"
            tone="onDark"
            align="center"
          />
          <Stat value="319" unit="개" label="체크리스트 총 항목" tone="onDark" align="center" />
        </div>

        <h3 className="text-h4 text-ink mb-4">ScrollCue</h3>
        <div className="border-border mb-10 flex justify-center rounded-lg border bg-white py-8">
          <ScrollCue />
        </div>

        <h3 className="text-h4 text-ink mb-2">Loader</h3>
        <p className="text-body-sm text-text-sub mb-4 max-w-2xl">
          흔한 &ldquo;점 3개&rdquo; 대신 브랜드 심볼의 링을 씁니다. 디자인시스템이 심볼의 용도로
          로딩 인디케이터를 명시적으로 허용합니다. <strong className="text-ink">JS 0바이트</strong>{" "}
          — 로더가 뜨는 순간은 아직 번들이 준비되지 않은 때이므로 애니메이션 라이브러리에 의존하면
          안 됩니다.
        </p>
        <div className="border-border flex flex-wrap items-end justify-center gap-12 rounded-lg border bg-white py-10">
          <div className="text-center">
            <Loader size="sm" />
            <p className="text-caption text-text-sub mt-3">sm · 24px</p>
          </div>
          <div className="text-center">
            <Loader size="md" />
            <p className="text-caption text-text-sub mt-3">md · 40px</p>
          </div>
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-caption text-text-sub mt-3">lg · 64px</p>
          </div>
          <div className="text-center">
            <Loader size="lg" showLabel />
            <p className="text-caption text-text-sub mt-3">라벨 노출</p>
          </div>
        </div>
        <p className="text-body-sm text-text-sub mt-4">
          루트 <code className="bg-bg-subtle rounded px-1.5 py-0.5">app/loading.tsx</code> 에 연결돼
          있어 라우트 전환·스트리밍 대기 시 Next.js 가 자동으로 표시합니다.
        </p>
      </Section>

      {/* ─── 접근성 ─── */}
      <Section
        id="a11y"
        label="Accessibility"
        title="접근성 기준"
        note="WCAG 2.1 AA 준수. 아래 요소는 키보드로 Tab 이동해 포커스 링을 직접 확인해 보세요."
      >
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="text-body-sm bg-brand shadow-cta ease-standard hover:bg-brand-hover active:bg-brand-active rounded-sm px-5 py-3 font-semibold text-white transition-[background,transform,box-shadow] duration-[160ms] hover:-translate-y-px active:translate-y-0"
          >
            포커스 링 확인용 버튼
          </button>
          <a href="#logo" className="text-body-sm text-brand font-semibold underline">
            포커스 링 확인용 링크
          </a>
          <label className="text-body-sm text-text-sub flex items-center gap-2">
            <input type="checkbox" className="accent-brand size-4" />
            체크박스
          </label>
        </div>
        <ul className="text-body-sm text-text-sub mt-8 max-w-2xl list-disc space-y-2 pl-5">
          <li>포커스 링: 2px solid #004ACC, offset 2px — 예외 없이 가시적</li>
          <li>모바일 터치 타깃 최소 44×44px</li>
          <li>#8B919E 는 3.1:1 이므로 본문·폼 라벨·오류 메시지에 사용 금지</li>
          <li>이모지 사용 금지 — 상태 표시는 색 + 텍스트 배지로</li>
        </ul>
      </Section>
    </main>
  );
}
