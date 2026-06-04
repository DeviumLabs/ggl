import Image from "next/image";

const maxWidthMap = { small: "400px", medium: "600px", large: "800px", full: "100%" };

export function ImageBlock({ asset, layout, size, caption, credit }) {
  const s = {
    maxWidth: maxWidthMap[size ?? "large"],
    marginBottom: "var(--blog-space-6)",
    ...(layout === "center" && { margin: "0 auto var(--blog-space-6)" }),
    ...(layout === "start" && { float: "left", marginRight: "var(--blog-space-6)" }),
    ...(layout === "end" && { float: "right", marginLeft: "var(--blog-space-6)" }),
    ...(layout === "full" && { width: "100%", maxWidth: "100%" }),
  };
  return (
    <figure style={s}>
      <Image
        src={asset.url}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        style={{ width: "100%", height: "auto", borderRadius: "var(--blog-radius-sm)" }}
      />
      {(caption || credit) && (
        <figcaption
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--blog-color-text-muted)",
            marginTop: "var(--blog-space-4)",
          }}
        >
          {caption}
          {credit && <em> — {credit}</em>}
        </figcaption>
      )}
    </figure>
  );
}
