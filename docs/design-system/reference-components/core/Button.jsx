import React from "react";

const sizes = {
  lg: { padding: "15px 26px", fontSize: 16, minHeight: 52 },
  md: { padding: "12px 20px", fontSize: 15, minHeight: 44 },
  sm: { padding: "9px 14px", fontSize: 14, minHeight: 36 },
};

const variants = {
  primary: {
    background: "var(--color-brand)",
    color: "#fff",
    border: "1px solid transparent",
    boxShadow: "var(--shadow-cta)",
  },
  secondary: {
    background: "#fff",
    color: "var(--color-brand)",
    border: "1px solid var(--color-border-strong)",
    boxShadow: "none",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-text-sub)",
    border: "1px solid transparent",
    boxShadow: "none",
  },
  tel: {
    background: "var(--color-brand-100)",
    color: "var(--color-brand)",
    border: "1px solid var(--color-brand-200)",
    boxShadow: "none",
  },
  onDark: {
    background: "#fff",
    color: "var(--color-brand)",
    border: "1px solid transparent",
    boxShadow: "none",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  full = false,
  icon = null,
  children,
  ...rest
}) {
  const off = disabled || loading;
  const s = {
    ...sizes[size],
    ...variants[variant],
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    borderRadius: "var(--radius-sm)",
    display: full ? "flex" : "inline-flex",
    width: full ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: off ? "not-allowed" : "pointer",
    transition:
      "background var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)",
    whiteSpace: "nowrap",
  };
  if (off)
    Object.assign(s, {
      background: "#EEF1F7",
      color: "#8B919E",
      border: "1px solid transparent",
      boxShadow: "none",
    });
  return (
    <button type="button" disabled={off} style={s} {...rest}>
      {loading && <Spinner />}
      {!loading && icon}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 15,
        height: 15,
        borderRadius: "50%",
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        display: "inline-block",
        animation: "ba-spin .7s linear infinite",
      }}
    />
  );
}
