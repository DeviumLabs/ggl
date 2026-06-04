export function QuoteBlock({ text, attribution }) {
  return (
    <blockquote
      style={{
        borderLeft: "3px solid var(--blog-color-primary)",
        paddingLeft: "var(--blog-space-6)",
        marginBottom: "var(--blog-space-6)",
        fontStyle: "italic",
        fontSize: "var(--text-lg)",
        color: "var(--blog-color-text-muted)",
      }}
    >
      <p style={{ margin: 0 }}>{text}</p>
      {attribution && (
        <cite
          style={{
            fontSize: "var(--text-sm)",
            fontStyle: "normal",
            display: "block",
            marginTop: "var(--blog-space-4)",
          }}
        >
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}
