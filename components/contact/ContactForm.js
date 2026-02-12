import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import InputMask from "react-input-mask";
import ContactChannelModal from "./ContactChannelModal";
import {
  trackContactChannelModalOpen,
  trackContactChannelSelect,
  trackContactFormProgress,
  trackContactFormStart,
  trackContactFormSubmit,
  trackContactFormSubmitError,
  trackContactFormSubmitSuccess,
  trackContactFormView,
  trackGenerateLead
} from "../../lib/analytics/events";

const norm = (s) => (s || "").toString().trim().toLowerCase();
const onlyDigits = (s) => (s || "").toString().replace(/\D/g, "");
const withDDI55 = (digits) => (!digits ? "" : digits.startsWith("55") ? digits : `55${digits}`);
const splitName = (full = "") => {
  const parts = full.trim().split(/\s+/);
  if (!parts[0]) return { first_name: "", last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
};
const tipoLabel = (t) => (t === "empresa" ? "Empresa" : t === "orgao_publico" ? "Órgão Público" : "Pessoa Física");

export default function ContactForm({ budgetMessage }) {
  const {
    register,
    watch,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tipo_pessoa: "pf",
      razao_social: "",
      message: "",
      source_url: ""
    }
  });

  const phoneWatcher = watch("phone");
  const tipoPessoa = watch("tipo_pessoa");
  const exigeRazao = tipoPessoa === "empresa" || tipoPessoa === "orgao_publico";

  const [isSending, setIsSending] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    title: "",
    description: "",
    email: ""
  });

  const whatsappRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappNumber = useMemo(() => {
    const digits = onlyDigits(whatsappRaw);
    if (!digits) return "";
    return digits.startsWith("55") ? digits : `55${digits}`;
  }, [whatsappRaw]);
  const whatsappAvailable = Boolean(whatsappNumber);

  const formStartedRef = useRef(false);
  const progressSentRef = useRef(false);
  const feedbackPrimaryBtnRef = useRef(null);
  const feedbackPrevFocusRef = useRef(null);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch("/data/estados-cidades.json");
        const data = await res.json();
        setEstados(data.estados || []);
      } catch {
        setEstados([]);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (!feedbackModal.open) return;
    feedbackPrevFocusRef.current = typeof document !== "undefined" ? document.activeElement : null;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setFeedbackModal((prev) => ({ ...prev, open: false }));
      }
    };

    document.addEventListener("keydown", onKeyDown);
    setTimeout(() => {
      if (feedbackPrimaryBtnRef.current) feedbackPrimaryBtnRef.current.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (feedbackPrevFocusRef.current && typeof feedbackPrevFocusRef.current.focus === "function") {
        feedbackPrevFocusRef.current.focus();
      }
    };
  }, [feedbackModal.open]);

  const estadoSelecionado = watch("estado");
  useEffect(() => {
    const estado = estados.find((e) => e.sigla === estadoSelecionado);
    setCidades(estado ? estado.cidades : []);
  }, [estadoSelecionado, estados]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const gclid = params.get("gclid");
    const gbraid = params.get("gbraid");
    const wbraid = params.get("wbraid");

    const setBest = (key, urlVal) => {
      if (urlVal) {
        localStorage.setItem(key, urlVal);
        return urlVal;
      }
      return localStorage.getItem(key) || "";
    };

    setValue("gclid", setBest("gclid", gclid));
    setValue("gbraid", setBest("gbraid", gbraid));
    setValue("wbraid", setBest("wbraid", wbraid));
    setValue("source_url", window.location.href);
  }, [setValue]);

  useEffect(() => {
    trackContactFormView({ form_id: "contact_form" });
  }, []);

  useEffect(() => {
    const current = (watch("message") || "").trim();
    const incoming = (budgetMessage || "").trim();
    if (!incoming) return;
    if (!current) setValue("message", incoming, { shouldDirty: true });
  }, [budgetMessage, setValue, watch]);

  const checkFormProgress = () => {
    const filled = [watch("name"), watch("phone"), watch("email"), watch("estado"), watch("cidade")].filter(Boolean).length;
    if (!progressSentRef.current && filled >= 3) {
      trackContactFormProgress({ form_id: "contact_form", progress: "50%" });
      progressSentRef.current = true;
    }
  };

  const handleFieldChange = () => {
    if (!formStartedRef.current) {
      trackContactFormStart({ form_id: "contact_form" });
      formStartedRef.current = true;
    }
    checkFormProgress();
  };

  const buildPayloadFromValues = (vals) => {
    const company = exigeRazao ? (vals.razao_social || "") : "";
    return {
      replyTo: vals.email,
      name: vals.name,
      email: vals.email,
      phone: vals.phone,
      tipo_pessoa: vals.tipo_pessoa,
      razao_social: company,
      estado: vals.estado,
      cidade: vals.cidade,
      message: vals.message || "",
      gclid: vals.gclid || "",
      gbraid: vals.gbraid || "",
      wbraid: vals.wbraid || "",
      source_url: vals.source_url || ""
    };
  };

  const openFeedbackModal = (title, description, email = "") => {
    setFeedbackModal({ open: true, title, description, email });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, open: false }));
  };

  const openChoiceModal = async () => {
    const ok = await trigger();
    if (!ok) {
      toast.error("Confira os campos obrigatórios antes de continuar.");
      return;
    }

    const vals = getValues();
    if (vals.website) {
      reset({ tipo_pessoa: "pf", razao_social: "", message: "", source_url: vals.source_url || "" });
      return;
    }

    const payload = buildPayloadFromValues(vals);
    setPendingPayload(payload);
    setModalOpen(true);
    trackContactChannelModalOpen({
      form_id: "contact_form",
      source_url: payload.source_url || ""
    });
  };

  const sendEmail = async () => {
    if (!pendingPayload || isSending) return;
    try {
      setIsSending(true);

      trackContactChannelSelect({
        form_id: "contact_form",
        channel: "email",
        lead_type: pendingPayload.tipo_pessoa,
        state: (pendingPayload.estado || "").toString().trim().toUpperCase(),
        city: norm(pendingPayload.cidade || ""),
        source_url: pendingPayload.source_url || ""
      });

      trackContactFormSubmit({ form_id: "contact_form", channel: "email" });

      await axios.post("/api/mail", {
        ...pendingPayload,
        channel: "email"
      });

      const { first_name, last_name } = splitName(pendingPayload.name);
      const cleanedCompany = (pendingPayload.razao_social || "").toString().trim();
      const cleanedCity = norm(pendingPayload.cidade);
      const cleanedRegion = (pendingPayload.estado || "").toString().trim().toUpperCase();
      const cleanedEmail = norm(pendingPayload.email);
      const cleanedPhone = withDDI55(onlyDigits(pendingPayload.phone));

      trackContactFormSubmitSuccess({
        form_id: "contact_form",
        channel: "email",
        company: cleanedCompany,
        city: cleanedCity,
        state: cleanedRegion,
        lead_type: pendingPayload.tipo_pessoa,
        source_url: pendingPayload.source_url || ""
      });

      trackGenerateLead({
        value: 1.0,
        currency: "BRL",
        company: cleanedCompany,
        city: cleanedCity,
        state: cleanedRegion,
        lead_type: pendingPayload.tipo_pessoa,
        user_data: {
          email: cleanedEmail,
          phone_number: cleanedPhone,
          first_name: norm(first_name),
          last_name: norm(last_name),
          city: cleanedCity,
          region: cleanedRegion,
          country: "BR"
        }
      });

      const replyEmail = (pendingPayload.email || "").toString().trim();
      openFeedbackModal(
        "Mensagem enviada com sucesso",
        "Recebemos sua solicitação. Nossa equipe responderá em breve.",
        replyEmail
      );
      setModalOpen(false);
      setPendingPayload(null);
      reset({ tipo_pessoa: "pf", razao_social: "", message: "", source_url: getValues("source_url") || "" });
    } catch {
      trackContactFormSubmitError({ form_id: "contact_form", channel: "email" });
      toast.error("Houve um erro ao enviar. Tente novamente mais tarde.");
    } finally {
      setIsSending(false);
    }
  };

  const sendWhatsapp = () => {
    if (!pendingPayload) return;
    if (!whatsappAvailable) {
      toast.error("WhatsApp indisponível no momento.");
      return;
    }

    const companyFinal = (pendingPayload.razao_social || "").toString().trim();
    const place = [pendingPayload.cidade, pendingPayload.estado].filter(Boolean).join(" - ").trim();

    const lines = [
      "Olá! Gostaria de falar com a GGL Móveis de Aço.",
      "",
      `Nome: ${pendingPayload.name}`,
      `Tipo: ${tipoLabel(pendingPayload.tipo_pessoa)}`,
      companyFinal ? `Razão social: ${companyFinal}` : null,
      `Telefone: ${pendingPayload.phone}`,
      `E-mail: ${pendingPayload.email}`,
      place ? `Local: ${place}` : null,
      "",
      "Mensagem:",
      pendingPayload.message || "-",
      "",
      pendingPayload.source_url ? `Enviado pelo site: ${pendingPayload.source_url}` : null
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const href = `https://wa.me/${whatsappNumber}?text=${text}`;

    trackContactChannelSelect({
      form_id: "contact_form",
      channel: "whatsapp",
      lead_type: pendingPayload.tipo_pessoa,
      state: (pendingPayload.estado || "").toString().trim().toUpperCase(),
      city: norm(pendingPayload.cidade || ""),
      source_url: pendingPayload.source_url || ""
    });

    trackContactFormSubmit({ form_id: "contact_form", channel: "whatsapp" });

    const win = typeof window !== "undefined" ? window.open(href, "_blank", "noopener,noreferrer") : null;
    if (!win && typeof window !== "undefined") window.location.href = href;

    openFeedbackModal("WhatsApp preparado", "Abrimos o WhatsApp com sua mensagem pronta. Envie e retornaremos por lá em breve.");
    setModalOpen(false);
    setPendingPayload(null);
  };

  const fieldWrapClass = "tw-flex tw-flex-col tw-w-full tw-mb-[16px]";
  const fieldLabelClass = "tw-mb-[6px] tw-text-[14px] tw-font-medium tw-text-darkBlue";
  const fieldInputClass =
    "tw-w-full tw-rounded-[14px] tw-border tw-border-slate-300 tw-bg-white tw-py-[12px] tw-px-[14px] tw-text-[15px] tw-outline-none tw-transition focus:tw-border-blue focus:tw-ring-2 focus:tw-ring-blue/20";
  const fieldErrorClass = "tw-mt-[6px] tw-text-[13px] tw-text-red-600";

  return (
    <>
      {feedbackModal.open ? (
        <div
          className="tw-fixed tw-inset-0 tw-z-[10000] tw-flex tw-items-center tw-justify-center tw-px-[16px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="contact-feedback-title"
          aria-describedby="contact-feedback-desc"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeFeedbackModal();
          }}
        >
          <div className="tw-absolute tw-inset-0 tw-bg-slate-900/55" />

          <div className="tw-relative tw-w-full tw-max-w-[500px] tw-rounded-[24px] tw-border tw-border-slate-200 tw-bg-white tw-p-[20px] md:tw-p-[24px] tw-shadow-[0_28px_55px_-30px_rgba(15,23,42,0.75)]">
            <div className="tw-flex tw-items-start tw-justify-between tw-gap-[14px]">
              <div className="tw-flex tw-items-start tw-gap-[10px]">
                <span
                  aria-hidden="true"
                  className="tw-inline-flex tw-items-center tw-justify-center tw-h-[30px] tw-w-[30px] tw-rounded-full tw-bg-blue/10 tw-text-blue tw-font-semibold"
                >
                  ✓
                </span>
                <div>
                  <h3 id="contact-feedback-title" className="tw-text-[20px] tw-leading-[1.2] tw-font-semibold tw-text-darkBlue">
                    {feedbackModal.title}
                  </h3>
                  <p id="contact-feedback-desc" className="tw-mt-[8px] tw-text-[15px] tw-leading-[1.45] tw-text-slate-600">
                    {feedbackModal.description}
                  </p>
                  {feedbackModal.email ? (
                    <div className="tw-mt-[12px] tw-rounded-[12px] tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-[12px] tw-py-[10px]">
                      <p className="tw-text-[12px] tw-font-medium tw-text-slate-500">Responderemos no e-mail:</p>
                      <p className="tw-text-[14px] tw-font-semibold tw-text-darkBlue tw-break-all">{feedbackModal.email}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={closeFeedbackModal}
                className="tw-inline-flex tw-h-[34px] tw-w-[34px] tw-items-center tw-justify-center tw-rounded-[10px] tw-bg-slate-100 tw-text-slate-600 tw-transition hover:tw-bg-slate-200"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="tw-mt-[20px] tw-flex tw-items-center tw-justify-end tw-gap-[10px]">
              <button
                type="button"
                onClick={closeFeedbackModal}
                className="tw-rounded-[12px] tw-border tw-border-slate-200 tw-bg-white tw-px-[14px] tw-py-[9px] tw-text-[14px] tw-font-medium tw-text-slate-700 tw-transition hover:tw-bg-slate-50"
              >
                Fechar
              </button>
              <button
                ref={feedbackPrimaryBtnRef}
                type="button"
                onClick={closeFeedbackModal}
                className="tw-rounded-[12px] tw-bg-blue tw-px-[16px] tw-py-[9px] tw-text-[14px] tw-font-semibold tw-text-white tw-transition hover:tw-bg-darkBlue"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ContactChannelModal
        open={modalOpen}
        onClose={() => {
          if (isSending) return;
          setModalOpen(false);
        }}
        onChooseEmail={sendEmail}
        onChooseWhatsapp={sendWhatsapp}
        whatsappAvailable={whatsappAvailable}
        busy={isSending}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isSending) return;
          openChoiceModal();
        }}
        className="tw-px-[16px] tw-scroll-mt-[130px] tw-pb-[18px]"
        id="contato"
      >
        <div className="tw-mx-auto tw-w-full tw-max-w-[720px] tw-rounded-[26px] tw-border tw-border-slate-200 tw-bg-gradient-to-b tw-from-white tw-to-slate-50 tw-px-[18px] tw-py-[22px] md:tw-px-[34px] md:tw-py-[34px] tw-shadow-[0_20px_55px_-38px_rgba(15,23,42,0.55)]">
          <div className="tw-mb-[24px] tw-text-center">
            <small className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-blue/10 tw-text-blue tw-font-semibold tw-tracking-[0.08em] tw-px-[12px] tw-py-[5px]">
              CONTATO
            </small>
            <h2 className="tw-mt-[10px] tw-text-[30px] tw-leading-[32px] tw-text-darkBlue">Entre em contato</h2>
            <p className="tw-mt-[8px] tw-text-[14px] tw-text-slate-600">
              Ao continuar, você poderá escolher entre WhatsApp ou e-mail.
            </p>
          </div>

          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", opacity: 0 }}>
            <label htmlFor="website">Website</label>
            <input id="website" type="text" autoComplete="off" {...register("website")} />
          </div>

          <fieldset className="tw-w-full tw-mb-[18px]">
            <legend className={`${fieldLabelClass} tw-text-[15px]`}>Você é:</legend>
            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-[10px]">
              <label
                className={[
                  "tw-flex tw-items-center tw-gap-[8px] tw-rounded-[14px] tw-border tw-bg-white tw-px-[12px] tw-py-[10px] tw-cursor-pointer tw-transition",
                  tipoPessoa === "pf" ? "tw-border-blue tw-bg-blue/5" : "tw-border-slate-300 hover:tw-border-blue/60"
                ].join(" ")}
              >
                <input className="tw-accent-blue" type="radio" value="pf" {...register("tipo_pessoa", { onChange: handleFieldChange })} />
                <span className="tw-text-[14px] tw-text-slate-700">Pessoa Física</span>
              </label>
              <label
                className={[
                  "tw-flex tw-items-center tw-gap-[8px] tw-rounded-[14px] tw-border tw-bg-white tw-px-[12px] tw-py-[10px] tw-cursor-pointer tw-transition",
                  tipoPessoa === "empresa" ? "tw-border-blue tw-bg-blue/5" : "tw-border-slate-300 hover:tw-border-blue/60"
                ].join(" ")}
              >
                <input
                  className="tw-accent-blue"
                  type="radio"
                  value="empresa"
                  {...register("tipo_pessoa", { onChange: handleFieldChange })}
                />
                <span className="tw-text-[14px] tw-text-slate-700">Empresa</span>
              </label>
              <label
                className={[
                  "tw-flex tw-items-center tw-gap-[8px] tw-rounded-[14px] tw-border tw-bg-white tw-px-[12px] tw-py-[10px] tw-cursor-pointer tw-transition",
                  tipoPessoa === "orgao_publico" ? "tw-border-blue tw-bg-blue/5" : "tw-border-slate-300 hover:tw-border-blue/60"
                ].join(" ")}
              >
                <input
                  className="tw-accent-blue"
                  type="radio"
                  value="orgao_publico"
                  {...register("tipo_pessoa", { onChange: handleFieldChange })}
                />
                <span className="tw-text-[14px] tw-text-slate-700">Órgão Público</span>
              </label>
            </div>
          </fieldset>

          {exigeRazao ? (
            <div className={fieldWrapClass}>
              <label htmlFor="razao_social" className={fieldLabelClass}>
                Razão social:
              </label>
              <input
                id="razao_social"
                type="text"
                {...register("razao_social", { required: true, onChange: handleFieldChange })}
                autoComplete="organization"
                className={fieldInputClass}
              />
              {errors.razao_social ? <span className={fieldErrorClass}>*Campo obrigatório</span> : null}
            </div>
          ) : null}

          <div className={fieldWrapClass}>
            <label htmlFor="name" className={fieldLabelClass}>
              Nome:
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: true, onChange: handleFieldChange })}
              autoComplete="name"
              className={fieldInputClass}
            />
            {errors.name ? <span className={fieldErrorClass}>*Campo obrigatório</span> : null}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="phone" className={fieldLabelClass}>
              Telefone:
            </label>
            <InputMask
              mask={phoneWatcher && phoneWatcher.replace(/\D/g, "").length > 10 ? "(99) 99999-9999" : "(99) 9999-99999"}
              maskChar={null}
              {...register("phone", { required: true, onChange: handleFieldChange })}
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className={fieldInputClass}
                />
              )}
            </InputMask>
            {errors.phone ? <span className={fieldErrorClass}>*Campo obrigatório</span> : null}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="email" className={fieldLabelClass}>
              E-mail:
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: true, onChange: handleFieldChange })}
              autoComplete="email"
              className={fieldInputClass}
            />
            {errors.email ? <span className={fieldErrorClass}>*Campo obrigatório</span> : null}
          </div>

          <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-[14px] tw-w-full tw-mb-[16px]">
            <div className="tw-flex tw-flex-col tw-w-full md:tw-w-1/2">
              <label htmlFor="estado" className={fieldLabelClass}>
                Estado:
              </label>
              <select
                id="estado"
                {...register("estado", { required: true, onChange: handleFieldChange })}
                autoComplete="address-level1"
                className={fieldInputClass}
              >
                <option value="">Selecione o estado</option>
                {estados.map((estado) => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
              {errors.estado ? <span className={fieldErrorClass}>*Campo obrigatório</span> : null}
            </div>

            <div className="tw-flex tw-flex-col tw-w-full md:tw-w-1/2">
              <label htmlFor="cidade" className={fieldLabelClass}>
                Cidade:
              </label>
              <select
                id="cidade"
                {...register("cidade", { required: true, onChange: handleFieldChange })}
                autoComplete="address-level2"
                className={fieldInputClass}
                disabled={cidades.length === 0}
              >
                <option value="">Selecione a cidade</option>
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
              {errors.cidade ? <span className={fieldErrorClass}>*Campo obrigatório</span> : null}
            </div>
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="message" className={fieldLabelClass}>
              Mensagem:
            </label>
            <textarea
              id="message"
              {...register("message", { required: true, onChange: handleFieldChange })}
              autoComplete="off"
              className={`${fieldInputClass} tw-min-h-[124px] tw-resize-y`}
            />
            {errors.message ? <span className={fieldErrorClass}>*Campo obrigatório</span> : null}
          </div>

          <input type="hidden" {...register("gclid")} />
          <input type="hidden" {...register("gbraid")} />
          <input type="hidden" {...register("wbraid")} />
          <input type="hidden" {...register("source_url")} />

          <div className="tw-pt-[6px] tw-flex tw-justify-center md:tw-justify-start">
            <button
              type="submit"
              disabled={isSending}
              aria-busy={isSending}
              className={`tw-bg-blue tw-text-white tw-w-full md:tw-w-[260px] tw-h-[52px] tw-rounded-full tw-font-semibold tw-tracking-[0.03em] tw-shadow-[0_16px_24px_-18px_rgba(0,88,194,0.9)] tw-transition tw-duration-300 hover:tw-bg-darkBlue ${
                isSending ? "tw-opacity-60 tw-cursor-not-allowed" : ""
              }`}
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
