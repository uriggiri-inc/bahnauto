import React, { useState } from "react";
import { Button } from "../core/Button.jsx";

const NAV = [
  { label: "서비스", href: "/service" },
  { label: "운영시스템", href: "/system" },
  { label: "도입절차", href: "/process" },
  { label: "요금", href: "/pricing" },
  { label: "도입사례", href: "/cases" },
];
const UTIL = [
  { label: "매니저 지원", href: "/careers" },
  { label: "앱 로그인", href: "/app" },
];

export function Header({
  logoSrc,
  nav = NAV,
  util = UTIL,
  active,
  onNavigate = () => {},
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const go = (href) => {
    setOpen(false);
    onNavigate(href);
  };
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 72,
        background: "var(--scrim-nav)",
        backdropFilter: "var(--blur-nav)",
        WebkitBackdropFilter: "var(--blur-nav)",
        borderBottom: "1px solid var(--color-border-light)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          height: "100%",
          padding: "0 var(--gutter)",
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go("/");
          }}
          style={{ display: "flex", alignItems: "center", padding: "0 6px", flex: "0 0 auto" }}
        >
          <img
            src={logoSrc}
            alt="반오토 BAHNAUTO"
            style={{ height: 24, width: "auto", minWidth: 88, display: "block" }}
          />
        </a>
        {!compact && (
          <nav style={{ display: "flex", gap: 24, marginLeft: 8 }}>
            {nav.map((n) => (
              <a
                key={n.href}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  go(n.href);
                }}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: active === n.href ? "var(--color-brand)" : "var(--color-text-sub)",
                  textDecoration: "none",
                  transition: "color var(--dur-fast) var(--ease-standard)",
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18 }}>
          {!compact && (
            <div
              style={{
                display: "flex",
                gap: 14,
                paddingRight: 18,
                borderRight: "1px solid var(--color-border)",
              }}
            >
              {util.map((u) => (
                <a
                  key={u.href}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    go(u.href);
                  }}
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--color-text-muted)",
                    textDecoration: "none",
                  }}
                >
                  {u.label}
                </a>
              ))}
            </div>
          )}
          <Button size="md" onClick={() => go("/contact")}>
            도입 문의
          </Button>
          {compact && (
            <button
              aria-label="메뉴 열기"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              style={{
                width: 44,
                height: 44,
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                background: "#fff",
                display: "grid",
                placeItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <span
                style={{ display: "block", width: 18, height: 2, background: "var(--color-text)" }}
              />
              <span
                style={{ display: "block", width: 18, height: 2, background: "var(--color-text)" }}
              />
              <span
                style={{ display: "block", width: 18, height: 2, background: "var(--color-text)" }}
              />
            </button>
          )}
        </div>
      </div>
      {compact && open && (
        <div
          style={{
            position: "fixed",
            inset: "72px 0 0",
            background: "#fff",
            padding: "20px var(--gutter) 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 60,
            animation: "ba-slide-in var(--dur-menu) var(--ease-out-brand)",
          }}
        >
          {[...nav, ...util].map((n) => (
            <a
              key={n.href}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go(n.href);
              }}
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-text)",
                textDecoration: "none",
                padding: "14px 0",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              {n.label}
            </a>
          ))}
          <div style={{ marginTop: "auto", display: "grid", gap: 10, paddingTop: 20 }}>
            <Button size="lg" full onClick={() => go("/contact")}>
              도입 상담 신청
            </Button>
            <Button size="lg" full variant="tel">
              전화 문의
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
