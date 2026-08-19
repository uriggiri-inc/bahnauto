import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * 타이포 스케일 토큰 (`globals.css` 의 `--text-*` 와 1:1).
 *
 * ⚠️ **이 목록이 비면 조판이 조용히 망가진다.**
 * tailwind-merge 는 `text-*` 를 폰트 크기와 텍스트 컬러 두 그룹으로 나눠 충돌을
 * 정리한다. 그런데 `text-h1` 처럼 기본 스케일에 없는 이름은 크기로 인식하지 못하고
 * **컬러로 분류**해 버린다. 그러면 아래가 같은 그룹이 되어 뒤엣것만 살아남는다.
 *
 *   cn("text-h1", "text-ink")  →  "text-ink"      ← 크기가 통째로 사라진다
 *
 * 실제로 이 사고가 났다. 섹션 제목과 페인 카드 제목이 `text-h1` 을 붙였는데도
 * 본문과 같은 16px 로 렌더됐다. 클래스가 지워지는 것이라 브라우저 개발자도구로
 * 봐야 보이고, 코드만 읽으면 원인을 찾을 수 없다.
 *
 * `globals.css` 의 `@theme` 에 `--text-*` 를 추가하면 **여기에도 반드시 추가한다.**
 */
const FONT_SIZES = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "body-lg",
  "body",
  "body-sm",
  "label",
  "caption",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
    },
  },
});

/**
 * 조건부 클래스 조합 + Tailwind 충돌 해소.
 *
 * 뒤에 온 클래스가 이깁니다. 컴포넌트가 기본 클래스를 갖고 있어도
 * 호출부에서 `className` 으로 덮어쓸 수 있게 하려면 반드시 이걸 거쳐야 합니다.
 *   cn("px-4 py-2", "px-6")  →  "py-2 px-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
