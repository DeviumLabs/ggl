import { AiOutlineWhatsApp } from "react-icons/ai";
import { useMemo, useRef, useEffect } from "react";
import { dlPush } from "../lib/analytics/dataLayer";

const onlyDigits = (s = "") => s.replace(/\D/g, "");

export default function Whatsapp({ message }) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "554230252200";

  const phoneE164 = useMemo(() => {
    const digits = onlyDigits(raw);
    if (!digits) return "";
    return digits.startsWith("55") ? digits : `55${digits}`;
  }, [raw]);

  const text = useMemo(() => {
    const defaultMsg = "Olá! Vim pelo site e gostaria de falar com a GGL Móveis.";
    return encodeURIComponent(message || defaultMsg);
  }, [message]);

  const href = phoneE164 ? `https://wa.me/${phoneE164}?text=${text}` : "";

  const btnRef = useRef(null);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (!btnRef.current || viewedRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !viewedRef.current) {
          dlPush("whatsapp_fab_view", {
            component: "whatsapp_fab",
            page: typeof window !== "undefined" ? window.location.pathname : ""
          });
          viewedRef.current = true;
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(btnRef.current);
    return () => obs.disconnect();
  }, []);

  const onClick = () => {
    dlPush("whatsapp_click", { component: "whatsapp_fab" });
  };

  if (!href) return null;

  return (
    <a
      ref={btnRef}
      target="_blank"
      rel="nofollow noopener noreferrer"
      href={href}
      onClick={onClick}
      aria-label="Abrir conversa no WhatsApp"
      className="tw-rounded-full tw-h-16 tw-w-16 tw-bg-green-600 tw-fixed tw-right-[20px] tw-bottom-[20px] tw-flex tw-items-center tw-justify-center hover:tw-opacity-90 tw-transition"
    >
      <AiOutlineWhatsApp color="white" size={40} />
    </a>
  );
}
