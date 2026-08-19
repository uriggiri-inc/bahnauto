function Careers() {
  const [move, setMove] = React.useState("대중교통");
  const DUTY = [
    "장난감 및 자동차 정리 정돈",
    "정글짐 내부 정리정돈",
    "청소기 & 정전기포",
    "물걸레 청소",
    "휴게공간 테이블 & 의자 닦기",
    "매점매대 정돈 및 고객 편의용품 채우기",
    "휴지통 비우기 (분리수거 및 일반쓰레기)",
    "사용한 청소도구 정돈",
    "청소 완료 사진 촬영",
    "창문 문 단속, 조명, 냉난방기 확인 및 소등",
  ];
  return (
    <>
      <Section tone="subtle" style={{ paddingBottom: 40 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr .9fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <SectionLabel>매장매니저 지원</SectionLabel>
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
              앱이 알려주는 대로만 하시면 됩니다
            </h1>
            <p
              style={{
                fontSize: "var(--text-body-lg)",
                color: "var(--color-text-sub)",
                lineHeight: 1.7,
                margin: "16px 0 0",
                maxWidth: 480,
                textWrap: "pretty",
              }}
            >
              집 근처 무인매장을, 정해진 시간에, 체크리스트대로. 무엇을 해야 하는지는 앱이 항목으로
              알려드립니다.
            </p>
          </div>
          <div style={{ display: "grid", placeItems: "center" }}>
            <PhoneFrame width={230}>
              <AppMockChecklist />
            </PhoneFrame>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHead
          label="하는 일"
          title="상시근무 10개 항목, 그대로 공개합니다"
          lead="추상적인 설명 대신 실제 체크리스트 항목을 그대로 보여드립니다."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 9 }}>
          {DUTY.map((d, i) => (
            <div
              key={d}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "13px 16px",
                background: "#fff",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  color: "var(--color-brand)",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 14.5, wordBreak: "keep-all" }}>{d}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="subtle">
        <SectionHead label="근무 조건" title="확인해 주세요" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            ["근무 시간대", "앱상 출퇴근 인정 시간 18:00 ~ 10:00", "[확정 필요 — 실제 근무 형태]"],
            ["급여 · 정산", "[확정 필요]", "[확정 필요 — 정산 주기]"],
            ["필요 조건", "스마트폰 필수", "[확정 필요 — 차량 보유 여부]"],
          ].map((c) => (
            <Card key={c[0]} padding={22}>
              <div style={{ fontSize: 15.5, fontWeight: 700 }}>{c[0]}</div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--color-text-sub)",
                  marginTop: 10,
                  lineHeight: 1.6,
                }}
              >
                {c[1]}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 6 }}>
                {c[2]}
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHead label="지원서" title="지원해 주세요" />
        <div style={{ maxWidth: 640, display: "grid", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="성함" required htmlFor="a-n">
              <TextInput id="a-n" />
            </Field>
            <Field label="연락처" required htmlFor="a-t">
              <TextInput id="a-t" inputMode="numeric" placeholder="010-0000-0000" />
            </Field>
          </div>
          <Field label="거주 지역" required htmlFor="a-r">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Select
                id="a-r"
                placeholder="시 · 도"
                options={["서울특별시", "경기도", "인천광역시"]}
              />
              <Select placeholder="시 · 군 · 구" options={["강남구", "수원시", "부천시"]} />
            </div>
          </Field>
          <Field label="희망 근무 지역" required htmlFor="a-w">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Select
                id="a-w"
                placeholder="시 · 도"
                options={["서울특별시", "경기도", "인천광역시"]}
              />
              <Select placeholder="시 · 군 · 구" options={["강남구", "수원시", "부천시"]} />
            </div>
          </Field>
          <Field label="가능 시간대" required htmlFor="a-h">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
              {["평일 저녁", "평일 심야", "주말 저녁", "주말 심야", "새벽", "협의 가능"].map(
                (t) => (
                  <Checkbox key={t} id={"h-" + t} label={t} />
                ),
              )}
            </div>
          </Field>
          <Field label="이동 수단" required htmlFor="a-m">
            <Radio
              name="a-m"
              columns={3}
              value={move}
              onChange={(e) => setMove(e.target.value)}
              options={["자차", "대중교통", "도보"]}
            />
          </Field>
          <Field label="하고 싶은 말" htmlFor="a-x">
            <TextInput id="a-x" multiline rows={3} />
          </Field>
          <Checkbox
            id="a-p"
            required
            label="개인정보 수집·이용 동의"
            description="채용 목적 개인정보는 상담 리드와 별도로 보관하며, 미채택 시 [확정 필요] 이후 파기합니다."
          />
          <Button size="lg" full>
            지원서 제출하기
          </Button>
        </div>
      </Section>
    </>
  );
}
Object.assign(window, { Careers });
