const sizeMap = { "2": "var(--text-3xl)", "3": "var(--text-2xl)", "4": "var(--text-xl)" };

export function HeadingBlock({ level, text }) {
  const levelKey = String(level);
  const Tag = `h${levelKey}`;
  return (
    <Tag
      style={{
        fontSize: sizeMap[levelKey],
        fontWeight: "700",
        color: "var(--blog-color-text)",
        marginTop: levelKey === "2" ? "var(--blog-space-12)" : "var(--blog-space-8)",
        marginBottom: "var(--blog-space-4)",
      }}
    >
      {text}
    </Tag>
  );
}
