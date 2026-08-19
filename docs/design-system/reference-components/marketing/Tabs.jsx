import React, { useState } from "react";

export function Tabs({ items = [], value, onChange, mode = "tabs" }) {
  const [inner, setInner] = useState(items[0]?.id);
  const cur = value ?? inner;
  const set = (id) => {
    onChange ? onChange(id) : setInner(id);
  };
  if (mode === "accordion") {
    return (
      <div
        style={{
          fontFamily: "var(--font-sans)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {items.map((it) => {
          const on = cur === it.id;
          return (
            <div key={it.id} style={{ borderTop: "1px solid var(--color-border-light)" }}>
              <button
                aria-expanded={on}
                onClick={() => set(on ? null : it.id)}
                style={{
                  width: "100%",
                  minHeight: "var(--tap-min)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "16px 18px",
                  background: on ? "var(--color-brand-50)" : "#fff",
                  border: 0,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 15.5,
                  fontWeight: 600,
                  color: on ? "var(--color-brand)" : "var(--color-text)",
                  textAlign: "left",
                }}
              >
                {it.label}
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    borderRight: "2px solid currentColor",
                    borderBottom: "2px solid currentColor",
                    transform: on ? "rotate(-135deg)" : "rotate(45deg)",
                    transition: "transform var(--dur-tab) var(--ease-standard)",
                    flex: "0 0 auto",
                  }}
                />
              </button>
              {on && <div style={{ padding: "0 18px 18px" }}>{it.content}</div>}
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 6,
          borderBottom: "1px solid var(--color-border)",
          overflowX: "auto",
        }}
      >
        {items.map((it) => {
          const on = cur === it.id;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => set(it.id)}
              style={{
                appearance: "none",
                border: 0,
                background: "transparent",
                fontFamily: "inherit",
                fontSize: 15.5,
                fontWeight: 600,
                color: on ? "var(--color-brand)" : "var(--color-text-sub)",
                padding: "14px 16px",
                cursor: "pointer",
                borderBottom: `2px solid ${on ? "var(--color-brand)" : "transparent"}`,
                marginBottom: -1,
                whiteSpace: "nowrap",
                transition: "color var(--dur-tab) var(--ease-standard)",
              }}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        style={{
          paddingTop: 24,
          minHeight: 220,
          animation: "ba-reveal var(--dur-tab) var(--ease-standard)",
        }}
      >
        {items.find((i) => i.id === cur)?.content}
      </div>
    </div>
  );
}
