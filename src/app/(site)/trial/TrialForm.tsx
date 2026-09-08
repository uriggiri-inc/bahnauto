"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Checkbox, Field, Select, TextInput } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPhone, CALL_TIMES, REFERRERS } from "@/lib/contact-schema";
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
 * 그때는 성함 › 연락처 › 이메일 › 회사명 또는 매장명 › 어떻게 알고 오셨나요 순서로 두
 * 폼이 같은 모양이었다. 그 전에는 세 항목(성함·연락처·회사명)뿐이었다.
 *
 * ── 2026-09-08 `연락 가능 시간대` 가 여기에만 들어왔다 (사용자 확정) ──
 * 연락처 바로 밑, 필수다. 소개서에는 넣지 않는다 — 사용자가 "소개서에는 추가 안 해도
 * 된다, 무료체험에만 넣자" 로 정정했다. 지금 순서는 성함 › 연락처 ›
 * **연락 가능 시간대** › 이메일 › 회사명 또는 매장명 › 어떻게 알고 오셨나요 다.
 *
 * ⚠️ **`BrochureForm` 과 항상 같게 유지하는 규칙은 없어졌다.** 함께 맞추는 범위는
 *    나머지 다섯 칸(성함·연락처·이메일·회사명 또는 매장명·유입 경로)의 순서와 라벨뿐이다.
 *    그 다섯 개를 고칠 때만 `BrochureForm` 을 함께 본다.
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

      {/* 연락처 **바로 밑**이 지정된 자리다(사용자 지시 2026-09-08). 번호를 적은 직후에
          "언제 받으실 수 있나요" 를 묻는 것이 자연스럽다. 라벨·힌트·선택지를 상담 폼
          (`ContactForm`)과 같게 맞췄다 — 같은 것을 묻는 칸이 폼마다 다르게 보이면 안 된다.
          소개서 폼에는 이 칸이 **없다**(위 머리 주석 참조). */}
      <Field
        label="연락 가능 시간대"
        required
        error={errors.callTime?.message}
        htmlFor="callTime"
        hint="이 시간대에 맞춰 연락드립니다."
      >
        <Select
          id="callTime"
          placeholder="선택해 주세요"
          options={CALL_TIMES}
          invalid={Boolean(errors.callTime)}
          aria-describedby={errors.callTime ? "callTime-desc" : undefined}
          {...register("callTime")}
        />
      </Field>

      {/* 여기부터 세 칸은 소개서 폼과 **같은 순서**다 — 이메일 › 회사명 › 유입경로
          (노션 「반오토 폼양식 수정」 2026-09-04). 이 세 칸의 순서·라벨을 바꿀 때는
          `BrochureForm` 도 함께 바꾼다. */}
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

              ⚠️ 아래 `수집 항목` 에 **연락 가능 시간대와 유입 경로가 빠져 있다.**
                 상담·지원 폼도 같은 상태여서 표기를 맞춰 둔 것이지, 받는 것과 고지가
                 일치한다는 뜻은 아니다. 방침 개정(X-02) 때 네 폼의 이 줄을 함께 손본다.
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
