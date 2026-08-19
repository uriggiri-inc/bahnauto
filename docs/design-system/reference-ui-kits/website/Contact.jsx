function Contact() {
  const [agree, setAgree] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [tel, setTel] = React.useState("");
  const fmt = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d.length > 7
      ? `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
      : d.length > 3
        ? `${d.slice(0, 3)}-${d.slice(3)}`
        : d;
  };
  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };
  if (sent)
    return (
      <Section>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", padding: "40px 0" }}>
          <img src="../../assets/logo/symbol.svg" alt="" style={{ width: 76, marginBottom: 24 }} />
          <h1
            style={{
              fontSize: "var(--text-h2)",
              fontWeight: 700,
              letterSpacing: "var(--tracking-heading)",
              margin: 0,
              wordBreak: "keep-all",
            }}
          >
            상담 신청이 접수되었습니다
          </h1>
          <p
            style={{
              fontSize: "var(--text-body-lg)",
              color: "var(--color-text-sub)",
              lineHeight: 1.7,
              margin: "16px 0 28px",
            }}
          >
            1영업일 내에 담당자가 연락드리겠습니다.
          </p>
          <Button size="lg" variant="secondary" onClick={() => setSent(false)}>
            처음으로
          </Button>
        </div>
      </Section>
    );
  return (
    <>
      <Section tone="subtle" style={{ paddingBottom: 36 }}>
        <SectionLabel>도입 상담</SectionLabel>
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
          매장 상황을 알려주시면, 관리 범위를 정리해 드립니다
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-lg)",
            color: "var(--color-text-sub)",
            margin: "14px 0 0",
          }}
        >
          상담은 무료이며, 방문 진단 후 견적을 확정합니다.
        </p>
      </Section>
      <Section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr .75fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="성함" required htmlFor="c-n">
                <TextInput id="c-n" placeholder="홍길동" />
              </Field>
              <Field label="연락처" required htmlFor="c-t">
                <TextInput
                  id="c-t"
                  inputMode="numeric"
                  value={tel}
                  onChange={(e) => setTel(fmt(e.target.value))}
                  placeholder="010-0000-0000"
                />
              </Field>
            </div>
            <Field label="매장 업종" required htmlFor="c-b">
              <Select
                id="c-b"
                placeholder="업종을 선택해 주세요"
                options={[
                  "무인키즈카페",
                  "무인카페",
                  "무인아이스크림",
                  "무인문구",
                  "무인세탁",
                  "무인스터디카페",
                  "기타",
                ]}
              />
            </Field>
            <Field label="매장 위치" required htmlFor="c-r1">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Select
                  id="c-r1"
                  placeholder="시 · 도"
                  options={[
                    "서울특별시",
                    "경기도",
                    "인천광역시",
                    "부산광역시",
                    "대전광역시",
                    "대구광역시",
                    "광주광역시",
                    "울산광역시",
                  ]}
                />
                <Select
                  placeholder="시 · 군 · 구"
                  options={["강남구", "서초구", "송파구", "수원시", "성남시", "부천시"]}
                />
              </div>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="운영 매장 수" required htmlFor="c-s">
                <Select id="c-s" options={["1개", "2개", "3개 이상", "개설 준비 중"]} />
              </Field>
              <Field
                label="희망 관리 횟수"
                htmlFor="c-v"
                hint="요금 계산기에서 선택하신 값이 자동 연동됩니다"
              >
                <Select
                  id="c-v"
                  defaultValue="주 3회"
                  options={["주 1회", "주 2회", "주 3회", "주 5회", "매일"]}
                />
              </Field>
            </div>
            <Field label="문의 내용" htmlFor="c-m" hint="최대 500자">
              <TextInput
                id="c-m"
                multiline
                rows={4}
                placeholder="매장 면적, 운영 시간, 현재 겪고 계신 문제 등을 알려주세요"
              />
            </Field>
            <Field label="유입 경로" htmlFor="c-u">
              <Select
                id="c-u"
                options={[
                  "네이버 검색",
                  "검색광고",
                  "지인 소개",
                  "카페·커뮤니티",
                  "인스타그램",
                  "기타",
                ]}
              />
            </Field>
            <div
              style={{
                display: "grid",
                gap: 2,
                paddingTop: 4,
                borderTop: "1px solid var(--color-border-light)",
              }}
            >
              <Checkbox
                id="c-p"
                required
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                label="개인정보 수집·이용 동의"
                description="수집 항목: 성함·연락처·매장 정보 / 이용 목적: 도입 상담 및 견적 안내 / 보유 기간: 상담 종료 후 6개월 [확정 필요]"
              />
              <Checkbox id="c-mk" label="마케팅 정보 수신 동의" />
            </div>
            {!agree && (
              <p style={{ fontSize: 13, color: "var(--color-text-sub)", margin: 0 }}>
                개인정보 수집·이용에 동의하셔야 상담을 신청하실 수 있습니다.
              </p>
            )}
            <Button size="lg" full disabled={!agree} loading={loading} onClick={submit}>
              상담 신청하기
            </Button>
          </div>
          <div style={{ display: "grid", gap: 14, position: "sticky", top: 96 }}>
            <Card padding={22}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>폼 작성이 번거로우시면</div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--color-text-sub)",
                  lineHeight: 1.7,
                  margin: "8px 0 16px",
                }}
              >
                전화로도 바로 상담하실 수 있습니다.
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                <Button variant="tel" full icon={<Icon d={I.phone} size={18} />}>
                  전화 상담 [확정 필요]
                </Button>
                <Button variant="secondary" full>
                  채널톡 상담
                </Button>
              </div>
            </Card>
            <Card padding={22} tone="brand">
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>상담 후 진행 방식</div>
              <ol
                style={{
                  margin: "12px 0 0",
                  padding: "0 0 0 18px",
                  display: "grid",
                  gap: 7,
                  fontSize: 13.5,
                  color: "var(--color-text-sub)",
                  lineHeight: 1.6,
                }}
              >
                <li>1영업일 내 담당자 연락</li>
                <li>매장 방문 진단</li>
                <li>관리 범위·견적 확정</li>
                <li>매니저 배정 후 관리 시작</li>
              </ol>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
Object.assign(window, { Contact });
