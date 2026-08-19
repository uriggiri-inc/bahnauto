import React from "react";
import { Card } from "../core/Card.jsx";

export function FeatureCard({ icon, title, description, items = [], tone = "default" }) {
  const dark = tone === "dark";
  return (
    <Card tone={tone} padding={26}>
      {icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-md)",
            background: dark ? "rgba(255,255,255,.08)" : "var(--color-brand-100)",
            color: dark ? "#fff" : "var(--color-brand)",
            display: "grid",
            placeItems: "center",
            marginBottom: 18,
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          margin: 0,
          color: dark ? "#fff" : "var(--color-text)",
          wordBreak: "keep-all",
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14.5,
            lineHeight: 1.65,
            color: dark ? "var(--color-text-on-dark-sub)" : "var(--color-text-sub)",
            margin: "10px 0 0",
            textWrap: "pretty",
          }}
        >
          {description}
        </p>
      )}
      {items.length > 0 && (
        <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "grid", gap: 8 }}>
          {items.map((i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: dark ? "#fff" : "var(--color-text)",
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                lineHeight: 1.55,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--color-brand)",
                  marginTop: 7,
                  flex: "0 0 auto",
                }}
              />
              {i}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
