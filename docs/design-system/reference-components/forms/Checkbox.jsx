import React from "react";

export function Checkbox({ label, description, checked, onChange, required = false, id, ...rest }) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
        minHeight: "var(--tap-min)",
        padding: "4px 0",
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        style={{
          width: 20,
          height: 20,
          marginTop: 2,
          accentColor: "var(--color-brand)",
          flex: "0 0 auto",
          cursor: "pointer",
        }}
        {...rest}
      />
      <span>
        <span style={{ fontSize: 14.5, color: "var(--color-text)", lineHeight: 1.5 }}>
          {required && (
            <span style={{ color: "var(--color-brand)", fontWeight: 600 }}>(필수) </span>
          )}
          {!required && <span style={{ color: "var(--color-text-sub)" }}>(선택) </span>}
          {label}
        </span>
        {description && (
          <span
            style={{
              display: "block",
              fontSize: 12.5,
              color: "var(--color-text-sub)",
              marginTop: 3,
              lineHeight: 1.6,
            }}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
