import React from "react";

const map = {
  normal: { label: "정상", c: "var(--color-success)", bg: "var(--color-success-bg)" },
  working: { label: "근무중", c: "var(--color-brand)", bg: "var(--color-brand-100)" },
  soon: { label: "D-30 이벤트", c: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  discard: { label: "폐기 대상", c: "var(--color-danger)", bg: "var(--color-danger-bg)" },
  done: { label: "완료", c: "var(--color-success)", bg: "var(--color-success-bg)" },
  pending: { label: "검토", c: "var(--color-text-sub)", bg: "var(--color-bg-subtle)" },
};

export function StatusPill({ status = "normal", label }) {
  const s = map[status] || map.normal;
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1,
        color: s.c,
        background: s.bg,
        padding: "6px 10px",
        borderRadius: "var(--radius-full)",
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
      }}
    >
      {label || s.label}
    </span>
  );
}
