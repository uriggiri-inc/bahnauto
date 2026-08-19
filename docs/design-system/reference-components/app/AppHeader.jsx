import React from "react";

export function AppHeader({ title, subtitle, right, onBack }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        background: "#fff",
        borderBottom: "1px solid var(--color-border-light)",
        minHeight: 56,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="뒤로"
          style={{
            width: 32,
            height: 32,
            border: 0,
            background: "transparent",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            padding: 0,
            flex: "0 0 auto",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: 9,
              height: 9,
              borderLeft: "2px solid var(--color-text)",
              borderBottom: "2px solid var(--color-text)",
              transform: "rotate(45deg)",
            }}
          />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12.5, color: "var(--color-text-sub)", marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}
