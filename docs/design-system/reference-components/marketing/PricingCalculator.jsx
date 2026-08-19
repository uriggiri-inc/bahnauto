import React, { useState } from "react";
import { Button } from "../core/Button.jsx";

const won = (n) => new Intl.NumberFormat("ko-KR").format(n);

export function PricingCalculator({
  plans = [],
  defaultPlanId,
  note = "33㎡ 이하 매장 기준",
  onSimulate = () => {},
  onSubmit = () => {},
}) {
  const [id, setId] = useState(defaultPlanId || plans[0]?.id);
  const plan = plans.find((p) => p.id === id) || plans[0];
  const has = plan && plan.monthly > 0;
  const perVisit = has ? Math.round(plan.monthly / plan.visitsPerMonth / 100) * 100 : null;
  const max = Math.max(...plans.map((p) => p.monthly || 0), 1);
  const pick = (p) => {
    setId(p.id);
    onSimulate(p.id);
  };
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        background: "#fff",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-card)",
        padding: 28,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {plans.map((p) => {
          const on = p.id === id;
          return (
            <button
              key={p.id}
              onClick={() => pick(p)}
              style={{
                minHeight: "var(--tap-min)",
                padding: "11px 18px",
                borderRadius: "var(--radius-full)",
                border: `1px solid ${on ? "var(--color-brand)" : "var(--color-border-strong)"}`,
                background: on ? "var(--color-brand)" : "#fff",
                color: on ? "#fff" : "var(--color-text-sub)",
                fontFamily: "inherit",
                fontSize: 14.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all var(--dur-fast) var(--ease-standard)",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 24, display: "grid", gap: 18 }}>
        <div>
          <div style={{ fontSize: 13.5, color: "var(--color-text-sub)" }}>예상 월 이용료</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
            <span
              style={{
                fontSize: "clamp(30px,4vw,44px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--color-brand)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {has ? won(plan.monthly) : "문의"}
            </span>
            {has && (
              <span style={{ fontSize: 18, fontWeight: 600, color: "var(--color-brand)" }}>원</span>
            )}
            <span style={{ fontSize: 12.5, color: "var(--color-text-muted)", marginLeft: 4 }}>
              VAT 별도
            </span>
          </div>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: "var(--radius-full)",
            background: "var(--color-brand-100)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${has ? Math.round((plan.monthly / max) * 100) : 6}%`,
              background: "var(--gradient-brand)",
              borderRadius: "var(--radius-full)",
              transition: "width var(--dur-reveal) var(--ease-out-brand)",
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            paddingTop: 16,
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: "var(--color-text-sub)" }}>월 방문 횟수</div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {plan?.visitsPerMonth}회
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--color-text-sub)" }}>1회 방문당</div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {perVisit ? won(perVisit) + "원" : "문의"}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--color-text-sub)", lineHeight: 1.6 }}>
          {note} · 면적·업종·지역에 따라 달라지며 방문 진단 후 확정됩니다.
        </div>
        <Button size="lg" full onClick={() => onSubmit(id)}>
          정확한 견적 받기
        </Button>
      </div>
    </div>
  );
}
