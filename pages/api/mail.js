import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;
globalThis._MAIL_RL_ = globalThis._MAIL_RL_ || new Map();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://www.gglmoveis.com.br,https://gglmoveis.com.br")
  .split(",").map(s => s.trim());

const isEmail = (s="") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const esc = (s="") => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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
  const bucket = globalThis._MAIL_RL_.get(ip) || [];
  const recent = bucket.filter(t => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return res.status(429).json({ error: "Muitas requisições. Tente novamente mais tarde." });
  recent.push(now);
  globalThis._MAIL_RL_.set(ip, recent);

  const {
    name = "", email = "", phone = "", company = "", estado = "", cidade = "", message = "",
    gclid = "", gbraid = "", wbraid = "", replyTo = ""
  } = req.body || {};

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }
  if (!isEmail(email)) return res.status(400).json({ error: "E-mail inválido." });
  const replyToHeader = isEmail(replyTo) ? replyTo : undefined;

  const html = `
    <h3>Novo contato via site GGL Móveis</h3>
    <p><strong>Nome:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Telefone:</strong> ${esc(phone)}</p>
    <p><strong>Empresa:</strong> ${esc(company || "-")}</p>
    <p><strong>Estado:</strong> ${esc(estado)}</p>
    <p><strong>Cidade:</strong> ${esc(cidade)}</p>
    <p><strong>Mensagem:</strong><br/>${esc(message).replace(/\n/g,"<br/>")}</p>
    <hr/>
    <p><em>Códigos do anúncio</em></p>
    <p>gclid: ${esc(gclid || "-")}</p>
    <p>gbraid: ${esc(gbraid || "-")}</p>
    <p>wbraid: ${esc(wbraid || "-")}</p>
  `.trim();

  try {
    const toList =
      process.env.MAIL_TO?.split(",").map(s => s.trim()).filter(Boolean) ||
      ["ggl@gglmoveis.com.br"];

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