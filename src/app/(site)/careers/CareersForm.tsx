"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Field, Select, TextArea, TextInput } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { formatPhone } from "@/lib/contact-schema";
import {
  EXPERIENCE,
  TIME_SLOTS,
  TRANSPORT,
  careersSchema,
  type CareersInput,
} from "@/lib/careers-schema";
import { REGIONS, SIDO } from "@/lib/regions";
import { cn } from "@/lib/cn";
// 서버 액션을 직접 import 하지 않는다 — 정적 미리보기 빌드에서 교체되는 지점이다
import { submitApplication } from "@/lib/form-submit";

/**
 * 매장매니저 지원서 (PRD §7.7).
 *
 * 지원자의 최대 불안은 "어렵다"가 아니라 **"뭘 해야 할지 모른 채 던져진다"** 이다
 * (REVIEW-001 F-7). 폼에서도 같은 원칙을 지킨다 — 무엇을 왜 묻는지 각 필드에 밝힌다.
 *
 * 거주 지역과 희망 근무 지역을 따로 받는 이유는 **집 근처 배정**이 이 일의 핵심
 * 조건이기 때문이다. 한 칸으로 합치면 배정할 수 없다.
 */

export function CareersForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CareersInput>({
    resolver: zodResolver(careersSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      homeSido: "",
      homeSigungu: "",
      workSido: "",
      workSigungu: "",
      timeSlots: [],
      message: "",
    },
  });

  const phone = watch("phone");
  const homeSido = watch("homeSido");
  const workSido = watch("workSido");
  const agreePrivacy = watch("agreePrivacy");

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await submitApplication(values);
      if (result.ok) {
        router.push("/careers/complete");
        return;
      }
      if (result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          setError(key as keyof CareersInput, { message });
        }
      }
      setFormError(result.message);
    } catch {
      // 입력값은 그대로 둔다 — 다시 채우게 하면 대부분 이탈한다
      setFormError("전송에 실패했습니다. 입력하신 내용은 그대로 있으니 다시 눌러주세요.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Field label="성함" required error={errors.name?.message} htmlFor="c-name">
        <TextInput
          id="c-name"
          autoComplete="name"
          placeholder="홍길동"
          invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "c-name-desc" : undefined}
          {...register("name")}
        />
      </Field>

      <Field label="연락처" required error={errors.phone?.message} htmlFor="c-phone">
        <TextInput
          id="c-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-0000-0000"
          maxLength={13}
          invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "c-phone-desc" : undefined}
          {...register("phone")}
          value={formatPhone(phone ?? "")}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
        />
      </Field>

      {/* 거주지와 희망 근무지를 따로 받는다 — 집 근처 배정이 이 일의 핵심 조건이다 */}
      <fieldset>
        <legend className="text-body-sm text-ink mb-3 font-semibold">
          거주 지역 <span className="text-danger">*</span>
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="시·도" error={errors.homeSido?.message} htmlFor="c-home-sido">
            <Select
              id="c-home-sido"
              placeholder="시·도 선택"
              options={SIDO}
              invalid={Boolean(errors.homeSido)}
              {...register("homeSido", { onChange: () => setValue("homeSigungu", "") })}
            />
          </Field>
          <Field label="시·군·구" error={errors.homeSigungu?.message} htmlFor="c-home-sigungu">
            <Select
              id="c-home-sigungu"
              placeholder={homeSido ? "시·군·구 선택" : "시·도를 먼저 선택"}
              options={homeSido ? (REGIONS[homeSido] ?? []) : []}
              disabled={!homeSido}
              invalid={Boolean(errors.homeSigungu)}
              {...register("homeSigungu")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-body-sm text-ink mb-3 font-semibold">
          희망 근무 지역 <span className="text-danger">*</span>
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="시·도" error={errors.workSido?.message} htmlFor="c-work-sido">
            <Select
              id="c-work-sido"
              placeholder="시·도 선택"
              options={SIDO}
              invalid={Boolean(errors.workSido)}
              {...register("workSido", { onChange: () => setValue("workSigungu", "") })}
            />
          </Field>
          <Field label="시·군·구" error={errors.workSigungu?.message} htmlFor="c-work-sigungu">
            <Select
              id="c-work-sigungu"
              placeholder={workSido ? "시·군·구 선택" : "시·도를 먼저 선택"}
              options={workSido ? (REGIONS[workSido] ?? []) : []}
              disabled={!workSido}
              invalid={Boolean(errors.workSigungu)}
              {...register("workSigungu")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-body-sm text-ink mb-1 font-semibold">
          가능한 시간대 <span className="text-danger">*</span>
        </legend>
        <p className="text-caption text-text-sub mb-3">복수 선택 가능합니다.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TIME_SLOTS.map((slot) => (
            <label
              key={slot}
              className="border-border text-body-sm text-ink hover:border-border-strong ease-standard flex cursor-pointer items-center gap-3 rounded-sm border bg-white px-4 py-3 transition-colors duration-[160ms]"
            >
              <input
                type="checkbox"
                value={slot}
                className="accent-brand size-5 shrink-0 rounded-[6px]"
                {...register("timeSlots")}
              />
              {slot}
            </label>
          ))}
        </div>
        {errors.timeSlots && (
          <p role="alert" className="text-caption text-danger mt-2">
            {errors.timeSlots.message}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-body-sm text-ink mb-3 font-semibold">
          이동 수단 <span className="text-danger">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {TRANSPORT.map((t) => (
            <label
              key={t}
              className="border-border text-body-sm text-ink hover:border-border-strong ease-standard flex cursor-pointer items-center gap-3 rounded-sm border bg-white px-4 py-3 transition-colors duration-[160ms]"
            >
              <input
                type="radio"
                value={t}
                className="accent-brand size-5 shrink-0"
                {...register("transport")}
              />
              {t}
            </label>
          ))}
        </div>
        {errors.transport && (
          <p role="alert" className="text-caption text-danger mt-2">
            {errors.transport.message}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-body-sm text-ink mb-1 font-semibold">관련 경력</legend>
        {/* 경력이 없어도 지원할 수 있다는 사실을 여기서 미리 말해 준다 */}
        <p className="text-caption text-text-sub mb-3">
          경력이 없어도 지원하실 수 있습니다. 교육 후 배정됩니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXPERIENCE.map((t) => (
            <label
              key={t}
              className="border-border text-body-sm text-ink hover:border-border-strong ease-standard flex cursor-pointer items-center gap-3 rounded-sm border bg-white px-4 py-3 transition-colors duration-[160ms]"
            >
              <input
                type="radio"
                value={t}
                className="accent-brand size-5 shrink-0"
                {...register("experience")}
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="하고 싶은 말"
        hint="최대 500자"
        error={errors.message?.message}
        htmlFor="c-message"
      >
        <TextArea
          id="c-message"
          maxLength={500}
          placeholder="궁금하신 점이나 알려주고 싶은 내용을 적어주세요."
          invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </Field>

      <div className="border-border bg-bg-subtle rounded-lg border p-5">
        <Checkbox
          id="c-agree"
          label="(필수) 개인정보 수집·이용에 동의합니다"
          {...register("agreePrivacy")}
          description={
            <dl className="grid gap-1.5">
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">수집 항목</dt>
                <dd>성함, 연락처, 거주 지역, 희망 근무 지역, 가능 시간대, 이동 수단, 관련 경력</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">이용 목적</dt>
                <dd>매장매니저 채용 전형 진행 및 결과 안내</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">보유 기간</dt>
                {/*
                  사용자 지시(2026-08-19) — 확정 필요 표시와 처리방침 링크를 지우고
                  보유기간만 적는다. 전문은 푸터의 `개인정보처리방침` 링크로 닿는다.

                  `text-warning`(주황)도 뗐다. 그 색은 "아직 확정되지 않은 값" 표시라
                  확정 문구에 남겨 두면 방문자에게 경고로 읽힌다.
                */}
                <dd>목적 달성 시 폐기</dd>
              </div>
            </dl>
          }
        />
        {errors.agreePrivacy && (
          <p role="alert" className="text-caption text-danger mt-3">
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
          {isSubmitting ? "접수 중" : "지원서 제출"}
        </Button>
        <p
          className={cn("text-caption text-text-sub mt-3 text-center", agreePrivacy && "invisible")}
        >
          개인정보 수집·이용에 동의하시면 지원할 수 있습니다.
        </p>
      </div>
    </form>
  );
}
