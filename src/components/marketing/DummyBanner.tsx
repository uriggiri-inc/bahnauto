import { DUMMY_CONTENT } from "@/content/dummy";

/**
 * "이 페이지의 값은 샘플입니다" 띠.
 *
 * 검증되지 않은 실적·후기·요금을 표시 없이 게시하면 표시광고법상 부당표시가 된다
 * (CLAUDE.md §5). 화면 설계를 위해 가짜 값을 넣되, **읽는 사람이 가짜인 줄 알 수
 * 있게** 한 줄로 밝힌다.
 *
 * `content/dummy.ts` 의 `DUMMY_CONTENT` 가 false 로 내려가면 이 띠는 전 페이지에서
 * 한 번에 사라진다. **개별 페이지에서 이 컴포넌트를 지워 배너만 없애지 말 것** —
 * 그러면 가짜 값이 표시 없이 남는다.
 */
/**
 * 사용자 확정(2026-08-14): 화면 확인에 방해가 되어 띠를 **일시 숨김**.
 *
 * ⚠️ 외부 공개(배포) 전에는 반드시 둘 중 하나를 해야 한다 —
 *    ① 이 플래그를 false 로 되돌려 띠를 되살리거나
 *    ② `dummy.ts` 의 잠정값을 실제 확정값으로 교체(`DUMMY_CONTENT = false`).
 *    잠정 수치를 표시 없이 공개하면 표시광고법상 부당표시가 된다(CLAUDE.md §5).
 *    페이지들의 `<DummyBanner>` 호출은 그대로 두었으므로 여기 한 줄로 복구된다.
 */
const BANNER_HIDDEN = true;

export function DummyBanner({ what }: { what: string }) {
  if (BANNER_HIDDEN || !DUMMY_CONTENT) return null;

  return (
    <div className="border-warning/35 bg-warning-bg border-b">
      <p className="container-ba text-caption text-ink flex items-center gap-2 py-2.5">
        <span aria-hidden className="bg-warning size-1.5 shrink-0 rounded-full" />
        <span>
          <strong className="font-semibold">샘플 데이터</strong> — 이 페이지의 {what}는 화면 설계를
          위한 임시 값입니다. 실제 확정 값이 아닙니다.
        </span>
      </p>
    </div>
  );
}
