import React from "react";

const ICONS = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5",
  checklist: "M9 11l2 2 4-4M4 4h16v16H4z",
  attendance: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  inventory: "M21 8 12 3 3 8m18 0v8l-9 5-9-5V8m18 0-9 5m0 0L3 8m9 5v8",
  board: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z",
  order:
    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 7h6m-6 4h4",
};

export function TabBar({ items = [], value, onChange = () => {} }) {
  return (
    <nav
      style={{
        fontFamily: "var(--font-sans)",
        display: "grid",
        gridTemplateColumns: `repeat(${items.length},1fr)`,
        background: "#fff",
        borderTop: "1px solid var(--color-border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            aria-current={on ? "page" : undefined}
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              display: "grid",
              justifyItems: "center",
              gap: 4,
              padding: "9px 0 10px",
              minHeight: "var(--tap-min)",
              color: on ? "var(--color-brand)" : "var(--color-text-muted)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={ICONS[it.icon] || ICONS.home} />
            </svg>
            <span style={{ fontSize: 11, fontWeight: on ? 600 : 500, letterSpacing: "-0.01em" }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
