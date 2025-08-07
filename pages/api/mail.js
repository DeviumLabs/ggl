import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { body } = req.body;

  if (!body) {
    return res.status(400).json({ error: 'Corpo da mensagem não informado' });
  }

  try {
    const data = await resend.emails.send({
      from: 'GGL Móveis <contato@dotwave.com.br>',
      to: ['felipeschandle@gmail.com'],
      subject: 'Novo contato via site - GGL Móveis',
      html: body,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }
}
