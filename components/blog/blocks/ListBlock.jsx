export function ListBlock({ style: listStyle, items }) {
  const Tag = listStyle === "ordered" ? "ol" : "ul";
  return (
    <Tag
      style={{
        paddingLeft: "var(--blog-space-6)",
        marginBottom: "var(--blog-space-6)",
        fontSize: "var(--text-base)",
        lineHeight: "var(--blog-prose-leading)",
        color: "var(--blog-color-text)",
      }}
    >
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: "var(--blog-space-4)" }}>
          {item.text}
        </li>
      ))}
    </Tag>
  );
}
