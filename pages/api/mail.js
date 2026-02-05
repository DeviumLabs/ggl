import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;
globalThis.MAIL_RL = globalThis.MAIL_RL || new Map();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://www.gglmoveis.com.br,https://gglmoveis.com.br")
  .split(",")
  .map((s) => s.trim());

const isEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const asStr = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  try {
    return String(v);
  } catch {
    return "";
  }
};

const esc = (s = "") =>
  asStr(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const parseList = (v = "") => v.split(",").map((s) => s.trim()).filter(Boolean);

const DEFAULT_TO = ["ggl@gglmoveis.com.br", "felipeschandle@gmail.com", "pedro.neto72pn@gmail.com"];
const TIPO_LABEL = (t) => (t === "empresa" ? "Empresa" : t === "orgao_publico" ? "Órgão Público" : "Pessoa Física");
const CHANNEL_LABEL = (c) => (c === "whatsapp" ? "WhatsApp" : c === "email" ? "E-mail" : "Não informado");

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

  const ip = (req.headers["x-forwarded-for"]?.toString().split(",")[0] ?? req.socket?.remoteAddress ?? "unknown").trim();
  const now = Date.now();
  const bucket = globalThis.MAIL_RL.get(ip) || [];
  const recent = bucket.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return res.status(429).json({ error: "Muitas requisições. Tente novamente mais tarde." });
  recent.push(now);
  globalThis.MAIL_RL.set(ip, recent);

  const body = req.body || {};
  const legacy = body.form && typeof body.form === "object" ? body.form : body;
  const replyToInBody = body.replyTo ?? legacy.replyTo;

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
  const channel = asStr(legacy.channel);
  const source_url = asStr(legacy.source_url);

  if (!name || !email || !phone || !message) return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  if (!isEmail(email)) return res.status(400).json({ error: "E-mail inválido." });

  const replyToHeader = isEmail(asStr(replyToInBody) || email) ? (asStr(replyToInBody) || email) : undefined;

  const companyFinal = tipo_pessoa === "empresa" || tipo_pessoa === "orgao_publico" ? (razao_social || company) : "";

  let html = "";
  html += "<h3>Novo contato via site GGL Móveis</h3>";
  html += "<p><strong>Canal escolhido:</strong> " + esc(CHANNEL_LABEL(channel)) + "</p>";
  html += "<p><strong>Tipo:</strong> " + esc(TIPO_LABEL(tipo_pessoa)) + "</p>";
  if (companyFinal) html += "<p><strong>Razão social:</strong> " + esc(companyFinal) + "</p>";
  html += "<p><strong>Nome:</strong> " + esc(name) + "</p>";
  html += "<p><strong>Email:</strong> " + esc(email) + "</p>";
  html += "<p><strong>Telefone:</strong> " + esc(phone) + "</p>";
  html += "<p><strong>Estado:</strong> " + esc(estado) + "</p>";
  html += "<p><strong>Cidade:</strong> " + esc(cidade) + "</p>";
  html += "<p><strong>Mensagem:</strong><br/>" + esc(message).replace(/\n/g, "<br/>") + "</p>";
  if (source_url) html += "<p><strong>URL de origem:</strong> " + esc(source_url) + "</p>";
  html += "<hr/>";
  html += "<p><em>Códigos do anúncio</em></p>";
  html += "<p>gclid: " + esc(gclid || "-") + "</p>";
  html += "<p>gbraid: " + esc(gbraid || "-") + "</p>";
  html += "<p>wbraid: " + esc(wbraid || "-") + "</p>";

  try {
    const parsedTo = parseList(process.env.MAIL_TO);
    const toList = parsedTo.length ? parsedTo : DEFAULT_TO;

    const data = await resend.emails.send({
      from: process.env.MAIL_FROM || "GGL Móveis <contato@dotwave.com.br>",
      to: toList,
      subject: "Novo contato via site - GGL Móveis",
      html,
      reply_to: replyToHeader
    });

    return res.status(200).json({ success: true, id: data?.id || null });
  } catch {
    return res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: "200kb" } }
};
