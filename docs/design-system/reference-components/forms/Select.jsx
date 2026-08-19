import React from "react";

export function Select({ options = [], placeholder = "선택해 주세요", invalid = false, ...rest }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        aria-invalid={invalid || undefined}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 15.5,
          color: "var(--color-text)",
          background: "#fff",
          border: "1px solid var(--color-border-strong)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 14px",
          width: "100%",
          minHeight: 48,
          outline: "none",
          boxSizing: "border-box",
          borderColor: invalid ? "var(--color-danger)" : "var(--color-border-strong)",
          appearance: "none",
          paddingRight: 40,
          cursor: "pointer",
        }}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 14,
          top: "50%",
          width: 8,
          height: 8,
          borderRight: "2px solid var(--color-text-sub)",
          borderBottom: "2px solid var(--color-text-sub)",
          transform: "translateY(-70%) rotate(45deg)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
