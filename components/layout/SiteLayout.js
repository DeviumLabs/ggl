import dynamic from "next/dynamic";
import Header from "../header";
import Footer from "../footer";

const Whatsapp = dynamic(() => import("../whatsapp"), { ssr: false });

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <Whatsapp message="Olá! Vim pelo site e gostaria de falar com a GGL Móveis." />
    </>
  );
}
