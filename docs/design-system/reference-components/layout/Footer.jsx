import React from "react";

const COLS = [
  { title: "서비스", links: ["서비스 소개", "운영 시스템", "도입 절차", "요금 안내", "도입 사례"] },
  {
    title: "고객 지원",
    links: ["도입 상담 신청", "자주 묻는 질문", "공지사항", "앱 로그인 (계약 고객 전용)"],
  },
  { title: "회사", links: ["회사 소개", "매장매니저 지원", "대표번호", "이메일", "운영시간"] },
];

export function Footer({
  logoSrc,
  columns = COLS,
  business = [],
  copyright = "© 2026 BAHNAUTO. All rights reserved. 운영: 우리끼리(주)",
}) {
  return (
    <footer
      style={{
        background: "var(--color-ink)",
        color: "#fff",
        fontFamily: "var(--font-sans)",
        padding: "56px 0 40px",
      }}
    >
      <div
        style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter)" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <img
              src={logoSrc}
              alt="반오토 BAHNAUTO"
              style={{ height: 44, width: "auto", display: "block" }}
            />
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.7,
                color: "var(--color-text-on-dark-sub)",
                marginTop: 16,
                maxWidth: 260,
                textWrap: "pretty",
              }}
            >
              자동화되지 않은 나머지 절반, 그 절반을 반오토가 맡습니다.
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-label)",
                  color: "#fff",
                  marginBottom: 14,
                }}
              >
                {c.title}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 9 }}>
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontSize: 13.5,
                        color: "var(--color-text-on-dark-sub)",
                        textDecoration: "none",
                      }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 40,
            paddingTop: 22,
            borderTop: "1px solid var(--color-border-dark)",
            display: "grid",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 18px",
              fontSize: 12.5,
              color: "var(--color-text-on-dark-sub)",
              lineHeight: 1.7,
            }}
          >
            {business.map((b) => (
              <span key={b.label}>
                {b.label} <span style={{ color: "#fff" }}>{b.value}</span>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12.5, marginTop: 2 }}>
            <a href="#" style={{ color: "var(--color-text-on-dark-sub)", textDecoration: "none" }}>
              이용약관
            </a>
            <a href="#" style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}>
              개인정보처리방침
            </a>
          </div>
          <div style={{ fontSize: 12.5, color: "#8B919E", marginTop: 6 }}>{copyright}</div>
        </div>
      </div>
    </footer>
  );
}
