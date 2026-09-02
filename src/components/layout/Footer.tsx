import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/content/company";
import { LEGAL_URLS } from "@/content/legal/urls";

/**
 * 4단 푸터 + 법정 사업자 정보 블록.
 *
 * ⚠️ 개인정보처리방침 링크는 **굵게 강조**한다(법적 권고).
 * ⚠️ 사업자 정보는 2026-09-01 통신판매업신고번호가 들어오면서 **전 항목이 확정값**이
 *    되었다. `pending: true` 를 붙이면 `[값]` 형태에 경고색으로 그려지는 장치는
 *    그대로 남아 있다 — 미확정 값이 확정값처럼 오픈되는 사고를 막는 안전장치다.
 * ⚠️ 앱 로그인에는 반드시 "계약 고객 전용" 라벨이 따라붙는다(PRD §2.1).
 */

type Column = {
  title: string;
  links: Array<{
    label: string;
    href: string;
    note?: string;
    /**
     * 사이트 밖으로 나가는 링크. `true` 면 `<a target="_blank">` 로 그린다.
     *
     * `next/link` 를 쓰지 않는 이유: 라우터 프리페치가 외부 주소에는 의미가
     * 없고, 새 창 지정도 하지 않는다. 새 창으로 여는 이유는 방문자가 보던
     * 페이지를 잃지 않게 하기 위해서다 — 푸터 링크는 대개 읽던 중에 누른다.
     */
    external?: boolean;
  }>;
};
type BusinessItem = { label: string; value: string; pending?: boolean };

export type FooterProps = {
  logoSrc?: string;
  columns?: Column[];
  business?: BusinessItem[];
  copyright?: string;
};

const DEFAULT_COLUMNS: Column[] = [
  {
    title: "서비스",
    links: [
      { label: "주요기능", href: "/features/dashboard" },
      { label: "도입 절차", href: "/process" },
      { label: "요금 안내", href: "/pricing" },
      { label: "도입 사례", href: "/cases" },
    ],
  },
  {
    title: "고객 지원",
    links: [
      { label: "무료 방문 진단 신청", href: "/contact" },
      { label: "자주 묻는 질문", href: "/faq" },
      { label: "공지사항", href: "/news" },
      { label: "앱 로그인", href: "/app", note: "계약 고객 전용" },
    ],
  },
  {
    title: "회사",
    links: [
      /*
        운영사 우리끼리(주) 홈페이지로 바로 보낸다(사용자 지시 2026-08-18).
        사이트 안의 `/company` 페이지가 아니라 **외부 주소**다.

        ⚠️ `/company` 라우트는 그대로 남는다. 홈의 "회사 소개 보기" 버튼이
           아직 그쪽을 가리키므로 죽은 페이지가 되지는 않는다. 다만 이제
           **같은 이름의 링크가 두 곳을 가리킨다** — 푸터는 우리끼리 홈페이지,
           홈 버튼은 사이트 내부 페이지. 하나로 정리할지는 기획 판단이 필요하다.
      */
      { label: "회사 소개", href: "https://uriggiri.kr/", external: true },
      { label: "매장매니저 지원", href: "/careers" },
    ],
  },
];

/**
 * 법정 사업자 정보. 값의 정본은 `content/company.ts` 이고, 그 출처는
 * 약관·개인정보처리방침 원본이다. 세 곳의 값이 어긋나면 그 자체가 문제가 된다.
 */
const DEFAULT_BUSINESS: BusinessItem[] = [
  { label: "상호명", value: COMPANY.name },
  { label: "대표자", value: COMPANY.ceo },
  { label: "사업자등록번호", value: COMPANY.bizNo },
  { label: "통신판매업신고", value: COMPANY.mailOrderNo },
  { label: "주소", value: COMPANY.address },
  { label: "개인정보보호책임자", value: COMPANY.privacyOfficer },
  { label: "대표전화", value: COMPANY.tel },
  { label: "호스팅 제공", value: COMPANY.hosting },
];

export function Footer({
  logoSrc = "/brand/logo-slogan-dark.svg",
  columns = DEFAULT_COLUMNS,
  business = DEFAULT_BUSINESS,
  copyright = "© 2026 BAHNAUTO. All rights reserved.",
}: FooterProps) {
  return (
    <footer className="bg-ink text-white">
      {/*
        푸터는 본문(1120px)보다 넓게 쓴다. 1120px 로 묶으면 넓은 화면에서
        컬럼이 가운데로 뭉치고 우측에 죽은 공간이 크게 남는다.
        컬럼도 우측 끝까지 고르게 퍼지도록 비율을 조정했다.
      */}
      <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)] py-8 lg:py-10">
        {/*
          모바일에서 컬럼을 세로로 쌓으면 사업자 정보 위쪽만 3화면을 먹는다.
          링크가 짧으므로 모바일에서도 3열로 나란히 둬 한 화면에 담는다.
          데스크톱에서는 로고 블록이 좌측에 붙는 4열 배치로 돌아간다.
        */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-14">
          <div>
            <Image
              src={logoSrc}
              alt="반오토 — 무인매장 위탁 관리 서비스"
              width={200}
              height={75}
              className="h-auto w-[150px] lg:w-[180px]"
            />
            <p className="text-body-sm mt-4 max-w-[280px] text-white/60 lg:mt-5">
              자동화되지 않은 나머지 절반,
              <br />그 절반을 반오토가 맡습니다.
            </p>
          </div>

          {/* 모바일 전용 3열 래퍼 — lg 이상에서는 부모 그리드에 그대로 흡수된다 */}
          <div className="grid grid-cols-3 gap-4 lg:contents">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-label mb-3 text-white/90 lg:mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5 lg:gap-3">
                  {col.links.map((l) => {
                    const linkClass =
                      "text-caption lg:text-body-sm ease-standard block text-white/60 transition-colors duration-[160ms] hover:text-white";
                    return (
                      <li key={l.href}>
                        {l.external ? (
                          /*
                          `rel="noopener"` 는 새 창이 원본 창을 조작하지 못하게 막는다
                          (`window.opener` 차단). `noreferrer` 는 우리 주소를 리퍼러로
                          넘기지 않는다 — 지금은 `noindex` 상태라 굳이 흘릴 이유가 없다.
                          외부로 나간다는 사실을 스크린리더에도 알린다.
                        */
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                          >
                            {l.label}
                            <span className="sr-only"> (새 창으로 열림)</span>
                            <span aria-hidden className="ml-1 text-white/40">
                              ↗
                            </span>
                          </a>
                        ) : (
                          <Link href={l.href} className={linkClass}>
                            {l.label}
                          </Link>
                        )}
                        {l.note && (
                          <span className="text-caption block text-white/35 lg:ml-1.5 lg:inline">
                            {l.note}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* ── 법정 사업자 정보 ──
          기획 요청(2026-08-14 캡처)으로 세로 격자 → 가로 흐름으로 압축했다.
          푸터 전체가 한 화면에 들어오는 것이 목표. 항목은 전부 법정 정보라
          줄이지 않는다 — 배치만 바꾼다. */}
      <div className="border-t border-white/12">
        <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)] py-5">
          <dl className="mb-4 flex flex-wrap gap-x-6 gap-y-1.5">
            {/* dt 만 줄바꿈을 금지한다 — 주소처럼 긴 값은 dd 안에서 접혀야 모바일에서 안 넘친다 */}
            {business.map((b) => (
              <div key={b.label} className="text-caption flex gap-1.5">
                <dt className="shrink-0 whitespace-nowrap text-white/40">{b.label}</dt>
                <dd className={b.pending ? "text-warning" : "text-white/70"}>
                  {b.pending ? `[${b.value}]` : b.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/8 pt-4">
            {/*
              2026-09-02 사용자 지시로 **노션 원본으로 직접 보낸다**(`content/legal/urls.ts`).
              사이트 안의 사본(`/terms`·`/privacy`)을 거치면 법무가 고칠 때마다 옮겨
              적어야 하고 그 사이 두 문서가 어긋난다.

              새 창으로 여는 이유는 컬럼 링크와 같다 — 읽던 페이지를 잃지 않게 한다.
              `next/link` 를 쓰지 않는 것도 같은 이유다(외부 주소에 프리페치는 무의미).
            */}
            <a
              href={LEGAL_URLS.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="text-caption text-white/60 hover:text-white"
            >
              이용약관
              <span className="sr-only"> (새 창으로 열림)</span>
              <span aria-hidden className="ml-1 text-white/40">
                ↗
              </span>
            </a>
            {/* 법적 권고 — 개인정보처리방침은 굵게 강조 */}
            <a
              href={LEGAL_URLS.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="text-caption font-bold text-white/85 hover:text-white"
            >
              개인정보처리방침
              <span className="sr-only"> (새 창으로 열림)</span>
              <span aria-hidden className="ml-1 text-white/50">
                ↗
              </span>
            </a>
            <span className="text-caption text-white/30">운영: 우리끼리(주)</span>
            <span className="text-caption text-white/30 sm:ml-auto">{copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
