import { cn } from "@/lib/cn";

/**
 * 폼 프리미티브 — 디자인시스템 `forms/*.d.ts` 의 API 를 그대로 따른다.
 *
 * 원본은 인라인 스타일이라 `:focus-visible`·`aria-invalid` 같은 상태를 표현하지
 * 못했다. API 는 유지하고 Tailwind 로 옮겨 상태를 살렸다(Button 과 같은 방식).
 *
 * ⚠️ 오류는 반드시 **필드 하단 인라인 + `aria-invalid` + `aria-describedby`** 로 연결한다
 * (PRD §7.6 AC). 색으로만 표시하면 색각 이상 사용자와 스크린리더 사용자가 알 수 없다.
 *
 * ⚠️ 오류 문구에 `#8B919E`(대비 3.1:1)를 쓰지 않는다 — 디자인 시스템이 본문·폼 라벨·
 * 오류 메시지에 이 색을 금지한다.
 */

export function Field({
  label,
  required = false,
  error,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  /** 있으면 hint 대신 표시되고 role="alert" 로 읽힌다 */
  error?: string;
  hint?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}) {
  const describedBy = htmlFor ? `${htmlFor}-desc` : undefined;

  return (
    <div>
      <label htmlFor={htmlFor} className="text-body-sm text-ink mb-2 block font-semibold">
        {label}
        {required && (
          <span className="text-danger ml-1" aria-label="필수 입력">
            *
          </span>
        )}
      </label>

      {children}

      {(error || hint) && (
        <p
          id={describedBy}
          role={error ? "alert" : undefined}
          className={cn("text-caption mt-2", error ? "text-danger" : "text-text-sub")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

const CONTROL = [
  "text-body w-full rounded-sm border bg-white px-4 py-3 text-ink",
  "placeholder:text-text-sub",
  "ease-standard transition-[border-color,box-shadow] duration-[160ms]",
  "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
  "disabled:bg-bg-subtle disabled:text-text-sub",
].join(" ");

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function TextInput({ invalid = false, className, ...rest }: TextInputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, invalid ? "border-danger" : "border-border-strong", className)}
      {...rest}
    />
  );
}

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function TextArea({ invalid = false, className, rows = 5, ...rest }: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        CONTROL,
        "resize-y",
        invalid ? "border-danger" : "border-border-strong",
        className,
      )}
      {...rest}
    />
  );
}

export type Option = string | { value: string; label: string };

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: readonly Option[];
  placeholder?: string;
  invalid?: boolean;
};

export function Select({
  options = [],
  placeholder,
  invalid = false,
  className,
  ...rest
}: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          "appearance-none pr-11",
          invalid ? "border-danger" : "border-border-strong",
          className,
        )}
        {...rest}
      >
        {/* 값이 비어 있는 상태를 명시적으로 둔다 — 첫 항목이 자동 선택되면
            사용자가 고르지 않았는데 고른 것으로 기록된다 */}
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const value = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <svg
        aria-hidden
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-text-sub)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & {
  label: string;
  /** 수집 항목 / 이용 목적 / 보유 기간 요약을 같은 화면에서 보여줄 때 */
  description?: React.ReactNode;
};

export function Checkbox({ label, description, id, className, ...rest }: CheckboxProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <input
        id={id}
        type="checkbox"
        className={cn(
          "border-border-strong text-brand mt-0.5 size-5 shrink-0 rounded-[6px] border",
          "accent-brand focus-visible:ring-brand focus-visible:ring-2 focus-visible:ring-offset-2",
        )}
        {...rest}
      />
      <div className="min-w-0">
        <label htmlFor={id} className="text-body-sm text-ink cursor-pointer">
          {label}
        </label>
        {description && <div className="text-caption text-text-sub mt-2">{description}</div>}
      </div>
    </div>
  );
}
