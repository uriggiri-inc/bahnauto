function Zig({ label, title, body, bullets, mock, flip }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: flip ? ".9fr 1.1fr" : "1.1fr .9fr",
        gap: 56,
        alignItems: "center",
        padding: "clamp(32px,4vw,52px) 0",
      }}
    >
      <div style={{ order: flip ? 2 : 1 }}>
        <SectionLabel>{label}</SectionLabel>
        <h2
          style={{
            fontSize: "var(--text-h3)",
            fontWeight: 700,
            letterSpacing: "var(--tracking-h3)",
            lineHeight: 1.4,
            margin: "12px 0 0",
            wordBreak: "keep-all",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 15.5,
            lineHeight: 1.75,
            color: "var(--color-text-sub)",
            margin: "14px 0 0",
            textWrap: "pretty",
          }}
        >
          {body}
        </p>
        {bullets && (
          <ul
            style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "grid", gap: 10 }}
          >
            {bullets.map((b) => (
              <li
                key={b}
                style={{
                  display: "flex",
                  gap: 10,
                  fontSize: 14.5,
                  color: "var(--color-text)",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: "var(--color-brand)", flex: "0 0 auto", marginTop: 1 }}>
                  <Icon d={I.check} size={18} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ order: flip ? 1 : 2, display: "grid", placeItems: "center" }}>{mock}</div>
    </div>
  );
}

function System({ go }) {
  return (
    <>
      <Section tone="subtle" style={{ paddingBottom: "clamp(40px,5vw,64px)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr .9fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <SectionLabel>반오토 운영 시스템</SectionLabel>
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
              관리의 결과를, 매일 기록으로 확인하세요
            </h1>
            <p
              style={{
                fontSize: "var(--text-body-lg)",
                lineHeight: 1.7,
                color: "var(--color-text-sub)",
                margin: "18px 0 0",
                maxWidth: 520,
                textWrap: "pretty",
              }}
            >
              반오토 매장매니저는 매 방문마다 자체 앱으로 수행 항목을 기록합니다. 사장님은
              "했다더라"가 아니라 기록을 보십니다.
            </p>
            <div style={{ display: "flex", gap: 26, marginTop: 30 }}>
              <Stat value="319" unit="개" label="표준 체크리스트 항목" />
              <Stat value="10" unit="개" label="상시근무 항목" />
            </div>
          </div>
          <div style={{ display: "grid", placeItems: "center" }}>
            <PhoneFrame width={250}>
              <AppMockDashboard />
            </PhoneFrame>
          </div>
        </div>
      </Section>

      <Section>
        <Zig
          label="체크리스트"
          title="사람이 바뀌어도, 기준은 바뀌지 않습니다"
          body="상시근무 10개 항목과 1~4주차 항목으로 구성된 표준 체크리스트를 매장별로 설계합니다. 총 319개 항목이 항목 단위로 관리됩니다."
          bullets={[
            "장난감 및 자동차 정리 정돈",
            "정글짐 내부 정리정돈",
            "청소기 & 정전기포 · 물걸레 청소",
            "휴게공간 테이블 & 의자 닦기",
            "매점매대 정돈 및 고객 편의용품 채우기",
            "휴지통 비우기 (분리수거 및 일반쓰레기)",
            "창문 문 단속, 조명, 냉난방기 확인 및 소등",
          ]}
          mock={
            <PhoneFrame width={244}>
              <AppMockChecklist />
            </PhoneFrame>
          }
        />
        <Zig
          flip
          label="사진 기록"
          title="모든 항목에 사진이 남습니다"
          body="항목마다 사진 첨부가 필수입니다. 여러 장을 첨부할 수 있고, 특이사항 메모를 함께 남깁니다. 완료 처리하면 진행률에 자동 반영됩니다."
          mock={
            <div style={{ width: 300, display: "grid", gap: 10 }}>
              <ChecklistItem
                index={1}
                title="장난감 및 자동차 정리 정돈"
                done
                photos={2}
                note="블록 보충함"
              />
              <ChecklistItem index={2} title="정글짐 내부 정리정돈" done photos={3} />
              <ChecklistItem index={4} title="물걸레 청소" photos={0} />
            </div>
          }
        />
        <Zig
          label="출퇴근 인증"
          title="방문했다는 말이 아니라, 증거를 남깁니다"
          body="입구 단말기 화면을 촬영하면 시각이 자동으로 인식됩니다. 출퇴근 인정 시간은 18:00~10:00이며, 시각이 잘못 인식된 경우에만 기록일시를 수정할 수 있습니다."
          mock={
            <PhoneFrame width={244}>
              <AppMockAttendance />
            </PhoneFrame>
          }
        />
        <Zig
          flip
          label="재고 · 발주"
          title="유통기한을 D-day로 관리합니다"
          body="폐기 대상 · D-30 이벤트 · 정상 · 전체 등록 4개 지표로 재고 상태를 한눈에 봅니다. 발주는 작성 → 검토 → 수령 → 완료 4단계로 진행되고, 수량 부족·파손·미배송은 이슈로 보고됩니다."
          mock={
            <PhoneFrame width={244}>
              <AppMockInventory />
            </PhoneFrame>
          }
        />
      </Section>

      <Section tone="subtle">
        <SectionHead
          label="소통 채널"
          title="문제가 생기면 전화 대신 기록으로 남깁니다"
          lead="게시판은 카테고리별로 분류되어 본사 담당자에게 바로 전달되고, 급한 건은 채널톡으로 실시간 상담합니다."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {["분실물", "긴급발주", "AS요청", "장난감 파손 보고", "기타"].map((c) => (
            <Card key={c} padding={18}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{c}</div>
              <div style={{ fontSize: 12.5, color: "var(--color-text-sub)", marginTop: 6 }}>
                담당자 지정 가능
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead align="center" label="데일리 리포트" title="사장님이 매일 받으시는 것" />
        <div
          style={{
            background: "var(--color-bg-subtle)",
            border: "1px dashed var(--color-border-strong)",
            borderRadius: "var(--radius-xl)",
            padding: "56px 24px",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: 14,
          }}
        >
          데일리 리포트 실물 샘플 자리
          <br />
          <span style={{ fontSize: 12.5 }}>[확정 필요 — 리포트 샘플]</span>
        </div>
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Button size="lg" onClick={() => go("/contact")}>
            도입 상담 신청
          </Button>
        </div>
      </Section>
    </>
  );
}
Object.assign(window, { System, Zig });
