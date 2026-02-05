import { useEffect, useRef } from "react";

export default function ContactChannelModal({
  open,
  onClose,
  onChooseEmail,
  onChooseWhatsapp,
  whatsappAvailable,
  busy,
  title = "Como você prefere enviar?",
}) {
  const panelRef = useRef(null);
  const prevFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = typeof document !== "undefined" ? document.activeElement : null;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    setTimeout(() => {
      const el = panelRef.current?.querySelector("button");
      if (el) el.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (prevFocusRef.current && typeof prevFocusRef.current.focus === "function") {
        prevFocusRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-px-[16px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-channel-title"
      aria-describedby="contact-channel-desc"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="tw-absolute tw-inset-0 tw-bg-black/60" />

      <div
        ref={panelRef}
        className="tw-relative tw-w-full tw-max-w-[520px] tw-rounded-[12px] tw-bg-white tw-shadow-xl tw-p-[18px] md:tw-p-[22px]"
      >
        <div className="tw-flex tw-items-start tw-justify-between tw-gap-[12px]">
          <div>
            <h3 id="contact-channel-title" className="tw-text-[18px] md:tw-text-[20px] tw-font-semibold tw-text-slate-900">
              {title}
            </h3>
            <p id="contact-channel-desc" className="tw-mt-[6px] tw-text-[14px] tw-text-slate-600">
              Você já preencheu seus dados. Agora escolha o canal para enviar a mensagem.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="tw-h-[36px] tw-w-[36px] tw-rounded-[8px] tw-bg-slate-100 hover:tw-bg-slate-200 tw-text-slate-700 tw-flex tw-items-center tw-justify-center"
            aria-label="Fechar"
            disabled={busy}
          >
            ✕
          </button>
        </div>

        <div className="tw-mt-[16px] tw-grid tw-grid-cols-1 tw-gap-[10px]">
          <button
            type="button"
            onClick={onChooseWhatsapp}
            disabled={!whatsappAvailable || busy}
            className={`tw-w-full tw-rounded-[10px] tw-py-[12px] tw-px-[14px] tw-text-white tw-font-medium tw-transition ${
              !whatsappAvailable || busy
                ? "tw-bg-slate-300 tw-cursor-not-allowed"
                : "tw-bg-green-600 hover:tw-bg-green-700"
            }`}
          >
            Enviar pelo WhatsApp
          </button>
          <p className="tw-text-[13px] tw-text-slate-600">
            Abriremos uma conversa com sua mensagem pronta. Nossa equipe retornará por WhatsApp.
          </p>

          <button
            type="button"
            onClick={onChooseEmail}
            disabled={busy}
            className={`tw-w-full tw-rounded-[10px] tw-py-[12px] tw-px-[14px] tw-text-white tw-font-medium tw-transition ${
              busy ? "tw-bg-slate-300 tw-cursor-not-allowed" : "tw-bg-blue hover:tw-opacity-90"
            }`}
          >
            Enviar por e-mail
          </button>
          <p className="tw-text-[13px] tw-text-slate-600">
            Enviaremos para a equipe e o retorno será feito no e-mail informado no formulário.
          </p>
        </div>

        <div className="tw-mt-[18px] tw-flex tw-items-center tw-justify-end tw-gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className={`tw-rounded-[10px] tw-py-[10px] tw-px-[14px] tw-border tw-border-slate-200 tw-text-slate-700 hover:tw-bg-slate-50 tw-transition ${
              busy ? "tw-opacity-60 tw-cursor-not-allowed" : ""
            }`}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
