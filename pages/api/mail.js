import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;
globalThis.MAIL_RL = globalThis.MAIL_RL || new Map();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://www.gglmoveis.com.br,https://gglmoveis.com.br")
  .split(",").map((s) => s.trim());

const isEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const parseList = (v = "") => v.split(",").map((s) => s.trim()).filter(Boolean);

const DEFAULT_TO = ["ggl@gglmoveis.com.br", "felipeschandle@gmail.com", "pedro.neto72pn@gmail.com"];
const TIPO_LABEL = (t) => (t === "empresa" ? "Empresa" : t === "orgao_publico" ? "Órgão Público" : "Pessoa Física");

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
  const recent = bucket.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return res.status(429).json({ error: "Muitas requisições. Tente novamente mais tarde." });
  recent.push(now);
  globalThis.MAIL_RL.set(ip, recent);

  const body = req.body || {};
  const legacy = body.form && typeof body.form === "object" ? body.form : body;
  const replyToInBody = body.replyTo ?? legacy.replyTo;

  const asStr = (v) => (typeof v === "string" ? v : "");
  const {
    name = "", email = "", phone = "",
    tipo_pessoa = "pf",
    razao_social = "", company = "",
    estado = "", cidade = "",
    message = "",
    gclid = "", gbraid = "", wbraid = "",
  } = legacy;

  const _name = asStr(name);
  const _email = asStr(email);
  const _phone = asStr(phone);
  const _tipo = asStr(tipo_pessoa);
  const _razao = asStr(razao_social);
  const _company = asStr(company);
  const _estado = asStr(estado);
  const _cidade = asStr(cidade);
  const _msg = asStr(message);
  const _gclid = asStr(gclid);
  const _gbraid = asStr(gbraid);
  const _wbraid = asStr(wbraid);

  if (!_name || !_email || !_phone || !_msg) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }
  if (!isEmail(_email)) return res.status(400).json({ error: "E-mail inválido." });

  const replyToHeader = isEmail(asStr(replyToInBody) || _email) ? (asStr(replyToInBody) || _email) : undefined;

  const companyFinal = (_tipo === "empresa" || _tipo === "orgao_publico") ? (_razao || _company) : "";

  const html = `
    <h3>Novo contato via site GGL Móveis</h3>
    <p><strong>Tipo:</strong> ${esc(TIPO_LABEL(_tipo))}</p>
    ${companyFinal ? <p><strong>Razão social:</strong> ${esc(companyFinal)}</p> : ""}
    <p><strong>Nome:</strong> ${esc(_name)}</p>
    <p><strong>Email:</strong> ${esc(_email)}</p>
    <p><strong>Telefone:</strong> ${esc(_phone)}</p>
    <p><strong>Estado:</strong> ${esc(_estado)}</p>
    <p><strong>Cidade:</strong> ${esc(_cidade)}</p>
    <p><strong>Mensagem:</strong><br/>${esc(_msg).replace(/\n/g, "<br/>")}</p>
    <hr/>
    <p><em>Códigos do anúncio</em></p>
    <p>gclid: ${esc(_gclid || "-")}</p>
    <p>gbraid: ${esc(_gbraid || "-")}</p>
    <p>wbraid: ${esc(_wbraid || "-")}</p>
  `.trim();

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

export const config = { api: { bodyParser: { sizeLimit: "200kb" } } };