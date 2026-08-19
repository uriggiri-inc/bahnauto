import React from "react";

export function Toast({ tone = "success", title, description, onClose }) {
  const tones = {
    success: { c: "var(--color-success)", bg: "var(--color-success-bg)" },
    danger: { c: "var(--color-danger)", bg: "var(--color-danger-bg)" },
    brand: { c: "var(--color-brand)", bg: "var(--color-brand-100)" },
  };
  const t = tones[tone];
  return (
    <div
      role="status"
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        background: "#fff",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-float)",
        padding: "14px 16px",
        fontFamily: "var(--font-sans)",
        maxWidth: 420,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: t.c,
          marginTop: 7,
          flex: "0 0 auto",
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--color-text)" }}>{title}</div>
        {description && (
          <div
            style={{
              fontSize: 13.5,
              color: "var(--color-text-sub)",
              marginTop: 3,
              lineHeight: 1.6,
            }}
          >
            {description}
          </div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            background: t.bg,
            border: 0,
            color: t.c,
            borderRadius: "var(--radius-full)",
            width: 24,
            height: 24,
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
