/**
 * 폼 제출 진입점 — **화면은 항상 이 모듈만 본다.**
 *
 * 서버 액션을 폼에서 직접 import 하지 않는 이유:
 * 정적 내보내기(`STATIC_EXPORT=1`) 빌드는 서버 액션을 지원하지 않아 빌드가 실패한다.
 * 그때 `next.config.ts` 가 이 파일을 `form-submit.static.ts` 로 갈아끼운다.
 * 화면 코드는 어느 빌드인지 몰라도 되고, 서버 액션은 원래대로 남는다.
 *
 * ⚠️ 여기에 로직을 넣지 않는다. 교체본과 동작이 갈라지는 순간
 *    "미리보기에서는 되는데 배포하면 안 되는" 종류의 버그가 생긴다.
 */
export { submitContact } from "@/app/(site)/contact/actions";
export { submitApplication } from "@/app/(site)/careers/actions";
export { submitBrochure } from "@/app/(site)/brochure/actions";
export { submitTrial } from "@/app/(site)/trial/actions";
