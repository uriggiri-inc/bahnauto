import React from "react";

const tones = {
  brand: {
    background: "var(--color-brand-100)",
    color: "var(--color-brand)",
    border: "1px solid var(--color-brand-200)",
  },
  neutral: {
    background: "var(--color-bg-subtle)",
    color: "var(--color-text-sub)",
    border: "1px solid var(--color-border)",
  },
  success: {
    background: "var(--color-success-bg)",
    color: "var(--color-success)",
    border: "1px solid transparent",
  },
  warning: {
    background: "var(--color-warning-bg)",
    color: "var(--color-warning)",
    border: "1px solid transparent",
  },
  danger: {
    background: "var(--color-danger-bg)",
    color: "var(--color-danger)",
    border: "1px solid transparent",
  },
  onDark: {
    background: "rgba(255,255,255,.10)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,.18)",
  },
};

export function Badge({ tone = "brand", children, ...rest }) {
  return (
    <span
      style={{
        ...tones[tone],
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        padding: "7px 12px",
        borderRadius: "var(--radius-full)",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
