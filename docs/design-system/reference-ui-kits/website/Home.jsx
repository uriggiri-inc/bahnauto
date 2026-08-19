function HeroSymbol() {
  return (
    <div style={{ position: "relative", width: "100%", display: "grid", placeItems: "center" }}>
      <img
        src="../../assets/logo/symbol.svg"
        alt=""
        style={{
          width: "62%",
          maxWidth: 220,
          animation: "ba-reveal 700ms var(--ease-out-brand) both",
        }}
      />
    </div>
  );
}

function Home({ go }) {
  return (
    <>
      <Section style={{ paddingTop: "clamp(48px,6vw,84px)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr .95fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <Badge>무인매장 위탁 관리</Badge>
            <h1
              style={{
                fontSize: "var(--text-display)",
                fontWeight: 700,
                letterSpacing: "var(--tracking-display)",
                lineHeight: "var(--leading-display)",
                margin: "20px 0 0",
                wordBreak: "keep-all",
              }}
            >
              무인매장은 <span style={{ color: "var(--color-brand)" }}>절반만</span> 자동입니다
            </h1>
            <p
              style={{
                fontSize: "var(--text-body-lg)",
                lineHeight: 1.7,
                color: "var(--color-text-sub)",
                margin: "20px 0 0",
                maxWidth: 520,
                textWrap: "pretty",
              }}
            >
              결제와 입장은 자동이지만 청소·재고·응대·점검은 그대로 남습니다. 반오토가 그 나머지
              절반을 맡고, 매일 기록으로 보고드립니다.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 30, flexWrap: "wrap" }}>
              <Button size="lg" onClick={() => go("/contact")}>
                무료 도입 상담 신청
              </Button>
              <Button size="lg" variant="secondary" onClick={() => go("/system")}>
                관리 시스템 보기
              </Button>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--color-text-sub)", marginTop: 18 }}>
              상담은 무료입니다 · 방문 진단 후 견적을 확정합니다
            </p>
          </div>
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <div
              style={{
                position: "absolute",
                width: 340,
                height: 340,
                borderRadius: "50%",
                background: "var(--color-brand-50)",
              }}
            />
            <div style={{ position: "relative" }}>
              <PhoneFrame width={260}>
                <AppMockDashboard />
              </PhoneFrame>
            </div>
            <div
              style={{
                position: "absolute",
                left: -8,
                top: 46,
                background: "#fff",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-float)",
                padding: "12px 14px",
                fontFamily: "var(--font-sans)",
              }}
            >
              <div style={{ fontSize: 11.5, color: "var(--color-text-sub)" }}>오늘 체크리스트</div>
              <div style={{ fontSize: 19, fontWeight: 700, color: "var(--color-brand)" }}>
                67% 진행
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: -14,
                bottom: 64,
                background: "#fff",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-float)",
                padding: "12px 14px",
                fontFamily: "var(--font-sans)",
                display: "flex",
                gap: 9,
                alignItems: "center",
              }}
            >
              <StatusPill status="discard" />
              <span style={{ fontSize: 12.5, color: "var(--color-text-sub)" }}>우유 200ml</span>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="subtle" style={{ padding: "36px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          <Stat value="319" unit="개" label="표준 체크리스트 항목" />
          <Stat value="10" unit="개" label="매일 수행하는 상시근무 항목" />
          <Stat value="100" unit="%" label="항목별 사진 기록 필수" />
          <Stat value="18:00" label="출퇴근 인정 시작 시각" />
        </div>
        <p
          style={{ fontSize: 12.5, color: "var(--color-text-sub)", marginTop: 20, marginBottom: 0 }}
        >
          * 반오토 매장관리 앱에서 직접 확인되는 수치만 표기합니다. 관리 매장 수·누적 방문 등 실적
          수치는 검증 완료 후 공개합니다.
        </p>
      </Section>

      <Section>
        <SectionHead
          label="이런 상황이신가요"
          title="무인 운영이라 사람은 없지만, 해야 할 일은 그대로 남아 있습니다"
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <FeatureCard
            icon={<Icon d={I.broom} />}
            title="청결"
            description="퇴근 후에도 매장을 한 번 더 들러 정리해야 합니다"
          />
          <FeatureCard
            icon={<Icon d={I.box} />}
            title="재고"
            description="언제 무엇이 떨어졌는지 가봐야 알 수 있습니다"
          />
          <FeatureCard
            icon={<Icon d={I.phone} />}
            title="응대"
            description="환불·오류 전화가 시간을 가리지 않고 옵니다"
          />
          <FeatureCard
            icon={<Icon d={I.alert} />}
            title="점검"
            description="기기 고장은 손님이 알려주고 나서야 압니다"
          />
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHead
          label="반오토 운영 시스템"
          title={
            <>
              "관리했습니다"라는 말 대신,{" "}
              <span style={{ color: "var(--color-brand)" }}>기록을 보여드립니다</span>
            </>
          }
          lead="반오토는 직영 무인키즈카페를 운영하며 만든 자체 앱으로 모든 관리 결과를 기록합니다."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 28,
            justifyItems: "center",
          }}
        >
          <PhoneFrame width={232} caption="체크리스트 — 319개 항목을 항목별 사진과 함께 기록합니다">
            <AppMockChecklist />
          </PhoneFrame>
          <PhoneFrame
            width={232}
            caption="출퇴근 인증 — 입구 단말기 화면을 촬영해 시각을 자동 인식합니다"
          >
            <AppMockAttendance />
          </PhoneFrame>
          <PhoneFrame width={232} caption="재고 관리 — 유통기한 D-day로 폐기 대상을 미리 알립니다">
            <AppMockInventory />
          </PhoneFrame>
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Button size="lg" variant="secondary" onClick={() => go("/system")}>
            운영 시스템 자세히 보기 →
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHead label="서비스" title="사람이 바뀌어도, 기준은 바뀌지 않습니다" />
        <Tabs
          items={[
            {
              id: "care",
              label: "체계적인 매장 관리",
              content: (
                <ServiceTab
                  title="관리 기준이 사람에 따라 달라지지 않습니다"
                  items={[
                    "업종별 표준 체크리스트 설계",
                    "항목별 사진 기록 및 이력 보관",
                    "매장별 관리 현황 모니터링",
                  ]}
                />
              ),
            },
            {
              id: "mgr",
              label: "전담 매니저",
              content: (
                <ServiceTab
                  title="매번 다시 설명하실 필요가 없습니다"
                  items={[
                    "지역 기반 담당자 고정 배정",
                    "정기 교육 및 관리 품질 평가",
                    "담당자 부재 시 대체 인력 운영",
                  ]}
                />
              ),
            },
            {
              id: "sup",
              label: "실시간 고객센터",
              content: (
                <ServiceTab
                  title="매장 전화를 대신 받습니다"
                  items={[
                    "매장 대표번호 응대 대행",
                    "환불·오류 문의 1차 처리",
                    "응대 내역 리포트 정리",
                  ]}
                />
              ),
            },
            {
              id: "inv",
              label: "재고·발주 관리",
              content: (
                <ServiceTab
                  title="품절로 인한 매출 손실을 줄입니다"
                  items={[
                    "소모품·상품 재고 실사",
                    "발주 시점 알림 및 발주 대행",
                    "소진 추이 데이터 제공",
                  ]}
                />
              ),
            },
            {
              id: "adm",
              label: "행정 업무 관리",
              content: (
                <ServiceTab
                  title="잊고 넘어가는 일이 없습니다"
                  items={["계약·갱신 일정 캘린더", "기한 전 사전 알림", "서류 보관 및 이력 관리"]}
                />
              ),
            },
            {
              id: "rep",
              label: "데일리 리포트",
              content: (
                <ServiceTab
                  title="매장에 가지 않아도 상태를 파악하실 수 있습니다"
                  items={["일일 관리 수행 결과 요약", "사진 기록 첨부", "월간 종합 리포트 제공"]}
                />
              ),
            },
          ]}
        />
      </Section>

      <Section tone="dark">
        <SectionHead tone="dark" label="도입 절차" title="상담부터 관리 시작까지" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <ProcessCard
            step="01"
            title="도입 상담"
            description="매장 위치·업종·운영 시간을 확인하고 필요한 관리 범위를 정리합니다"
            ownerOwner="상담 신청"
            ownerBahnauto="관리 범위 제안"
          />
          <ProcessCard
            step="02"
            title="매장 방문 진단"
            description="직접 방문해 청결·기기·재고 상태를 점검하고 매장 전용 체크리스트를 설계합니다"
            ownerOwner="방문 일정 조율"
            ownerBahnauto="현장 점검 · 체크리스트 설계"
          />
          <ProcessCard
            step="03"
            title="계약 및 매니저 배정"
            description="관리 횟수와 범위를 확정하고 지역 전담 매니저를 배정합니다"
            ownerOwner="계약 확인"
            ownerBahnauto="매니저 배정 · 교육"
          />
          <ProcessCard
            step="04"
            title="관리 시작 · 리포트 수신"
            description="첫 방문부터 기록이 쌓이고, 매일 리포트를 보내드립니다"
            ownerOwner="리포트 확인"
            ownerBahnauto="관리 수행 · 기록 발송"
          />
        </div>
      </Section>

      <Section tone="subtle">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}
        >
          <div>
            <SectionHead
              label="요금"
              title="관리 횟수만큼만 지불하세요"
              lead="면적·업종·지역에 따라 달라지며, 방문 진단 후 최종 견적을 확정합니다."
              cta={
                <Button variant="secondary" onClick={() => go("/pricing")}>
                  요금 자세히 보기
                </Button>
              }
            />
          </div>
          <PricingCalculator
            defaultPlanId="w3"
            note="33㎡ 이하 매장 기준"
            plans={PRICING.plans}
            onSubmit={() => go("/contact")}
          />
        </div>
      </Section>

      <Section>
        <SectionHead
          label="회사"
          title="남의 매장으로 연습하지 않았습니다. 우리 매장에서 만들었습니다"
          lead="반오토는 우리끼리(주)가 직영 무인키즈카페를 운영하며 겪은 문제에서 시작했습니다. 체크리스트를 만들고, 앱을 만들고, 그 시스템을 서비스로 열었습니다."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          <FeatureCard
            tone="brand"
            icon={<Icon d={I.check} />}
            title="직영 운영 경험"
            description="무인키즈카페를 직접 운영하며 체크리스트 항목을 만들었습니다"
          />
          <FeatureCard
            tone="brand"
            icon={<Icon d={I.file} />}
            title="자체 개발 앱"
            description="현장에서 쓰는 앱을 직접 만들고 매일 운영합니다"
          />
          <FeatureCard
            tone="brand"
            icon={<Icon d={I.camera} />}
            title="사진 기록 원칙"
            description="모든 체크리스트 항목에 사진 첨부가 필수입니다"
          />
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHead label="자주 묻는 질문" title="걸리는 게 있으신가요" />
        <Accordion
          defaultOpen={0}
          items={[
            {
              q: "관리 가능 지역은 어디인가요?",
              a: "현재 관리 가능 지역은 상담 시 안내드립니다. [확정 필요 — 지역 목록]",
            },
            { q: "계약 최소 기간이 있나요?", a: "[확정 필요 — 최소 계약 기간 및 해지 조건]" },
            {
              q: "매니저가 매장 열쇠나 비밀번호를 갖게 되나요?",
              a: "[확정 필요 — 출입 권한 정책]",
            },
            {
              q: "관리 결과는 어떻게 확인하나요?",
              a: "매일 발송되는 리포트에서 수행 항목과 항목별 사진을 확인하실 수 있습니다.",
            },
          ]}
        />
      </Section>

      <Section tone="brand">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "var(--text-h2)",
              fontWeight: 700,
              letterSpacing: "var(--tracking-heading)",
              lineHeight: 1.35,
              margin: 0,
              color: "#fff",
              wordBreak: "keep-all",
            }}
          >
            매장 관리에 쓰던 시간을 다시 사장님께 돌려드립니다
          </h2>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            <Button size="lg" variant="onDark" onClick={() => go("/contact")}>
              무료 도입 상담 신청
            </Button>
            <Button
              size="lg"
              variant="ghost"
              style={{ color: "#fff", border: "1px solid rgba(255,255,255,.35)" }}
            >
              전화 문의
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function ServiceTab({ title, items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 36,
        alignItems: "center",
        minHeight: 240,
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "var(--text-h3)",
            fontWeight: 700,
            letterSpacing: "var(--tracking-h3)",
            margin: 0,
            wordBreak: "keep-all",
          }}
        >
          {title}
        </h3>
        <ul style={{ listStyle: "none", margin: "22px 0 0", padding: 0, display: "grid", gap: 12 }}>
          {items.map((i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                fontSize: 15.5,
                color: "var(--color-text-sub)",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: "var(--color-brand)", flex: "0 0 auto", marginTop: 2 }}>
                <Icon d={I.check} size={18} />
              </span>
              {i}
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          background: "var(--color-bg-subtle)",
          border: "1px dashed var(--color-border-strong)",
          borderRadius: "var(--radius-lg)",
          minHeight: 220,
          display: "grid",
          placeItems: "center",
          color: "var(--color-text-muted)",
          fontSize: 13,
          textAlign: "center",
          padding: 20,
        }}
      >
        서비스 이미지 자리
        <br />
        <span style={{ fontSize: 12 }}>[확정 필요 — 탭 이미지 6종]</span>
      </div>
    </div>
  );
}
Object.assign(window, { Home, HeroSymbol, ServiceTab });
