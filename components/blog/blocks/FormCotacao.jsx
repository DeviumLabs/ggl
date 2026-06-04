export function FormCotacao({ title, subtitle }) {
  return (
    <div
      style={{
        backgroundColor: "var(--blog-color-surface)",
        border: "1px solid var(--blog-color-border)",
        borderRadius: "var(--blog-radius-sm)",
        padding: "var(--blog-space-8)",
        marginBottom: "var(--blog-space-6)",
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: "700",
            marginBottom: "var(--blog-space-4)",
            color: "var(--blog-color-text)",
          }}
        >
          {title}
        </h3>
      )}
      {subtitle && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--blog-color-text-muted)",
            marginBottom: "var(--blog-space-6)",
          }}
        >
          {subtitle}
        </p>
      )}
      <p style={{ fontSize: "var(--text-sm)", color: "var(--blog-color-text-muted)" }}>
        [Formulário de cotação — implementar na próxima etapa]
      </p>
    </div>
  );
}
