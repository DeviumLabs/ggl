// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <link rel="icon" href="/logo.svg" type="image/svg+xml" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NMZW62HG"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
