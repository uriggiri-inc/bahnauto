// 실제 앱 캡처가 제공되지 않아, 부록 A의 기능 명세로 재현한 앱 화면 목업.
// 실물 캡처(마스킹본)를 받으면 이 컴포넌트를 <img>로 교체한다.
function AppMockDashboard() {
  return (
    <div
      style={{
        background: "var(--color-bg-subtle)",
        height: "100%",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader
        title="반오토"
        subtitle="키즈카페 OO점 · 2026.08.06"
        right={<StatusPill status="working" label="근무중" />}
      />
      <div style={{ padding: 14, display: "grid", gap: 10, flex: 1, overflow: "hidden" }}>
        <Card padding={16}>
          <ProgressBar label="오늘 체크리스트" value={67} />
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--color-border-light)",
            }}
          >
            <div>
              <div style={{ fontSize: 11.5, color: "var(--color-text-sub)" }}>출근 인원</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>1명</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "var(--color-text-sub)" }}>재고 임박</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--color-warning)" }}>
                3건
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "var(--color-text-sub)" }}>미확인 공지</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>2건</div>
            </div>
          </div>
        </Card>
        <Card padding={16}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>
            주간 체크리스트 완료율
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 66 }}>
            {[62, 78, 90, 71, 95, 88, 67].map((v, i) => (
              <div key={i} style={{ flex: 1, display: "grid", gap: 5, justifyItems: "center" }}>
                <div
                  style={{
                    width: "100%",
                    height: v * 0.52,
                    background: i === 6 ? "var(--color-brand)" : "var(--color-brand-200)",
                    borderRadius: 5,
                  }}
                />
                <span style={{ fontSize: 9.5, color: "var(--color-text-muted)" }}>
                  {"월화수목금토일"[i]}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card padding={14}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>최근 알림</div>
          <div style={{ display: "grid", gap: 9 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <StatusPill status="discard" />
              <span style={{ fontSize: 12.5, color: "var(--color-text-sub)" }}>
                우유 200ml · 유통기한 경과
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <StatusPill status="pending" label="발주" />
              <span style={{ fontSize: 12.5, color: "var(--color-text-sub)" }}>
                물티슈 외 2건 검토 중
              </span>
            </div>
          </div>
        </Card>
      </div>
      <TabBar
        value="home"
        items={[
          { id: "home", label: "홈", icon: "home" },
          { id: "c", label: "체크리스트", icon: "checklist" },
          { id: "a", label: "출퇴근", icon: "attendance" },
          { id: "i", label: "재고관리", icon: "inventory" },
        ]}
      />
    </div>
  );
}

function AppMockChecklist() {
  const rows = [
    ["장난감 및 자동차 정리 정돈", true, 2],
    ["정글짐 내부 정리정돈", true, 3],
    ["청소기 & 정전기포", true, 1],
    ["물걸레 청소", false, 0],
    ["휴게공간 테이블 & 의자 닦기", false, 0],
  ];
  return (
    <div
      style={{
        background: "var(--color-bg-subtle)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader title="체크리스트" subtitle="상시근무 10항목" />
      <div style={{ display: "flex", gap: 6, padding: "10px 14px", overflowX: "auto" }}>
        {["전체", "상시근무", "1주차", "2주차", "3주차", "4주차"].map((t, i) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "7px 12px",
              borderRadius: "var(--radius-full)",
              whiteSpace: "nowrap",
              background: i === 1 ? "var(--color-brand)" : "#fff",
              color: i === 1 ? "#fff" : "var(--color-text-sub)",
              border: i === 1 ? "0" : "1px solid var(--color-border)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ padding: "0 14px", display: "grid", gap: 8, flex: 1, overflow: "hidden" }}>
        {rows.map((r, i) => (
          <ChecklistItem key={i} index={i + 1} title={r[0]} done={r[1]} photos={r[2]} />
        ))}
      </div>
      <TabBar
        value="c"
        items={[
          { id: "home", label: "홈", icon: "home" },
          { id: "c", label: "체크리스트", icon: "checklist" },
          { id: "a", label: "출퇴근", icon: "attendance" },
          { id: "i", label: "재고관리", icon: "inventory" },
        ]}
      />
    </div>
  );
}

function AppMockInventory() {
  const rows = [
    ["우유 200ml", "discard", "D+2"],
    ["생수1 500ml", "soon", "D-12"],
    ["물티슈", "normal", "D-180"],
    ["종이컵", "normal", "D-240"],
  ];
  return (
    <div
      style={{
        background: "var(--color-bg-subtle)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader title="재고관리" subtitle="유통기한 D-day 기준" />
      <div style={{ padding: 14, display: "grid", gap: 10, flex: 1, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["폐기 대상", "1", "var(--color-danger)"],
            ["D-30 이벤트", "3", "var(--color-warning)"],
            ["정상", "28", "var(--color-success)"],
            ["전체 등록", "32", "var(--color-text)"],
          ].map((s) => (
            <Card key={s[0]} padding={13}>
              <div style={{ fontSize: 11.5, color: "var(--color-text-sub)" }}>{s[0]}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: s[2],
                  marginTop: 3,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s[1]}
              </div>
            </Card>
          ))}
        </div>
        <Card padding={0}>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "13px 15px",
                borderTop: i ? "1px solid var(--color-border-light)" : "0",
              }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500 }}>
                {r[0]}
              </span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12.5,
                    color: "var(--color-text-sub)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {r[2]}
                </span>
                <StatusPill status={r[1]} />
              </span>
            </div>
          ))}
        </Card>
      </div>
      <TabBar
        value="i"
        items={[
          { id: "home", label: "홈", icon: "home" },
          { id: "c", label: "체크리스트", icon: "checklist" },
          { id: "a", label: "출퇴근", icon: "attendance" },
          { id: "i", label: "재고관리", icon: "inventory" },
        ]}
      />
    </div>
  );
}

function AppMockAttendance() {
  return (
    <div
      style={{
        background: "var(--color-bg-subtle)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader title="출퇴근" subtitle="인정 시간 18:00 ~ 10:00" />
      <div style={{ padding: 14, display: "grid", gap: 10, flex: 1, overflow: "hidden" }}>
        <Card padding={18} tone="brand">
          <div style={{ fontSize: 12.5, color: "var(--color-text-sub)" }}>오늘 출근</div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-brand)",
              fontVariantNumeric: "tabular-nums",
              marginTop: 4,
            }}
          >
            19:04
          </div>
          <div style={{ fontSize: 12.5, color: "var(--color-text-sub)", marginTop: 6 }}>
            입구 단말기 화면 촬영 · 시각 자동 인식
          </div>
        </Card>
        <div
          style={{
            background: "var(--color-ink)",
            borderRadius: "var(--radius-md)",
            height: 132,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontFamily: "var(--font-sans)",
            fontSize: 12.5,
            gap: 6,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            19:04:22
          </span>
          <span style={{ color: "var(--color-text-on-dark-sub)" }}>
            단말기 화면 촬영본 · 자리표시자
          </span>
        </div>
        <Button full size="lg">
          퇴근 등록하기
        </Button>
      </div>
      <TabBar
        value="a"
        items={[
          { id: "home", label: "홈", icon: "home" },
          { id: "c", label: "체크리스트", icon: "checklist" },
          { id: "a", label: "출퇴근", icon: "attendance" },
          { id: "i", label: "재고관리", icon: "inventory" },
        ]}
      />
    </div>
  );
}
Object.assign(window, { AppMockDashboard, AppMockChecklist, AppMockInventory, AppMockAttendance });
