import Image from "next/image";
import { ServiceIcon, type ServiceIconName } from "./serviceIcons";
import { cn } from "@/lib/cn";

export type { ServiceIconName };

/**
 * 서비스 6종 카드 — 정사각형.
 *
 * 배경에 **실제 매장 사진이 들어갈 자리**를 전제로 만들었다. 사진이 붙으면
 * 카드가 곧 증거가 되므로, 사진 유무에 따라 텍스트 색과 오버레이가 바뀐다.
 *   · 사진 있음 → 잉크 그라데이션 오버레이 + 흰 텍스트 (가독성 확보)
 *   · 사진 없음 → 브랜드 톤 면 + 잉크 텍스트
 *
 * 배경 사진은 사실을 주장하는 이미지가 아니라 분위기이므로 `[확정 필요]` 배지를
 * 띄우지 않는다. 반면 앱 캡처와 Before/After 는 주장을 담으므로 띄운다.
 *
 * 아이콘은 인라인 SVG 다 — 서버 컴포넌트로 남아 JS 를 늘리지 않는다.
 */

export type ServiceCardProps = {
  title: string;
  lead: string;
  icon: ServiceIconName;
  /** 배경 사진. 붙는 순간 카드가 증거가 된다 */
  image?: { src: string; alt: string };
  className?: string;
};

export function ServiceCard({ title, lead, icon, image, className }: ServiceCardProps) {
  const onPhoto = Boolean(image);

  return (
    <article
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border",
        "ease-standard transition-[transform,box-shadow] duration-[240ms]",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
        onPhoto ? "border-transparent" : "border-border bg-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {/* ── 배경 ── */}
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 340px"
            className="ease-standard object-cover transition-transform duration-[400ms] group-hover:scale-105"
          />
          {/* 텍스트 가독성 — 아래로 갈수록 짙어진다 */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[rgba(26,30,43,0.88)] via-[rgba(26,30,43,0.35)] to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <div className="from-brand-50 absolute inset-0 bg-gradient-to-br to-white" aria-hidden>
          {/* 사진이 붙기 전의 여백을 브랜드 링의 일부로 채운다 — 빈 상자로 두지 않는다 */}
          <svg
            className="absolute -right-10 -bottom-12 opacity-[0.07]"
            width="220"
            height="220"
            viewBox="0 0 140 140"
            fill="none"
            aria-hidden
          >
            <circle cx="70" cy="70" r="55" stroke="var(--color-brand)" strokeWidth="30.26" />
          </svg>
        </div>
      )}

      {/* ── 내용 ── */}
      <div className="relative flex h-full flex-col p-6">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full",
            onPhoto ? "bg-white/18 text-white backdrop-blur-[6px]" : "bg-brand-100 text-brand",
          )}
        >
          <ServiceIcon name={icon} />
        </span>

        {/* 텍스트는 카드 아래쪽에 붙인다 — 사진이 들어와도 위치가 흔들리지 않는다 */}
        <div className="mt-auto">
          <h3 className={cn("text-h3 mb-2", onPhoto ? "text-white" : "text-ink")}>{title}</h3>
          <p className={cn("text-body-sm", onPhoto ? "text-white/80" : "text-text-sub")}>{lead}</p>
        </div>
      </div>
    </article>
  );
}
