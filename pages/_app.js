import "../styles/globals.css";
import Script from "next/script";
import CookieConsent from "react-cookie-consent";
import { useRef, useEffect } from "react";
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
    if (typeof document !== "undefined" && document.getElementById("gtm-loader")) {
      gtmLoadedRef.current = true;
      return;
    }
    gtmLoadedRef.current = true;

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    }

    const s = document.createElement("script");
    s.async = true;
    s.id = "gtm-loader";
    s.src = "https://www.googletagmanager.com/gtm.js?id=GTM-NMZW62HG";
    document.head.appendChild(s);
  };

  const setGtag = () => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
  };

  const handleAccept = () => {
    setGtag();
    window.gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    loadGTM();
  };

  const handleDecline = () => {
    setGtag();
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("ggl-consent="));
    if (!cookie) return;
    const value = decodeURIComponent(cookie.split("=")[1]); 
    if (value === "true") {
      handleAccept();
    } else if (value === "false") {
      handleDecline();
    }
  }, []);

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
        location="none" 
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
