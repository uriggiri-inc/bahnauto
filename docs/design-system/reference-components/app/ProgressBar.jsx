import React from "react";

export function ProgressBar({ value = 0, label, showValue = true, height = 10, tone = "brand" }) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = tone === "success" ? "var(--color-success)" : "var(--gradient-brand)";
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {(label || showValue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          {label && <span style={{ fontSize: 13.5, color: "var(--color-text-sub)" }}>{label}</span>}
          {showValue && (
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-brand)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height,
          borderRadius: "var(--radius-full)",
          background: "var(--color-brand-100)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: pct + "%",
            background: fill,
            borderRadius: "var(--radius-full)",
            transition: "width var(--dur-reveal) var(--ease-out-brand)",
          }}
        />
      </div>
    </div>
  );
}
