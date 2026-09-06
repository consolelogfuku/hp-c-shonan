import type { ReactNode } from "react";

// 中央揃えの見出し + リード文（会社が語る部分なので明朝）
export function SectionHead({
  title,
  lead,
  align = "center",
  leadClassName = "",
}: {
  title: string;
  lead?: ReactNode;
  align?: "center" | "left";
  leadClassName?: string;
}) {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : ""}>
      <h2 className="text-[clamp(28px,3vw,38px)] leading-[1.5] tracking-[0.1em]">{title}</h2>
      {lead ? (
        <p className={`mt-4 max-w-[44em] text-[18px] leading-[1.9] text-muted ${center ? "mx-auto" : ""} ${leadClassName}`}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
