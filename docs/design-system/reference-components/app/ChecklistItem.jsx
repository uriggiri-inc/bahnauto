import React from "react";

export function ChecklistItem({
  index,
  title,
  done = false,
  photos = 0,
  note,
  onToggle = () => {},
}) {
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "14px 16px",
        background: done ? "var(--color-brand-50)" : "#fff",
        border: `1px solid ${done ? "var(--color-brand-200)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-md)",
        minHeight: "var(--tap-min)",
      }}
    >
      <button
        aria-pressed={done}
        onClick={onToggle}
        aria-label={done ? "완료 취소" : "완료 처리"}
        style={{
          flex: "0 0 auto",
          width: 24,
          height: 24,
          marginTop: 1,
          borderRadius: 7,
          border: `1.8px solid ${done ? "var(--color-brand)" : "var(--color-border-strong)"}`,
          background: done ? "var(--color-brand)" : "#fff",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          padding: 0,
        }}
      >
        {done && (
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: 6,
              height: 11,
              borderRight: "2px solid #fff",
              borderBottom: "2px solid #fff",
              transform: "rotate(45deg) translate(-1px,-1px)",
            }}
          />
        )}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          {index != null && (
            <span
              style={{
                fontSize: 12.5,
                color: "var(--color-text-muted)",
                fontVariantNumeric: "tabular-nums",
                flex: "0 0 auto",
              }}
            >
              {String(index).padStart(2, "0")}
            </span>
          )}
          <span
            style={{
              fontSize: 15,
              fontWeight: done ? 600 : 500,
              color: "var(--color-text)",
              lineHeight: 1.5,
              wordBreak: "keep-all",
            }}
          >
            {title}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 7 }}>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: photos > 0 ? "var(--color-brand)" : "var(--color-danger)",
            }}
          >
            {photos > 0 ? `사진 ${photos}장` : "사진 필요"}
          </span>
          {note && (
            <span
              style={{
                fontSize: 12.5,
                color: "var(--color-text-sub)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
