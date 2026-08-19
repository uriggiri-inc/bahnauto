import React from "react";

export function Field({ label, required = false, error, hint, htmlFor, children }) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", display: "grid", gap: 7 }}>
      <label
        htmlFor={htmlFor}
        style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", lineHeight: 1.3 }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: "var(--color-brand)", marginLeft: 4 }}>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <div style={{ fontSize: 12.5, color: "var(--color-text-sub)", lineHeight: 1.5 }}>
          {hint}
        </div>
      )}
      {error && (
        <div role="alert" style={{ fontSize: 12.5, color: "var(--color-danger)", lineHeight: 1.5 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export function TextInput({ invalid = false, multiline = false, rows = 4, ...rest }) {
  const style = {
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
    transition:
      "border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)",
  };
  if (multiline)
    return (
      <textarea
        rows={rows}
        aria-invalid={invalid || undefined}
        style={{ ...style, minHeight: 120, resize: "vertical", lineHeight: 1.6 }}
        {...rest}
      />
    );
  return <input aria-invalid={invalid || undefined} style={style} {...rest} />;
}
