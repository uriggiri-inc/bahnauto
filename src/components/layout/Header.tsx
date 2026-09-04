"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { buttonClasses } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

/**
 * Sticky GNB. 높이 72px, rgba(255,255,255,.9) + blur(10px).
 *
 * 모바일은 **헤더 바로 아래로 펼쳐지는 드롭다운**이다(풀스크린 오버레이 아님).
 * 경로를 고르면 닫히고 이동한다.
 *
 * ⚠️ 헤더의 CTA 버튼은 요청에 따라 제거했다. 그 결과 모바일에서
 * 스크롤 0~400px 구간에는 상시 노출되는 전환 경로가 없다 —
 * 드롭다운 하단에 CTA 를 넣어 그 구멍을 메운다.
 * (400px 이후에는 MobileStickyCTA 가 담당한다)
 *
 * ── 주요기능 페이지에서는 GNB 가 접힌다 (사용자 확정 2026-08-18) ──
 * `/features*` 에서는 왼쪽에 화면 높이를 다 쓰는 사이드바(`FeatureSideNav`)가
 * 서고 **로고가 그 안으로 들어간다.** 그래서 이 헤더는 그 경로에서
 *   · `fixed` + 배경·테두리 없음 — 자리를 먹지 않아 사이드바가 화면 맨 위에서 시작한다
 *   · 로고를 숨긴다(lg 이상) — 한 화면에 로고가 둘이면 안 된다
 *   · 메뉴를 **알약 버튼 하나로 합쳐** 우측 상단에 둔다. 누르면 왼쪽으로
 *     펼쳐지며 항목이 차례로 들어온다(`--stagger` 토큰이라 모션 축소에서 0ms)
 * 이 접힘은 **lg 이상에서만** 적용된다. 좁은 화면은 사이드바가 가로 띠로 바뀌어
 * 로고를 품지 못하므로 기존 헤더(로고 + 햄버거)를 그대로 쓴다.
 *
 * `/app` 링크에는 반드시 "계약 고객 전용" 라벨이 따라붙는다 — 계약 없는 방문자가
 * 다운로드 → 로그인 실패로 이탈하는 경로를 만들지 않기 위해서다(PRD §2.1).
 * 데스크톱·모바일 **양쪽 모두**에 붙인다. 한쪽만 붙이면 그 화면에서는 규칙이 없는 것과 같다.
 */

export type NavItem = { label: string; href: string };

export type HeaderProps = {
  /** 워드마크형 로고. 높이 24px 이상, 가로 36px 미만 축소 금지(브랜드 규정) */
  logoSrc?: string;
  /** 다크 표면용 워드마크(흰색). 테마 전환 시 CSS 가 이쪽으로 바꾼다 */
  logoDarkSrc?: string;
  nav?: NavItem[];
  util?: NavItem[];
  /** 현재 경로 — 해당 nav 항목이 브랜드 컬러로 표시된다 */
  active?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * 기획 확정 순서 — 좌측 주요기능 / 요금 / 도입절차.
 *
 * 셋 다 상세 페이지가 생겼다. 주요기능은 한동안 홈 앵커(`/#features`)를
 * 가리켰는데, `/features` 상세가 만들어지면서 그쪽으로 옮겼다.
 *
 * `서비스`·`운영 시스템` 은 GNB 에서 내렸다. 기획의 3개 메뉴에 흡수됐고,
 * 라우트 자체는 남아 있어 기존 링크는 계속 열린다(푸터에서 닿는다).
 *
 * `도입 사례` 도 GNB 에서 내렸다가 **2026-09-02 섹션째 폐기됐다**(사용자 지시).
 * 페이지·데이터·푸터 링크가 모두 없다 — 되살리려면 기획부터 다시 받는다.
 */
const DEFAULT_NAV: NavItem[] = [
  /*
    홈 (사용자 지시 2026-08-18).
    로고를 누르면 이미 홈으로 가지만, 로고가 링크라는 걸 모르는 방문자가 있고
    **주요기능 상세에서는 헤더 로고가 아예 숨는다**(사이드바가 로고를 품는다).
    그 화면에서는 이 항목이 홈으로 가는 유일한 상단 경로다.
  */
  { label: "홈", href: "/" },
  // 목차 페이지 없이 1번 기능 상세가 바로 열린다(사용자 확정 2026-08-14).
  // 기능 간 이동은 상세 페이지의 SNB 가 맡는다.
  { label: "주요기능", href: "/features/dashboard" },
  { label: "요금", href: "/pricing" },
  { label: "도입 절차", href: "/process" },
  // 사용자 지시로 추가(2026-08-18). 라우트는 전부터 있었지만 GNB 에는 없어
  // 푸터 링크로만 닿을 수 있었다 — 도입 전 질문이 가장 많이 몰리는 화면이다.
  { label: "자주 묻는 질문", href: "/faq" },
];

/**
 * 우측 유틸.
 *
 * `앱 안내`(→ `/app`) 자리를 **`무료체험`(→ `/trial`)** 으로 바꿨다(노션 시안의
 * 원래 지시). 한동안 되돌려 뒀던 이유는 체험 서비스가 없어서였다 — 그 라벨은
 * "지금 누구나 쓸 수 있다"는 신호를 주는데 도착 화면(`/app`)은 계약자 전용이라
 * 라벨과 내용이 어긋났다. **체험용 웹 대시보드 주소가 확보되면서**(2026-08-14)
 * 도착지가 생겼고, 이제 라벨과 화면이 일치한다.
 *
 * `/app` 페이지는 그대로 남는다(푸터 `앱 로그인` 링크가 가리킨다). 앱은 계약
 * 후에만 쓸 수 있으므로 그 링크의 "계약 고객 전용" 라벨도 그대로 유지한다
 * (PRD §2.1). 체험은 **웹 대시보드**, 앱은 **계약 후** — 두 경로를 섞지 않는다.
 */
const DEFAULT_UTIL: NavItem[] = [
  { label: "매니저 지원", href: "/careers" },
  { label: "무료체험", href: "/trial" },
];

/**
 * `/app` 링크에 반드시 따라붙는 접미. 데스크톱·모바일이 같은 문구를 쓴다.
 *
 * 지금 기본 유틸에는 `/app` 이 없지만 상수를 지우지 않는다 — `util` 은 props 로
 * 갈아끼울 수 있고(`/lab` 검증 화면이 그렇게 쓴다), 그때 라벨 규칙이 함께
 * 사라지면 그 화면에서는 규칙이 없는 것과 같아진다.
 */
const APP_ONLY_NOTE = "· 계약 고객 전용";

/**
 * 지금 보고 있는 페이지의 메뉴 항목인가.
 *
 * ── 왜 문자열 비교로 끝나지 않는가 ──
 * `주요기능` 의 주소는 `/features/dashboard` 인데 방문자는 `/features/biz-support`
 * 에 있을 수 있다. 정확히 같은지만 보면 일곱 기능 중 1번에서만 강조가 켜진다.
 * 그래서 **첫 구간**(`/features`)으로 비교한다.
 *
 * 홈(`/`)은 예외다. 첫 구간이 빈 문자열이라 접두어로 비교하면 모든 경로가
 * 홈으로 판정된다 — 정확히 `/` 일 때만 켠다.
 */
function isCurrent(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  const base = `/${href.split("/")[1] ?? ""}`;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function Header({
  logoSrc = "/brand/logo-horizontal.svg",
  logoDarkSrc = "/brand/logo-horizontal-dark.svg",
  nav = DEFAULT_NAV,
  util = DEFAULT_UTIL,
  active,
  ctaLabel = "무료 방문 진단",
  ctaHref = "/contact",
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /**
   * 주요기능 상세에서만 접힌다. `usePathname` 을 쓰는 이유: 이 헤더는
   * `(site)/layout.tsx` 가 그리는데 레이아웃은 라우트 이동에 다시 렌더되지 않아
   * 서버에서 경로를 내려줄 수 없다.
   */
  const pathname = usePathname();

  /**
   * 현재 위치 판정. `active` prop 이 오면 그것을 따르고(`/lab` 검증 화면이
   * 임의 값을 넣어 배치를 확인한다), 없으면 실제 경로로 정한다.
   *
   * ⚠️ 이 폴백이 없는 동안 **강조가 어디에서도 켜지지 않았다** — `(site)` 레이아웃이
   *    `active` 를 넘기지 않는데(레이아웃은 라우트 이동에 다시 렌더되지 않아
   *    넘길 수도 없다) 아무도 그걸 채우지 않았다.
   */
  const isOn = (href: string) =>
    active !== undefined ? active === href : isCurrent(href, pathname);
  /**
   * 사이드바가 있는 페이지인가(`/features*`).
   *
   * 8/18 오전에는 `collapsed`(메뉴 접힘) 였는데 접기 기능이 사라져 이름이 사실과
   * 어긋났다. 지금 이 값이 가르는 것은 **메뉴 모양이 아니라 헤더의 자리**다:
   *   · 헤더가 `fixed` + 투명 — 사이드바가 화면 맨 위(y=0)에서 시작해야 한다
   *   · 로고를 숨긴다 — 사이드바가 로고를 품고 있어 한 화면에 둘이 된다
   */
  const sidebarPage = pathname?.startsWith("/features") ?? false;

  // Esc 로 닫기 — 키보드 사용자가 갇히지 않게 한다
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 바깥을 누르면 닫는다 — 드롭다운은 화면을 덮지 않으므로 명시적 탈출구가 필요하다
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "z-30",
        /*
          ── 넓은 화면(lg 이상): 배경·테두리 없는 투명 띠 ──
          모든 페이지가 주요기능 페이지와 같은 모양을 쓴다(사용자 지시 2026-08-18).
          로고와 메뉴가 각각 **자기 배경을 든 알약**으로 떠 있고 띠 자체는 비어 있다.
          띠에 배경을 주면 알약 두 개가 같은 색 위에 겹쳐 얹혀 떠 있는 느낌이 사라진다.

          클릭은 통과시킨다(`pointer-events-none`) — 투명한 72px 띠가 그 아래
          본문(주요기능 페이지의 사이드바 로고를 포함)을 가로채면 안 된다.
          알약 세 개(로고·메뉴·테마 토글)만 각자 `pointer-events-auto` 로 되살린다.

          ── 좁은 화면(lg 미만): 불투명 유지 ──
          모바일은 드롭다운이 헤더 바로 아래로 펼쳐지고 로고·햄버거가 본문 위를
          지난다. 띠가 투명하면 어두운 섹션(`bg-ink`·`bg-brand`) 위에서 파란
          로고와 검은 햄버거가 배경에 묻힌다. 알약을 세 개 더 만드는 대신
          기존 불투명 띠를 그대로 쓴다.
        */
        "max-lg:border-border/60 max-lg:sticky max-lg:top-0 max-lg:border-b max-lg:bg-[var(--scrim-nav)] max-lg:backdrop-blur-[10px]",
        "lg:pointer-events-none lg:inset-x-0 lg:top-0",
        /*
          **모든 페이지에서 `fixed`** (사용자 지시 2026-08-18).

          왜: `sticky` 는 흐름 안에 있어 화면 맨 위 72px 을 자기 상자로 차지한다.
          띠가 투명해도 그 뒤에는 아무것도 없으니 **본문 배경색(흰색)이 보이고**,
          그 아래에서 히어로의 그라디언트가 시작한다 — 타이틀 띠와 페이지 사이에
          흰 띠가 한 줄 생겨 두 화면처럼 끊긴다.

          `fixed` 로 빼면 첫 섹션이 y=0 에서 시작해 그 배경이 띠 뒤까지 올라온다.
          내용이 알약 아래로 들어가지 않도록 `globals.css` 의
          `main > :first-child` 규칙이 헤더 높이만큼 안쪽 여백을 준다.
        */
        "lg:fixed",
      )}
    >
      {/*
        ⚠️ `container-ba`(최대 1440px, 가운데 정렬)를 **쓰지 않는다.** 로고와 메뉴가
        화면 양 끝에 붙어야 한다(사용자 확정 2026-08-18). 컨테이너를 쓰면 1920px
        화면에서 양쪽에 240px 씩 여백이 생겨 헤더 요소가 가운데로 몰린다.
        좌우 여백은 본문과 같은 `--gutter`(20~56px)만 준다 — 0 으로 붙이면
        로고 클리어스페이스 규정(로고 높이의 0.25배 이상)을 지킬 수 없다.
      */}
      <div
        className={cn(
          "relative flex h-[var(--header-h)] w-full items-center gap-6 px-[var(--gutter)]",
          /*
            ⚠️ **넓은 화면은 모든 페이지가 `justify-end` 다.** `justify-between` 을
            쓰면 자식이 [로고 알약 · 메뉴 알약 · 테마 토글] 셋이라 남은 공간이
            사이사이로 나뉘어 **메뉴 알약이 화면 가운데로 밀린다.** 주요기능
            페이지만 로고가 숨어 둘이라 우연히 오른쪽에 붙어 있었고, 그래서 두
            화면의 메뉴 위치가 달라졌다(사용자 지적 2026-08-18).

            오른쪽 정렬로 고정하고 로고에 `lg:mr-auto` 를 줘서 로고만 왼쪽으로
            민다. 그러면 로고가 있든 없든 메뉴와 토글의 오른쪽 끝이 같다.

            좁은 화면은 `justify-between` 그대로다 — 로고 왼쪽, 토글·햄버거 오른쪽.
          */
          "max-lg:justify-between lg:justify-end",
        )}
      >
        {/*
          로고. 넓은 화면에서는 **아무 껍데기도 없다** — 로고 그래픽만 뜬다
          (사용자 지시 2026-08-19).

          같은 요청이 세 번에 걸쳐 한 방향으로 왔다:
            8/18  배경·그림자·블러를 빼고 테두리만 남김
            8/19  테두리도 뺌 ← 지금
          메뉴 패널은 글자가 여러 개라 배경이 필요하지만, 로고는 그래픽 하나라
          껍데기 없이도 무엇인지 읽힌다.

          **패딩(`px-5 py-2`)은 남겼다.** 테두리만 지웠으므로 로고 위치가
          그대로다 — 지금 화면에서 아무것도 움직이지 않는다. 그리고 이 여백이
          로고 클리어스페이스 규정(로고 높이의 0.25배 이상)을 지키는 값이다.
          `rounded-full` 도 남겼다: 보이지 않지만 키보드 포커스 윤곽선이 알약
          모양을 유지한다.

          ⚠️ 이제 로고를 감싸는 것이 하나도 없다. 넓은 화면의 헤더 띠는 투명하고
             `fixed` 라 본문이 뒤로 흐르므로, 어두운 섹션(`bg-ink`·`bg-brand`)이
             지나갈 때 파란 워드마크가 그 색에 묻힌다. 테마별 교체
             (`ba-logo-light`/`ba-logo-dark`)는 **다크 모드**를 위한 것이고
             스크롤 위치는 보지 않는다.

             눈에 걸리면 선택지는 둘이다 — 아주 연한 배경을 되살리거나(그때는
             "로고만" 이 아니게 된다), 스크롤 위치에 따라 로고를 흰색으로
             바꾸는 것(JS 가 필요하다. 헤더는 첫 페인트 요소라 값이 비싸다).

          주요기능 페이지에서는 숨는다 — 사이드바가 로고를 품고 있어 한 화면에
          로고가 둘이 된다.
        */}
        <Link
          href="/"
          className={cn(
            "shrink-0 py-1 pr-3",
            // 남은 공간을 전부 오른쪽 여백으로 먹어 로고만 왼쪽 끝에 붙는다
            "lg:mr-auto",
            // 띠가 `pointer-events-none` 이라 클릭을 여기서 되살린다
            "lg:pointer-events-auto lg:rounded-full lg:px-5 lg:py-2",
            sidebarPage && "lg:hidden",
          )}
          aria-label="반오토 홈"
          // 이미 홈에 있을 때는 라우터가 움직이지 않으므로 맨 위(히어로)로 올려준다
          onClick={() => {
            if (window.location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {/*
            기획 지시 "9시 → 3시 방향 모션". 심볼의 링이 9시에서 출발해 위를 지나
            3시로 가는 방향과 같도록 **왼쪽에서 오른쪽으로 한 번** 열린다.
            · CSS 클립패스만 쓴다 — 헤더는 첫 페인트에 들어가는 요소라 JS 를 붙이지 않는다
            · 1회 재생 후 정지. 무한 루프 금지(디자인 시스템 규정)
            · 애니메이션이 적용되지 않아도 로고는 온전히 보인다(기본 상태가 완성형)
            · 모션 축소 설정에서는 `globals.css` 에서 통째로 꺼진다
          */}
          {/*
            선언 크기 61×26 — 자산의 viewBox(610×260)와 같은 비율이다.
            이전에는 132×26 이었다. `w-auto` 가 CSS 로 덮어써서 화면은 멀쩡했지만,
            브라우저가 132×26 으로 자리를 먼저 잡았다가 61px 로 줄어들어
            **로고 오른쪽이 한 번 흔들렸다**(레이아웃 시프트).
            `BrandTicker` 는 처음부터 61×26 으로 맞아 있었다.
          */}
          <Image
            src={logoSrc}
            alt="반오토"
            width={61}
            height={26}
            priority
            className="ba-logo-sweep ba-logo-light h-[26px] w-auto"
          />
          {/* 다크 표면용 — 같은 자리에 심어 두고 CSS 가 고른다(globals.css) */}
          <Image
            src={logoDarkSrc}
            alt=""
            aria-hidden
            width={61}
            height={26}
            loading="eager"
            className="ba-logo-sweep ba-logo-dark h-[26px] w-auto"
          />
        </Link>

        {/*
          ── 데스크톱 메뉴 ──
          **모든 페이지가 같은 모양을 쓴다**(사용자 지시 2026-08-18): 흰 알약 패널
          안에 메뉴가 들어가고 항상 펼쳐져 있다.

          8/18 오전에는 주요기능 페이지에서만 알약 버튼으로 접혀 있었고 눌러야
          펼쳐졌다. 사용자 지시로 **접기·펼치기 기능을 없애고 펼친 상태로
          고정**했다. 그래서 `deskOpen` 상태·토글 버튼·`inert`·stagger 지연이
          전부 사라졌다 — 열려 있는 것이 유일한 상태라 관리할 상태가 없다.

          알약 패널이 **자기 배경을 들고 있다**는 점이 중요하다. 주요기능 페이지의
          헤더는 투명하고(사이드바가 화면 맨 위에서 시작해야 한다) 본문이 그
          아래로 흐르는데, 패널에 배경이 없으면 메뉴 글자와 본문 글자가 겹친다.
        */}
        <nav
          className={cn(
            "border-border/60 hidden items-center gap-7 rounded-full border py-2.5 pr-6 pl-7",
            "bg-[var(--scrim-nav)] shadow-[var(--shadow-card)] backdrop-blur-[10px]",
            "whitespace-nowrap lg:flex",
            "lg:pointer-events-auto",
          )}
          aria-label="주요 메뉴"
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "text-body-sm ease-standard font-medium transition-colors duration-[160ms]",
                isOn(n.href) ? "text-brand font-semibold" : "text-text-sub hover:text-brand",
              )}
              aria-current={isOn(n.href) ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}

          {/* 유틸리티 — 구분선으로 메인 내비와 위계를 분리한다 */}
          <span className="bg-border h-4 w-px" aria-hidden />
          {util.map((u) => (
            <Link
              key={u.href}
              href={u.href}
              className="text-caption text-text-sub hover:text-brand ease-standard transition-colors duration-[160ms]"
            >
              {u.label}
              {/* 색을 지정하지 않는다 — 링크 색(`text-text-sub`, 7.2:1)을 그대로 물려받는다 */}
              {u.href === "/app" && <span className="ml-1">{APP_ONLY_NOTE}</span>}
            </Link>
          ))}
        </nav>

        {/*
          다크/화이트 모드 토글의 자리.
          · 데스크톱 — 유틸 메뉴 오른쪽
          · 모바일 — **메뉴(햄버거) 버튼 바로 왼쪽** (사용자 지정 2026-08-18)

          8/14 에는 모바일에서 헤더 정중앙에 `absolute` 로 고정돼 있었다. 이번
          지시로 흐름 안으로 되돌렸다. `ml-auto` 가 필요한 이유: 부모가
          `justify-between` 이라 그대로 두면 로고·토글·햄버거 셋이 균등하게
          벌어져 토글이 다시 가운데로 간다. 남은 공간을 토글 왼쪽이 전부 먹어
          토글과 햄버거가 오른쪽에서 한 쌍으로 붙는다.
        */}
        <ThemeToggle
          className={cn(
            "max-lg:ml-auto",
            /* 투명 띠 위에서는 배경이 없으면 본문 글자와 겹쳐 읽히지 않는다.
               클릭도 되살려야 한다 — 띠가 `pointer-events-none` 이다 */
            "lg:border-border/60 lg:pointer-events-auto lg:size-10 lg:rounded-full lg:border lg:bg-[var(--scrim-nav)] lg:shadow-[var(--shadow-card)] lg:backdrop-blur-[10px]",
          )}
        />

        {/* ── 모바일 토글 ── */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="ba-mobile-nav"
          className="tap text-ink hover:bg-bg-subtle ease-standard -mr-2 flex shrink-0 items-center justify-center rounded-sm transition-colors duration-[160ms] lg:hidden"
        >
          {open ? <X size={24} weight="regular" /> : <List size={24} weight="regular" />}
        </button>
      </div>

      {/* ── 모바일 드롭다운 — 헤더 바로 아래로 펼쳐진다 ── */}
      {open && (
        <div
          id="ba-mobile-nav"
          className="border-border absolute inset-x-0 top-full origin-top border-b bg-white shadow-[var(--shadow-float)] motion-safe:animate-[ba-dropdown_240ms_var(--ease-brand)] lg:hidden"
        >
          {/* 헤더 바와 같은 여백을 쓴다 — 컨테이너를 쓰면 드롭다운 항목이
              위쪽 로고보다 안쪽으로 들어가 세로선이 어긋난다 */}
          <nav className="w-full px-[var(--gutter)] py-2" aria-label="주요 메뉴">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-body border-border-light ease-standard block border-b py-3.5 font-medium transition-colors duration-[160ms]",
                  isOn(n.href) ? "text-brand" : "text-ink hover:text-brand",
                )}
                aria-current={isOn(n.href) ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 py-4">
              {util.map((u) => (
                <Link
                  key={u.href}
                  href={u.href}
                  onClick={() => setOpen(false)}
                  className="text-body-sm text-text-sub hover:text-brand"
                >
                  {u.label}
                  {/*
                    필수 고지라 `text-text-muted`(#8B919E, 3.1:1)를 쓰지 않는다 —
                    그 토큰은 18px 이상이거나 비필수인 텍스트 전용이다. 색을 비워
                    링크의 `text-text-sub`(7.2:1)를 물려받게 한다.
                  */}
                  {u.href === "/app" && (
                    <span className="text-caption ml-1.5">{APP_ONLY_NOTE}</span>
                  )}
                </Link>
              ))}
            </div>

            {/* 헤더에서 CTA 를 뺐으므로 여기가 스크롤 400px 이전의 유일한 전환 경로다 */}
            {/* data-ga-loc: 하단 고정 바의 같은 문구 CTA 와 구분(GoogleAnalytics.tsx) */}
            <div className="border-border-light border-t py-4" data-ga-loc="mobile_menu">
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className={buttonClasses({ size: "lg", full: true })}
              >
                {ctaLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
