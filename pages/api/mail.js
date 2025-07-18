import sg from "@sendgrid/mail";

sg.setApiKey(process.env.SENDGRID_APIKEY);
// Teste
export default function sendEmail(req, res) {
  const data = req.body;
  const message = {
    to: "felipeschandle@gmail.com",
    from: "deviumlabs@gmail.com",
    subject: "Contato | GGl Móveis",
    html: data.body.replace(/[\r\n]/gm, ""),
  };

  sg.send(message)
    .then((response) => {
      return res.json({
        status: 200,
        message: response,
      });
    })
    .catch((err) => {
      return res.json({
        status: 404,
        message: err,
      });
    });

  const message2 = {
    to: "felipeschandle@gmail.com",
    from: "deviumlabs@gmail.com",
    subject: "Contato | GGl Móveis",
    html: data.body.replace(/[\r\n]/gm, ""),
  };

  sg.send(message2)
    .then(() => {
    })
    .catch(() => {
    });
}
