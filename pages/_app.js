import "../styles/globals.css";
import "react-alice-carousel/lib/alice-carousel.css";
import Script from "next/script";
import { Plus_Jakarta_Sans, Merriweather, Nanum_Gothic } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700"], variable: "--font-jakarta" });
const merri = Merriweather({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-merri" });
const nanum = Nanum_Gothic({ subsets: ["latin"], weight: ["700"], variable: "--font-nanum" });

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`${jakarta.className} ${jakarta.variable} ${merri.variable} ${nanum.variable}`}>
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-NMZW62HG');`}</Script>

      <Component {...pageProps} />
    </div>
  );
}
