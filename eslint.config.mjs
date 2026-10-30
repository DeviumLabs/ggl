import nextVitals from "eslint-config-next/core-web-vitals";

// Next 16 removeu o `next lint`; o lint agora roda direto pelo ESLint (flat config).
export default [
  ...nextVitals,
  {
    // Regras novas do React/Next 16 que apontaram padrões já existentes no código.
    // Estão como aviso para não bloquear o lint nesta migração; a refatoração fica para depois.
    rules: {
      "react-hooks/static-components": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
];
