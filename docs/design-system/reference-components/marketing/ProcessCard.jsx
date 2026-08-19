import React from "react";

export function ProcessCard({
  step,
  title,
  description,
  ownerOwner,
  ownerBahnauto,
  tone = "dark",
}) {
  const dark = tone === "dark";
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        background: dark ? "rgba(255,255,255,.05)" : "#fff",
        border: `1px solid ${dark ? "var(--color-border-dark)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: 24,
        boxShadow: dark ? "none" : "var(--shadow-card)",
      }}
    >
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          letterSpacing: "var(--tracking-label)",
          color: dark ? "var(--color-brand-300)" : "var(--color-brand)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {step}
      </div>
      <h3
        style={{
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          margin: "12px 0 0",
          color: dark ? "#fff" : "var(--color-text)",
          wordBreak: "keep-all",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.65,
          color: dark ? "var(--color-text-on-dark-sub)" : "var(--color-text-sub)",
          margin: "10px 0 0",
          textWrap: "pretty",
        }}
      >
        {description}
      </p>
      {(ownerOwner || ownerBahnauto) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 18,
            paddingTop: 16,
            borderTop: `1px solid ${dark ? "var(--color-border-dark)" : "var(--color-border-light)"}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: dark ? "#8B919E" : "var(--color-text-sub)",
                marginBottom: 5,
              }}
            >
              사장님이 하실 일
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: dark ? "#fff" : "var(--color-text)",
                lineHeight: 1.5,
              }}
            >
              {ownerOwner || "—"}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                color: dark ? "#8B919E" : "var(--color-text-sub)",
                marginBottom: 5,
              }}
            >
              반오토가 할 일
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: dark ? "var(--color-brand-300)" : "var(--color-brand)",
                lineHeight: 1.5,
              }}
            >
              {ownerBahnauto || "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
