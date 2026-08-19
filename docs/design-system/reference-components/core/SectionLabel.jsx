import React from "react";

export function SectionLabel({ tone = "brand", children, ...rest }) {
  const color =
    tone === "brand"
      ? "var(--color-brand)"
      : tone === "onDark"
        ? "var(--color-brand-300)"
        : "var(--color-text-muted)";
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-label)",
        fontWeight: 600,
        letterSpacing: "var(--tracking-label)",
        lineHeight: 1,
        color,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
