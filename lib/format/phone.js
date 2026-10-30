// Formata telefone brasileiro enquanto o usuário digita.
// Mesma regra da máscara que existia antes: com mais de 10 dígitos usa 5-4 ("(XX) XXXXX-XXXX"),
// até 10 dígitos usa 4-5 ("(XX) XXXX-XXXXX"). Limitado a 11 dígitos.
export function formatPhoneBR(value = "") {
  const digits = String(value).replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (!rest) return area.length === 2 ? `(${area})` : `(${area}`;

  const firstLen = digits.length > 10 ? 5 : 4;
  const first = rest.slice(0, firstLen);
  const second = rest.slice(firstLen);

  return `(${area}) ${first}${second ? `-${second}` : ""}`;
}
