import React from "react";

export function Stat({ value, unit, label, tone = "default", align = "left" }) {
  const c = tone === "onDark" ? "#fff" : "var(--color-brand)";
  const sub = tone === "onDark" ? "var(--color-text-on-dark-sub)" : "var(--color-text-sub)";
  return (
    <div style={{ textAlign: align, fontFamily: "var(--font-sans)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        <span
          style={{
            fontSize: "clamp(28px,3.2vw,40px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: c,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {unit && <span style={{ fontSize: 16, fontWeight: 600, color: c }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 14.5, color: sub, marginTop: 6, lineHeight: 1.5 }}>{label}</div>
    </div>
  );
}
