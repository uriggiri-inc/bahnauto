import { COMPANY } from "@/content/company";
import { FAQ_GROUPS } from "@/content/faq";
import { SITE_URL, absoluteUrl } from "./seo";

/**
 * `/faq` 의 FAQPage 구조화 데이터 (SEO 감사 A7 · 현황판 X-14).
 *
 * ── 화면 데이터에서 그대로 파생시킨다 ──
 * 질문·답변을 손으로 다시 적지 않고 `FAQ_GROUPS` 를 돌린다. 마크업 문장이 화면
 * 문장과 다르면 구글이 스팸 신호로 읽는다 — 손으로 복사해 두면 한쪽만 고쳐지는
 * 순간 그 상태가 된다. (실제로 PR #8 이 `바로출동서비스` → `방문관리 서비스` 로
 * 두 답변을 고쳤다. 파생시켜 두면 이런 개정이 자동으로 따라온다.)
 *
 * `formatCopy` 는 문장 사이에 `<br />` 만 넣고 **글자를 바꾸지 않으므로** 원문
 * 문자열이 화면에 보이는 문장과 같다.
 *
 * ── 24문항 전부를 넣는 근거 ──
 * `FaqTabs` 는 비활성 묶음을 DOM 에서 빼지 않고 `hidden` 으로만 감추고,
 * `FaqList` 는 `<details>` 라 닫힌 답변도 HTML 에 남는다. 즉 24문항의 질문과
 * 답변이 전부 응답 HTML 에 있다 — 마크업에만 있고 화면에는 없는 상태가 아니다.
 * ⚠️ 두 컴포넌트 중 하나라도 조건부 렌더(`{on && …}`)로 바뀌면 이 함수가 내는
 *    범위도 함께 좁혀야 한다. 그대로 두면 없는 내용을 신고하는 셈이 된다.
 *
 * ── 기대치를 부풀리지 않는다 ──
 * 구글은 2023년부터 FAQ **리치결과**(검색결과에 질문이 펼쳐지는 형태)를 정부·보건
 * 사이트로 제한했다. 이 마크업으로 그 형태가 나오지는 않는다. 그래도 넣는 이유는
 * 빙·네이버가 여전히 참고하고, 페이지가 무엇을 다루는지 알리는 신호로는 계속
 * 쓰이기 때문이다. 리치결과를 기대하고 넣는 것이 아니다.
 *
 * ⚠️ `SEARCH_OPEN = false` 인 동안은 색인 자체가 막혀 아무 효과가 없다.
 *    이 저장소에는 `_headers` 같은 이중 방어가 없고 그 한 줄이 유일한 스위치다
 *    (`lib/seo.ts`). 검색 공개(X-07) 이후부터 의미를 갖는다.
 */
export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl("/faq"),
    mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * 사이트 전체에 붙는 발행 주체 정보 (SEO 감사 A7).
 *
 * ── 이름을 왜 이렇게 나눴나 ──
 * 사람들이 검색하는 이름은 **반오토**이고, 법인은 **주식회사 우리끼리**다.
 * `name` 에 반오토를, `legalName` 에 법인을 넣어 둘을 같은 주체로 잇는다.
 * 푸터가 고지하는 사업자 정보와 값이 갈라지면 안 되므로 전부
 * `content/company.ts` 에서 읽는다 — 여기에 값을 다시 적지 않는다.
 *
 * ⚠️ **평점·후기·요금을 넣지 않는다.** schema.org 에는 `aggregateRating` 과
 *    `offers` 가 있지만 이 사이트의 요금·실적은 아직 잠정값이다(현황판 X-06).
 *    검증되지 않은 수치를 구조화 데이터로 신고하면 표시광고법 문제가 그대로
 *    검색결과에 실린다. 확정된 뒤에 넣는다.
 *
 * ⚠️ `telephone`·`email`·주소는 **푸터에 이미 공개된 사업자 정보**다. 개인의
 *    연락처가 아니므로 §1.1 S3(개인정보 기록 금지) 대상이 아니다. 개인 이름이나
 *    담당자 직통 번호를 여기에 넣지 않는다.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "반오토",
    legalName: COMPANY.name,
    url: absoluteUrl("/"),
    /*
      `absoluteUrl()` 을 쓰지 않는다. 그 함수는 `trailingSlash: true` 에 맞춰
      **페이지 경로** 끝에 슬래시를 붙이므로 파일에 쓰면 `og-cover.png/` 가 되어
      404 다. 실제로 한 번 그렇게 나갔고 산출물 실측에서 잡았다.
    */
    logo: `${SITE_URL}/brand/og-cover.png`,
    email: COMPANY.email,
    telephone: COMPANY.tel,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      streetAddress: COMPANY.address,
    },
    // 운영사 홈페이지 — 같은 주체임을 검색엔진이 잇도록 한다
    sameAs: ["https://uriggiri.kr/"],
  };
}

/**
 * `/service` 의 서비스 정의 (SEO 감사 A7).
 *
 * `serviceType` 에 주력 키워드를 그대로 쓴다 — 이 페이지가 무엇에 대한
 * 페이지인지 기계에 알리는 자리다. 화면에는 나타나지 않는다.
 *
 * ⚠️ 여기에도 `offers`(요금)를 넣지 않는다. 이유는 위와 같다.
 * ⚠️ `areaServed` 를 넣지 않았다. 실제 서비스 가능 지역이 확정되지 않았고
 *    (현황판 X-09 대표번호·채널과 함께 대기), 없는 지역을 신고하면 헛걸음
 *    문의가 늘어난다. 지역이 확정되면 여기에 추가한다.
 */
export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "무인매장 관리",
    serviceType: "무인매장 위탁 관리",
    description:
      "무인매장의 청결·재고·응대·점검을 표준 체크리스트와 사진 기록으로 위탁 관리합니다.",
    url: absoluteUrl("/service"),
    provider: {
      "@type": "Organization",
      name: "반오토",
      legalName: COMPANY.name,
      url: absoluteUrl("/"),
    },
  };
}
