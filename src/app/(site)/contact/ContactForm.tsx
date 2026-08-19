"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Field, Select, TextArea, TextInput } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import {
  REFERRERS,
  STORE_COUNTS,
  STORE_TYPES,
  VISIT_OPTIONS,
  contactSchema,
  formatPhone,
  type ContactInput,
} from "@/lib/contact-schema";
import { AREA_BANDS, ADD_ONS, STORE_TYPES as PRICING_TYPES, VISIT_PLANS } from "@/lib/pricing";
import { REGIONS, SIDO } from "@/lib/regions";
// 서버 액션을 직접 import 하지 않는다 — 정적 미리보기 빌드에서 교체되는 지점이다
import { submitContact } from "@/lib/form-submit";

/**
 * 도입 상담 신청 폼 — 1순위 전환(PRD §7.6).
 *
 * ── 잃으면 안 되는 것 ──
 * 이 화면에서 가장 비싼 사고는 **입력값 소실**이다. 다 채운 폼이 네트워크 오류로
 * 날아가면 그 사람은 다시 채우지 않는다. 그래서 실패 시 값은 그대로 두고
 * 재시도만 안내한다(PRD §7.6 AC).
 *
 * ── 동의 ──
 * 마케팅 수신 동의는 **필수 동의와 분리하고 초기 상태를 해제**로 둔다.
 * 사전 체크는 개인정보보호법 위반이다. 필수 3요소(수집 항목·이용 목적·보유 기간)는
 * 동의 체크박스와 **같은 화면에서** 확인할 수 있어야 한다.
 *
 * ── 요금 계산기 연동 ──
 * 홈 계산기가 넘긴 쿼리로 업종·방문 횟수를 미리 채우고, 계산기에만 있는 조건
 * (면적·추가 옵션)은 문의 내용에 문장으로 적어 둔다. 그래야 "선택하신 조건은
 * 상담 신청서에 그대로 채워집니다"라는 약속이 실제로 지켜진다.
 */

/** 계산기 id → 상담 폼 라벨. 두 목록의 값 체계가 달라 변환이 필요하다 */
const TYPE_BY_PRICING_ID: Record<string, (typeof STORE_TYPES)[number]> = {
  kids: "무인키즈카페",
  icecream: "무인아이스크림",
  laundry: "무인세탁",
  stationery: "무인문구",
  study: "무인스터디카페",
  etc: "기타",
};

const VISIT_BY_PRICING_ID: Record<string, (typeof VISIT_OPTIONS)[number]> = {
  w1: "주 1회",
  w2: "주 2회",
  w3: "주 3회",
  w5: "주 5회",
  w7: "매일",
};

export function ContactForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      sido: "",
      sigungu: "",
      message: "",
      // 개인정보보호법 — 사전 체크 금지
      agreeMarketing: false,
    },
  });

  const sido = watch("sido");
  const phone = watch("phone");
  const referrer = watch("referrer");
  const agreePrivacy = watch("agreePrivacy");

  // 계산기에서 넘어온 조건을 채운다. 마운트 후 한 번만.
  useEffect(() => {
    const type = params.get("type");
    const visits = params.get("visits");
    const area = params.get("area");
    const options = params.get("options");

    if (type && TYPE_BY_PRICING_ID[type]) setValue("storeType", TYPE_BY_PRICING_ID[type]);
    if (visits && VISIT_BY_PRICING_ID[visits]) setValue("visits", VISIT_BY_PRICING_ID[visits]);

    // 면적·추가 옵션은 폼에 대응 필드가 없다(§7.6 은 8개 필드로 고정).
    // 버리지 않고 문의 내용에 문장으로 남긴다 — 사용자가 지울 수도 있다.
    const parts: string[] = [];
    const areaLabel = AREA_BANDS.find((a) => a.id === area)?.label;
    const typeLabel = PRICING_TYPES.find((t) => t.id === type)?.label;
    const visitLabel = VISIT_PLANS.find((v) => v.id === visits)?.label;
    if (typeLabel) parts.push(typeLabel);
    if (areaLabel) parts.push(areaLabel);
    if (visitLabel) parts.push(visitLabel);
    if (options) {
      const names = options
        .split(",")
        .map((id) => ADD_ONS.find((o) => o.id === id)?.label)
        .filter(Boolean);
      if (names.length) parts.push(names.join(" · "));
    }
    if (parts.length) {
      setValue("message", `예상 견적에서 선택한 조건: ${parts.join(" / ")}`);
    }
  }, [params, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await submitContact(values);

      if (result.ok) {
        router.push("/contact/complete");
        return;
      }

      // 서버가 짚어준 필드를 화면에 그대로 연결한다
      if (result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          setError(key as keyof ContactInput, { message });
        }
      }
      setFormError(result.message);
    } catch {
      // 입력값은 건드리지 않는다. 값이 날아가면 리드가 날아간다.
      setFormError("전송에 실패했습니다. 입력하신 내용은 그대로 있으니 잠시 후 다시 눌러주세요.");
    }
  });

  const sigunguOptions = sido ? (REGIONS[sido] ?? []) : [];

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

      <Field label="매장 업종" required error={errors.storeType?.message} htmlFor="storeType">
        <Select
          id="storeType"
          placeholder="선택해 주세요"
          options={STORE_TYPES}
          invalid={Boolean(errors.storeType)}
          aria-describedby={errors.storeType ? "storeType-desc" : undefined}
          {...register("storeType")}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="매장 위치 (시·도)" required error={errors.sido?.message} htmlFor="sido">
          <Select
            id="sido"
            placeholder="시·도 선택"
            options={SIDO}
            invalid={Boolean(errors.sido)}
            aria-describedby={errors.sido ? "sido-desc" : undefined}
            {...register("sido", {
              // 시·도를 바꾸면 이전 시·군·구는 더 이상 유효하지 않다
              onChange: () => setValue("sigungu", ""),
            })}
          />
        </Field>

        <Field label="시·군·구" required error={errors.sigungu?.message} htmlFor="sigungu">
          <Select
            id="sigungu"
            placeholder={sido ? "시·군·구 선택" : "시·도를 먼저 선택해 주세요"}
            options={sigunguOptions}
            disabled={!sido}
            invalid={Boolean(errors.sigungu)}
            aria-describedby={errors.sigungu ? "sigungu-desc" : undefined}
            {...register("sigungu")}
          />
        </Field>
      </div>

      <Field label="운영 매장 수" required error={errors.storeCount?.message} htmlFor="storeCount">
        <Select
          id="storeCount"
          placeholder="선택해 주세요"
          options={STORE_COUNTS}
          invalid={Boolean(errors.storeCount)}
          aria-describedby={errors.storeCount ? "storeCount-desc" : undefined}
          {...register("storeCount")}
        />
      </Field>

      <Field label="희망 관리 횟수" hint="정하지 않으셨다면 비워두셔도 됩니다" htmlFor="visits">
        <Select
          id="visits"
          placeholder="선택 안 함"
          options={VISIT_OPTIONS}
          {...register("visits")}
        />
      </Field>

      <Field label="문의 내용" hint="최대 500자" error={errors.message?.message} htmlFor="message">
        <TextArea
          id="message"
          maxLength={500}
          placeholder="궁금하신 점이나 매장 상황을 적어주세요."
          invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-desc" : undefined}
          {...register("message")}
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
      <div className="border-border bg-bg-subtle flex flex-col gap-5 rounded-lg border p-5">
        <Checkbox
          id="agreePrivacy"
          label="(필수) 개인정보 수집·이용에 동의합니다"
          {...register("agreePrivacy")}
          description={
            /*
              PRD §7.6 AC — 필수 3요소를 동의 체크박스와 같은 화면에서 확인할 수 있어야 한다.

              ⚠️ 보유 기간은 사용자 확정(2026-08-14)으로 "목적 달성 시 폐기"로 표기한다.
                 개인정보처리방침 제3조는 "문의 처리 완료 후 1년까지 보관 후 파기"라
                 두 문서가 어긋난 상태다 — 오픈 전에 방침 원본과 함께 일치시켜야 한다.
              ⚠️ 수집 항목은 **이 폼이 실제로 받는 것**을 적었다. 그런데 방침 제2조는
                 상담문의 항목을 "이름, 연락처"로만 한정하고 있다. 방침에 없는 항목을
                 수집하면 그 자체가 위반이므로 오픈 전에 둘을 일치시켜야 한다.
            */
            <dl className="grid gap-1.5">
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">수집 항목</dt>
                <dd>
                  성함, 연락처, 매장 업종·위치·운영 매장 수, 희망 관리 횟수, 문의 내용, 유입 경로
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">이용 목적</dt>
                <dd>도입 상담 및 방문 진단 일정 안내</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[68px] shrink-0 font-semibold">보유 기간</dt>
                <dd>목적 달성 시 폐기</dd>
              </div>
            </dl>
          }
        />
        {errors.agreePrivacy && (
          <p role="alert" className="text-caption text-danger">
            {errors.agreePrivacy.message}
          </p>
        )}

        <div className="border-border border-t pt-5">
          {/* 초기 상태 해제. 사전 체크는 개인정보보호법 위반이다 */}
          <Checkbox
            id="agreeMarketing"
            label="(선택) 요금·서비스 안내 등 마케팅 정보 수신에 동의합니다"
            description="동의하지 않으셔도 상담은 정상적으로 진행됩니다."
            {...register("agreeMarketing")}
          />
        </div>
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
          {isSubmitting ? "접수 중" : "도입 상담 신청하기"}
        </Button>

        {/* 버튼이 왜 잠겨 있는지 텍스트로 알린다(PRD §7.6 AC) */}
        {!agreePrivacy && (
          <p className="text-caption text-text-sub mt-3 text-center">
            개인정보 수집·이용에 동의하시면 신청할 수 있습니다.
          </p>
        )}
      </div>
    </form>
  );
}
