import React from "react";

export function Radio({ name, options = [], value, onChange, columns = 1 }) {
  return (
    <div
      role="radiogroup"
      style={{
        display: "grid",
        gap: 8,
        gridTemplateColumns: `repeat(${columns},1fr)`,
        fontFamily: "var(--font-sans)",
      }}
    >
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        const on = value === v;
        return (
          <label
            key={v}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: "var(--tap-min)",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${on ? "var(--color-brand)" : "var(--color-border-strong)"}`,
              background: on ? "var(--color-brand-50)" : "#fff",
              cursor: "pointer",
              fontSize: 14.5,
              color: "var(--color-text)",
              transition:
                "border-color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)",
            }}
          >
            <input
              type="radio"
              name={name}
              value={v}
              checked={on}
              onChange={onChange}
              style={{
                width: 18,
                height: 18,
                accentColor: "var(--color-brand)",
                cursor: "pointer",
              }}
            />
            {l}
          </label>
        );
      })}
    </div>
  );
}
