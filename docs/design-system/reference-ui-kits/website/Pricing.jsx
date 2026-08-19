function Pricing({ go }) {
  const INCLUDED = [
    ["매장 청결 관리", "상시근무 항목 전체 수행"],
    ["재고 실사 및 발주 대행", "유통기한 D-day 관리"],
    ["기기·시설 점검", "이상 발생 시 즉시 보고"],
    ["데일리 리포트 발송", "항목별 사진 포함"],
    ["전담 매니저 배정", "부재 시 대체 인력 운영"],
    ["게시판 · 채널톡 소통", "분실물 · AS · 긴급발주"],
  ];
  return (
    <>
      <Section tone="subtle" style={{ paddingBottom: 40 }}>
        <SectionLabel>요금 안내</SectionLabel>
        <h1
          style={{
            fontSize: "var(--text-h1)",
            fontWeight: 700,
            letterSpacing: "var(--tracking-heading)",
            lineHeight: 1.35,
            margin: "16px 0 0",
            wordBreak: "keep-all",
          }}
        >
          관리 횟수만큼만 지불하세요
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.7,
            color: "var(--color-text-sub)",
            margin: "16px 0 0",
            maxWidth: 640,
            textWrap: "pretty",
          }}
        >
          예상 금액을 먼저 확인하시고, 방문 진단 후 최종 견적을 확정합니다. 표기 금액은 모두 VAT
          별도입니다.
        </p>
      </Section>
      <Section>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}
        >
          <PricingCalculator
            defaultPlanId={PRICING.defaultPlanId}
            note={PRICING.baseNote}
            plans={PRICING.plans}
            onSubmit={() => go("/contact")}
          />
          <div>
            <h2
              style={{
                fontSize: "var(--text-h3)",
                fontWeight: 700,
                letterSpacing: "var(--tracking-h3)",
                margin: 0,
              }}
            >
              전 플랜 공통 포함
            </h2>
            <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
              {INCLUDED.map(([t, d]) => (
                <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--color-brand)", marginTop: 2, flex: "0 0 auto" }}>
                    <Icon d={I.check} size={19} />
                  </span>
                  <span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{t}</span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13.5,
                        color: "var(--color-text-sub)",
                        marginTop: 2,
                      }}
                    >
                      {d}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <Card tone="subtle" padding={18} style={{ marginTop: 26 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                면적 · 업종 · 지역에 따라 달라집니다
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--color-text-sub)",
                  lineHeight: 1.7,
                  margin: "8px 0 0",
                }}
              >
                기준 면적을 초과하거나 관리 범위가 넓은 매장은 금액이 달라집니다. 다점포는 별도
                협의합니다.
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
Object.assign(window, { Pricing });
