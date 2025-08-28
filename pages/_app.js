import "../styles/globals.css";
import Script from "next/script";
import CookieConsent from "react-cookie-consent";
import { useRef } from "react";
import { Plus_Jakarta_Sans, Merriweather, Nanum_Gothic } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});
const merri = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merri",
});
const nanum = Nanum_Gothic({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-nanum",
});

export default function MyApp({ Component, pageProps }) {
  const gtmLoadedRef = useRef(false);

  const loadGTM = () => {
    if (gtmLoadedRef.current) return;
    gtmLoadedRef.current = true;

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    }

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=GTM-NMZW62HG";
    document.head.appendChild(s);
  };

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
    loadGTM();
  };

  const handleDecline = () => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
  };

  return (
    <div className={`${jakarta.className} ${jakarta.variable} ${merri.variable} ${nanum.variable}`}>
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied'
          });
        `}
      </Script>

      <Component {...pageProps} />

<CookieConsent
  location="none" // desativa os estilos padrão de bottom/top
  buttonText="Aceitar"
  declineButtonText="Recusar"
  enableDeclineButton
  cookieName="ggl-consent"
  onAccept={handleAccept}
  onDecline={handleDecline}
  style={{
    background: "#ffffff",
    color: "#0F172A",
    position: "fixed",
    bottom: "20px",
    left: "20px",
    width: "300px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    padding: "16px",
    textAlign: "left",
    zIndex: 9999,
  }}
  buttonStyle={{
    background: "#0058C2",
    color: "#fff",
    fontSize: "14px",
    borderRadius: "6px",
    padding: "6px 12px",
  }}
  declineButtonStyle={{
    background: "#e5e7eb",
    color: "#111",
    fontSize: "14px",
    borderRadius: "6px",
    padding: "6px 12px",
    marginLeft: "8px",
  }}
>
  <p style={{ marginBottom: "10px", fontSize: "14px" }}>
    Usamos cookies para melhorar sua experiência e medir desempenho.
  </p>
</CookieConsent>

    </div>
  );
}