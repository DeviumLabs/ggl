export function VideoBlock({ source, url, caption }) {
  const videoId = source === "youtube" ? url.split("v=")[1]?.split("&")[0] : null;
  return (
    <figure style={{ marginBottom: "var(--blog-space-6)" }}>
      {source === "youtube" && videoId && (
        <iframe
          title={caption || "Vídeo incorporado"}
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          style={{
            width: "100%",
            height: "var(--blog-video-embed-height)",
            borderRadius: "var(--blog-radius-sm)",
            border: "none",
          }}
        />
      )}
      {caption && (
        <figcaption
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--blog-color-text-muted)",
            marginTop: "var(--blog-space-4)",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
