import React from "react";

export function MobileStickyCTA({
  telLabel = "전화 상담",
  ctaLabel = "상담 신청",
  onTel = () => {},
  onCta = () => {},
  visible = true,
}) {
  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        display: visible ? "grid" : "none",
        gridTemplateColumns: "1fr 1.2fr",
        gap: 10,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
        background: "rgba(255,255,255,.94)",
        backdropFilter: "var(--blur-nav)",
        WebkitBackdropFilter: "var(--blur-nav)",
        borderTop: "1px solid var(--color-border)",
        fontFamily: "var(--font-sans)",
        zIndex: 40,
      }}
    >
      <button
        onClick={onTel}
        style={{
          minHeight: "var(--tap-min)",
          border: "1px solid var(--color-brand-200)",
          background: "var(--color-brand-100)",
          color: "var(--color-brand)",
          fontFamily: "inherit",
          fontWeight: 600,
          fontSize: 15,
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
      >
        {telLabel}
      </button>
      <button
        onClick={onCta}
        style={{
          minHeight: "var(--tap-min)",
          border: 0,
          background: "var(--color-brand)",
          color: "#fff",
          fontFamily: "inherit",
          fontWeight: 600,
          fontSize: 15,
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-cta)",
          cursor: "pointer",
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
