import type { CSSProperties, ImgHTMLAttributes } from "react";

type AppImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
};

export default function AppImage({ src, alt, width, height, fill, priority, className, style, ...props }: AppImageProps) {
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
    : style;
  return (
    <img
      {...props}
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      loading={priority ? "eager" : props.loading ?? "lazy"}
      fetchPriority={priority ? "high" : props.fetchPriority}
      decoding="async"
      className={className}
      style={fillStyle}
    />
  );
}
