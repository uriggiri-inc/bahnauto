const {
  Button,
  Badge,
  Card,
  SectionLabel,
  Stat,
  Toast,
  Field,
  TextInput,
  Select,
  Checkbox,
  Radio,
  Header,
  Footer,
  MobileStickyCTA,
  FeatureCard,
  ProcessCard,
  PhoneFrame,
  Tabs,
  Accordion,
  PricingCalculator,
  AppHeader,
  ChecklistItem,
  StatusPill,
  ProgressBar,
  TabBar,
} = window.BAHNAUTODesignSystem_9a8a8a;

const BIZ = [
  { label: "상호명", value: "우리끼리(주)" },
  { label: "대표자", value: "[확정 필요]" },
  { label: "사업자등록번호", value: "[확정 필요]" },
  { label: "주소", value: "[확정 필요]" },
  { label: "개인정보보호책임자", value: "[확정 필요]" },
  { label: "대표전화", value: "[확정 필요]" },
];

function Section({ tone = "light", children, id, style }) {
  const bg = {
    light: "var(--color-bg)",
    subtle: "var(--color-bg-subtle)",
    dark: "var(--color-ink)",
    brand: "var(--color-brand)",
  }[tone];
  return (
    <section
      id={id}
      style={{
        background: bg,
        color: tone === "light" || tone === "subtle" ? "var(--color-text)" : "#fff",
        padding: "var(--section-py) 0",
        ...style,
      }}
    >
      <div
        style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter)" }}
      >
        {children}
      </div>
    </section>
  );
}

function SectionHead({ label, title, lead, tone = "light", align = "left", cta }) {
  const dark = tone === "dark" || tone === "brand";
  return (
    <div
      style={{
        maxWidth: align === "center" ? 720 : 760,
        margin: align === "center" ? "0 auto" : 0,
        textAlign: align,
        marginBottom: 40,
      }}
    >
      {label && <SectionLabel tone={dark ? "onDark" : "brand"}>{label}</SectionLabel>}
      <h2
        style={{
          fontSize: "var(--text-h2)",
          fontWeight: 700,
          letterSpacing: "var(--tracking-heading)",
          lineHeight: "var(--leading-heading)",
          margin: "14px 0 0",
          wordBreak: "keep-all",
          color: dark ? "#fff" : "var(--color-text)",
        }}
      >
        {title}
      </h2>
      {lead && (
        <p
          style={{
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.7,
            color: dark ? "var(--color-text-on-dark-sub)" : "var(--color-text-sub)",
            margin: "16px 0 0",
            textWrap: "pretty",
          }}
        >
          {lead}
        </p>
      )}
      {cta && <div style={{ marginTop: 24 }}>{cta}</div>}
    </div>
  );
}

function Icon({ d, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
const I = {
  sparkle:
    "M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8",
  camera:
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  box: "M21 8 12 3 3 8m18 0v8l-9 5-9-5V8m18 0-9 5m0 0L3 8m9 5v8",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M9 15h6M9 11h2",
  calendar:
    "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  check: "M20 6 9 17l-5-5",
  broom: "M19 5 12 12M9 15l-4 4m0 0 3 1 5-5-4-4-5 5 1 3z",
  alert:
    "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
};
Object.assign(window, {
  Section,
  SectionHead,
  Icon,
  I,
  BIZ,
  Button,
  Badge,
  Card,
  SectionLabel,
  Stat,
  Toast,
  Field,
  TextInput,
  Select,
  Checkbox,
  Radio,
  Header,
  Footer,
  MobileStickyCTA,
  FeatureCard,
  ProcessCard,
  PhoneFrame,
  Tabs,
  Accordion,
  PricingCalculator,
  AppHeader,
  ChecklistItem,
  StatusPill,
  ProgressBar,
  TabBar,
});
