import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;
globalThis.MAIL_RL = globalThis.MAIL_RL || new Map();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://www.gglmoveis.com.br,https://gglmoveis.com.br")
  .split(",").map(s => s.trim());

const isEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));
const parseList = (v = "") => v.split(",").map(s => s.trim()).filter(Boolean);

const DEFAULT_TO = ["ggl@gglmoveis.com.br", "felipeschandle@gmail.com", "pedro.neto72pn@gmail.com"];
const TIPO_LABEL = (t) => t === "empresa" ? "Empresa" : t === "orgao_publico" ? "Órgão Público" : "Pessoa Física";
const asStr = (v) => (v == null ? "" : typeof v === "string" ? v : JSON.stringify(v) === "{}" ? "" : String(v));

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: "RESEND_API_KEY ausente" });

  // Rate limit simples
  const ip = (req.headers["x-forwarded-for"]?.toString().split(",")[0] ?? req.socket?.remoteAddress ?? "unknown").trim();
  const now = Date.now();
  const bucket = globalThis.MAIL_RL.get(ip) || [];
  const recent = bucket.filter(t => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return res.status(429).json({ error: "Muitas requisições. Tente novamente mais tarde." });
  recent.push(now);
  globalThis.MAIL_RL.set(ip, recent);

  const body = req.body || {};
  const legacy = (body.form && typeof body.form === "object") ? body.form : body;
  const replyToInBody = body.replyTo ?? legacy.replyTo;

  // Normaliza como string SEMPRE
  const name = asStr(legacy.name);
  const email = asStr(legacy.email);
  const phone = asStr(legacy.phone);
  const tipo_pessoa = asStr(legacy.tipo_pessoa || "pf");
  const razao_social = asStr(legacy.razao_social);
  const company = asStr(legacy.company);
  const estado = asStr(legacy.estado);
  const cidade = asStr(legacy.cidade);
  const message = asStr(legacy.message);
  const gclid = asStr(legacy.gclid);
  const gbraid = asStr(legacy.gbraid);
  const wbraid = asStr(legacy.wbraid);

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }
  if (!isEmail(email)) return res.status(400).json({ error: "E-mail inválido." });

  const replyToHeader = isEmail(asStr(replyToInBody) || email) ? (asStr(replyToInBody) || email) : undefined;
  const companyFinal = (tipo_pessoa === "empresa" || tipo_pessoa === "orgao_publico") ? (razao_social || company) : "";

  const rows = [
    "<h3>Novo contato via site GGL Móveis</h3>",
    <p><strong>Tipo:</strong> ${esc(TIPO_LABEL(tipo_pessoa))}</p>,
  ];
  if (companyFinal) rows.push(<p><strong>Razão social:</strong> ${esc(companyFinal)}</p>);
  rows.push(
    <p><strong>Nome:</strong> ${esc(name)}</p>,
    <p><strong>Email:</strong> ${esc(email)}</p>,
    <p><strong>Telefone:</strong> ${esc(phone)}</p>,
    <p><strong>Estado:</strong> ${esc(estado)}</p>,
    <p><strong>Cidade:</strong> ${esc(cidade)}</p>,
    <p><strong>Mensagem:</strong><br />${esc(message).replace(/\n/g, "<br/>")}</p>,
    "<hr/>",
    "<p><em>Códigos do anúncio</em></p>",
    <p>gclid: ${esc(gclid || "-")}</p>,
    <p>gbraid: ${esc(gbraid || "-")}</p>,
    <p>wbraid: ${esc(wbraid || "-")}</p>
  );
  const html = rows.join("\n");

  try {
    const parsedTo = parseList(process.env.MAIL_TO);
    const toList = parsedTo.length ? parsedTo : DEFAULT_TO;

    const data = await resend.emails.send({
      from: process.env.MAIL_FROM || "GGL Móveis <contato@dotwave.com.br>",
      to: toList,
      subject: "Novo contato via site - GGL Móveis",
      html,
      reply_to: replyToHeader,
    });

    return res.status(200).json({ success: true, id: data?.id || null });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: "200kb" } },
};