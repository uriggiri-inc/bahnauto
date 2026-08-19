import React from "react";

export function PhoneFrame({ width = 280, caption, children }) {
  const h = Math.round(width * (844 / 390));
  return (
    <figure style={{ margin: 0, fontFamily: "var(--font-sans)", width }}>
      <div
        style={{
          width,
          height: h,
          borderRadius: 24,
          border: "1px solid var(--color-border)",
          background: "#fff",
          boxShadow: "var(--shadow-float)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 23 }}>
          {children}
        </div>
      </div>
      {caption && (
        <figcaption
          style={{
            fontSize: 13.5,
            color: "var(--color-text-sub)",
            marginTop: 12,
            lineHeight: 1.55,
            textWrap: "pretty",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
