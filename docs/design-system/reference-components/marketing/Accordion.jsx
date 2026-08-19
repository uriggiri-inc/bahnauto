import React, { useState } from "react";

export function Accordion({ items = [], defaultOpen = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ fontFamily: "var(--font-sans)", display: "grid", gap: 10 }}>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${on ? "var(--color-brand-200)" : "var(--color-border)"}`,
              borderRadius: "var(--radius-md)",
              background: on ? "var(--color-brand-50)" : "#fff",
              overflow: "hidden",
              transition: "border-color var(--dur-tab) var(--ease-standard)",
            }}
          >
            <button
              aria-expanded={on}
              onClick={() => setOpen(on ? null : i)}
              style={{
                width: "100%",
                minHeight: "var(--tap-min)",
                display: "flex",
                gap: 14,
                alignItems: "center",
                justifyContent: "space-between",
                padding: "17px 20px",
                background: "transparent",
                border: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 15.5,
                fontWeight: 600,
                color: "var(--color-text)",
                textAlign: "left",
                wordBreak: "keep-all",
              }}
            >
              {it.q}
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRight: "2px solid var(--color-text-sub)",
                  borderBottom: "2px solid var(--color-text-sub)",
                  transform: on ? "rotate(-135deg)" : "rotate(45deg)",
                  transition: "transform var(--dur-tab) var(--ease-standard)",
                  flex: "0 0 auto",
                }}
              />
            </button>
            {on && (
              <div
                style={{
                  padding: "0 20px 20px",
                  fontSize: 14.5,
                  lineHeight: 1.75,
                  color: "var(--color-text-sub)",
                  textWrap: "pretty",
                }}
              >
                {it.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
