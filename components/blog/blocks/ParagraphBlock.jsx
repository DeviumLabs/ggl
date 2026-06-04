export function ParagraphBlock({ text }) {
  if (!text) return null;
  const content =
    typeof text === "string"
      ? text
      : text?.root?.children?.map((n) => n.children?.map((c) => c.text).join("")).join("\n") ?? "";
  return (
    <p
      style={{
        fontSize: "var(--text-base)",
        lineHeight: "var(--blog-prose-leading)",
        color: "var(--blog-color-text)",
        marginBottom: "var(--blog-space-4)",
      }}
    >
      {content}
    </p>
  );
}
