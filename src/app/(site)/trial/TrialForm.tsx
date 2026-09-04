"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Checkbox, Field, Select, TextInput } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPhone, REFERRERS } from "@/lib/contact-schema";
import { trialSchema, type TrialInput } from "@/lib/trial-schema";
// 서버 액션을 직접 import 하지 않는다 — 정적 미리보기 빌드에서 교체되는 지점이다
import { submitTrial } from "@/lib/form-submit";

/**
 * 무료체험 신청 폼.
 *
 * 상담 폼(`ContactForm`)·소개서 폼(`BrochureForm`)과 같은 규칙을 따른다.
 *   · 실패해도 입력값을 건드리지 않는다 — 다시 채우게 하면 그 사람은 나간다
 *   · 필수 동의 3요소(수집 항목·이용 목적·보유 기간)를 체크박스와 같은 화면에 둔다
 *   · 동의 전에는 제출 버튼이 잠기고, 왜 잠겼는지 글로 알린다
 *
 * ── 2026-09-04 소개서 폼과 양식을 통일했다 (노션 「반오토 폼양식 수정」) ──
 * 성함 › 연락처 › 이메일 › 회사명 또는 매장명 › 어떻게 알고 오셨나요 순서다.
 * 순서나 항목을 바꿀 때는 `BrochureForm` 도 **함께** 바꾼다 — 둘이 갈라지면
 * 통일한 의미가 없다. 그 전에는 세 항목(성함·연락처·회사명)뿐이었다.
 *
 * 성공하면 곧장 체험 대시보드로 튕기지 않고 **완료 화면을 한 번 거친다** —
 * 외부 주소로 갑자기 이동하면 신청이 접수된 것인지 알 수 없다.
 */
export function TrialForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TrialInput>({
    resolver: zodResolver(trialSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      referrer: "",
      referrerDetail: "",
    },
  });

  const phone = watch("phone");
  const agreePrivacy = watch("agreePrivacy");
  const referrer = watch("referrer");

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await submitTrial(values);

      if (result.ok) {
        router.push("/trial/complete");
        return;
      }

      if (result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          setError(key as keyof TrialInput, { message });
        }
      }
      setFormError(result.message);
    } catch {
      setFormError("전송에 실패했습니다. 입력하신 내용은 그대로 있으니 잠시 후 다시 눌러주세요.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Field label="성함" required error={errors.name?.message} htmlFor="name">
        <TextInput
          id="name"
          autoComplete="name"
          placeholder="홍길동"
          invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-desc" : undefined}
          {...register("name")}
        />
      </Field>

      <Field
        label="연락처"
        required
        error={errors.phone?.message}
        htmlFor="phone"
        hint="체험 계정과 사용 방법을 이 번호로 안내해 드립니다."
      >
        <TextInput
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-0000-0000"
          maxLength={13}
          invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-desc" : undefined}
          {...register("phone")}
          // 표시용 하이픈. 저장·검증은 스키마가 숫자만 남긴다.
          value={formatPhone(phone ?? "")}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
        />
      </Field>

      {/* 소개서 폼과 **같은 순서**다 — 성함 › 연락처 › 이메일 › 회사명 › 유입경로
          (노션 「반오토 폼양식 수정」 2026-09-04). 순서를 바꿀 때는 두 폼을 함께 바꾼다. */}
      <Field
        label="이메일"
        required
        error={errors.email?.message}
        htmlFor="email"
        hint="체험 계정 안내를 이 주소로도 보내드립니다."
      >
        <TextInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-desc" : undefined}
          {...register("email")}
        />
      </Field>

      <Field
        label="회사명 또는 매장명"
        required
        error={errors.company?.message}
        htmlFor="company"
        hint="운영 중이시거나 준비 중이신 매장 이름을 적어주셔도 됩니다."
      >
        <TextInput
          id="company"
          autoComplete="organization"
          placeholder="우리끼리 무인키즈카페"
          invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "company-desc" : undefined}
          {...register("company")}
        />
      </Field>

      <Field label="어떻게 알고 오셨나요?" htmlFor="referrer">
        <Select
          id="referrer"
          placeholder="선택 안 함"
          options={REFERRERS}
          {...register("referrer", {
            // "기타"에서 다른 항목으로 되돌리면 직접 입력값은 더 이상 유효하지 않다
            onChange: (e) => {
              if (e.target.value !== "기타") setValue("referrerDetail", "");
            },
          })}
        />
      </Field>

      {referrer === "기타" && (
        <Field
          label="알게 되신 경로를 직접 적어주세요"
          error={errors.referrerDetail?.message}
          htmlFor="referrerDetail"
        >
          <TextInput
            id="referrerDetail"
            maxLength={50}
            placeholder="예: 지역 소상공인 모임"
            invalid={Boolean(errors.referrerDetail)}
            aria-describedby={errors.referrerDetail ? "referrerDetail-desc" : undefined}
            {...register("referrerDetail")}
          />
        </Field>
      )}

      {/* ── 동의 ── */}
      <div className="border-border bg-bg-subtle rounded-lg border p-5">
        <Checkbox
          id="agreePrivacy"
          label="(필수) 개인정보 수집·이용에 동의합니다"
          {...register("agreePrivacy")}
          description={
            /*
              필수 3요소를 동의 체크박스와 같은 화면에서 확인할 수 있어야 한다.

              ⚠️ 이름·연락처 항목 자체는 방침 제2조에 있지만 **"무료체험 신청 접수"
                 라는 목적이 없다.** 방침 개정 전에는 접수가 열리지 않는다
                 (actions.ts 주석 참조).
            */
            <dl className="grid gap-1.5">
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">수집 항목</dt>
                <dd>성함, 연락처, 이메일, 회사명 또는 매장명</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">이용 목적</dt>
                <dd>무료체험 계정 발급 및 사용 안내</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">보유 기간</dt>
                {/*
                  사용자 지시(2026-08-19) — 도입 상담·채용 폼과 같은 표기로 맞춘다.
                  이 줄은 이제 네 폼 모두 `목적 달성 시 폐기` 하나다.

                  ⚠️ 이전 문구 `체험 종료 후 1년까지 보관 후 파기` 는
                     **개인정보처리방침에 근거가 없는 수치였다.** 제3조 보유기간
                     목록에 무료체험 신청 항목이 아예 없다 — 폼에서 만들어 낸 숫자다.
                     근거 없는 구체적 기간보다 표준 문구가 낫다.

                  처리방침 전문 링크를 뗀 이유: 푸터에 상시 있고, 동의 체크박스
                  옆에서 밖으로 나가는 링크는 제출을 중단시킨다. 필수 3요소
                  (수집 항목·이용 목적·보유 기간)는 이 화면에 그대로 남아 있다.

                  ⚠️ 남은 불일치: 방침 제3조는 상담문의를 "문의 처리 완료 후
                     1년까지 보관 후 파기" 로 적고 있다. 오픈 전에 방침 원본과
                     함께 일치시켜야 한다(`ContactForm.tsx` 에 같은 경고가 있다).
                */}
                <dd>목적 달성 시 폐기</dd>
              </div>
            </dl>
          }
        />
        {errors.agreePrivacy && (
          <p role="alert" className="text-caption text-danger mt-4">
            {errors.agreePrivacy.message}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          className="border-danger/40 bg-danger-bg text-body-sm text-ink rounded-sm border px-4 py-3"
        >
          {formError}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" full loading={isSubmitting} disabled={!agreePrivacy}>
          {isSubmitting ? "보내는 중" : "무료체험 신청"}
        </Button>

        {!agreePrivacy && (
          <p className="text-caption text-text-sub mt-3 text-center">
            개인정보 수집·이용에 동의하시면 신청할 수 있습니다.
          </p>
        )}
      </div>
    </form>
  );
}
