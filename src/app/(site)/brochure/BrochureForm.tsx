"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Field, Select, TextInput } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { formatPhone, REFERRERS } from "@/lib/contact-schema";
import { brochureSchema, type BrochureInput } from "@/lib/brochure-schema";
// 서버 액션을 직접 import 하지 않는다 — 정적 미리보기 빌드에서 교체되는 지점이다
import { submitBrochure } from "@/lib/form-submit";

/**
 * 서비스 소개서 받기 폼.
 *
 * 상담 폼(`ContactForm`)과 같은 규칙을 따른다.
 *   · 실패해도 입력값을 건드리지 않는다 — 다시 채우게 하면 그 사람은 나간다
 *   · 필수 동의 3요소(수집 항목·이용 목적·보유 기간)를 체크박스와 같은 화면에 둔다
 *   · 동의 전에는 제출 버튼이 잠기고, 왜 잠겼는지 글로 알린다
 *
 * 다른 점은 **받는 항목이 적다**는 것이다. 소개서를 보내는 데 필요하지 않은 항목은
 * 받지 않는다(§1.2 최소 수집) — 상담 폼의 업종·지역·매장 수·희망 횟수가 여기 없다.
 *
 * ── 유입 경로만 예외다 (사용자 지시 2026-08-28) ──
 * 소개서를 보내는 데 필요한 항목은 아니지만 PRD §7.6 이 마케팅 채널 성과 측정용으로
 * 반드시 포함하도록 요구한다. **선택 항목**이라 비워 두고도 제출되고, 선택지는
 * 상담 폼과 같은 목록(`REFERRERS`)을 쓴다 — 폼마다 항목이 다르면 채널별 집계를
 * 한 기준으로 볼 수 없다.
 */
export function BrochureForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BrochureInput>({
    resolver: zodResolver(brochureSchema),
    mode: "onBlur",
    defaultValues: { name: "", phone: "", email: "", company: "", referrer: "", referrerDetail: "" },
  });

  const phone = watch("phone");
  const referrer = watch("referrer");
  const agreePrivacy = watch("agreePrivacy");

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await submitBrochure(values);

      if (result.ok) {
        router.push("/brochure/complete");
        return;
      }

      if (result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          setError(key as keyof BrochureInput, { message });
        }
      }
      setFormError(result.message);
    } catch {
      setFormError("전송에 실패했습니다. 입력하신 내용은 그대로 있으니 잠시 후 다시 눌러주세요.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Field
        label="성함"
        required
        error={errors.name?.message}
        htmlFor="name"
      >
        <TextInput
          id="name"
          autoComplete="name"
          placeholder="홍길동"
          invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-desc" : undefined}
          {...register("name")}
        />
      </Field>

      <Field label="연락처" required error={errors.phone?.message} htmlFor="phone">
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

      <Field
        label="이메일"
        required
        error={errors.email?.message}
        htmlFor="email"
        hint="이 주소로 소개서를 보내드립니다."
      >
        <TextInput
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
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
          placeholder="우리끼리 주식회사"
          invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "company-desc" : undefined}
          {...register("company")}
        />
      </Field>

      {/*
        ── 유입 경로 (선택) ──
        상담 폼과 같은 목록·같은 동작이다. 소개서를 받는 조건이 아니라 비워 두고도
        제출된다 — 그래서 `required` 를 붙이지 않고 `선택 안 함` 을 기본값으로 둔다.
      */}
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

              ⚠️ 이메일은 현재 개인정보처리방침 제2조의 수집 항목에 없다.
                 방침 개정 전에는 접수가 열리지 않는다(actions.ts 주석 참조).
            */
            <dl className="grid gap-1.5">
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">수집 항목</dt>
                {/* 받는 것과 고지하는 것이 어긋나면 그 자체가 문제다 —
                    2026-08-28 에 유입 경로를 추가하면서 이 줄도 함께 고쳤다 */}
                <dd>성함, 연락처, 이메일, 회사명 또는 매장명, 유입 경로</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">이용 목적</dt>
                <dd>서비스 소개서 발송 및 관련 문의 응대</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">보유 기간</dt>
                {/*
                  사용자 지시(2026-08-19) — 도입 상담·채용 폼과 같은 표기로 맞춘다.
                  이 줄은 이제 네 폼 모두 `목적 달성 시 폐기` 하나다.

                  ⚠️ 이전 문구 `발송 완료 후 1년까지 보관 후 파기` 는
                     **개인정보처리방침에 근거가 없는 수치였다.** 제3조 보유기간
                     목록에 소개서 요청 항목이 아예 없다 — 폼에서 만들어 낸 숫자다.
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
          {isSubmitting ? "보내는 중" : "소개서 받기"}
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
