/**
 * Retorna true se o blog está habilitado para este ambiente.
 * Controlado pela variável de ambiente BLOG_ENABLED (server-side apenas).
 */
export function isBlogEnabled() {
  return process.env.BLOG_ENABLED === "true";
}
