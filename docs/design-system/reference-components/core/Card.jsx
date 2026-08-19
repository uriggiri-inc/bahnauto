import React from "react";

export function Card({
  padding = 24,
  tone = "default",
  hoverable = false,
  children,
  style,
  ...rest
}) {
  const tones = {
    default: {
      background: "var(--color-surface-card)",
      border: "1px solid var(--color-border)",
      color: "var(--color-text)",
    },
    subtle: {
      background: "var(--color-bg-subtle)",
      border: "1px solid var(--color-border-light)",
      color: "var(--color-text)",
    },
    brand: {
      background: "var(--color-brand-50)",
      border: "1px solid var(--color-brand-200)",
      color: "var(--color-text)",
    },
    dark: {
      background: "rgba(255,255,255,.05)",
      border: "1px solid var(--color-border-dark)",
      color: "#fff",
    },
  };
  return (
    <div
      style={{
        ...tones[tone],
        borderRadius: "var(--radius-lg)",
        padding,
        boxShadow: tone === "dark" ? "none" : "var(--shadow-card)",
        transition:
          "transform var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)",
        cursor: hoverable ? "pointer" : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
