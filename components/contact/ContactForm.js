import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import InputMask from "react-input-mask";
import { dlPush } from "../../lib/analytics/dataLayer";
import ContactChannelModal from "./ContactChannelModal";

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
    handleSubmit,
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

  const whatsappRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappNumber = useMemo(() => {
    const digits = onlyDigits(whatsappRaw);
    if (!digits) return "";
    return digits.startsWith("55") ? digits : `55${digits}`;
  }, [whatsappRaw]);
  const whatsappAvailable = Boolean(whatsappNumber);

  const formStartedRef = useRef(false);
  const progressSentRef = useRef(false);

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
    dlPush("view_contact_form", { form_id: "contact_form" });
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
      dlPush("form_progress", { form_id: "contact_form", progress: "50%" });
      progressSentRef.current = true;
    }
  };

  const handleFieldChange = () => {
    if (!formStartedRef.current) {
      dlPush("start_form", { form_id: "contact_form" });
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
    dlPush("contact_channel_modal_open", {
      form_id: "contact_form",
      source_url: payload.source_url || ""
    });
  };

  const sendEmail = async () => {
    if (!pendingPayload || isSending) return;
    try {
      setIsSending(true);

      dlPush("contact_channel_select", {
        form_id: "contact_form",
        channel: "email",
        lead_type: pendingPayload.tipo_pessoa,
        state: (pendingPayload.estado || "").toString().trim().toUpperCase(),
        city: norm(pendingPayload.cidade || ""),
        source_url: pendingPayload.source_url || ""
      });

      dlPush("form_submit", { form_id: "contact_form", channel: "email" });

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

      dlPush("form_submit_success", {
        form_id: "contact_form",
        channel: "email",
        company: cleanedCompany,
        city: cleanedCity,
        state: cleanedRegion,
        lead_type: pendingPayload.tipo_pessoa,
        source_url: pendingPayload.source_url || ""
      });

      dlPush("generate_lead", {
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

      toast.success("Mensagem enviada! Retornaremos por e-mail em breve.");
      setModalOpen(false);
      setPendingPayload(null);
      reset({ tipo_pessoa: "pf", razao_social: "", message: "", source_url: getValues("source_url") || "" });
    } catch {
      dlPush("form_submit_error", { form_id: "contact_form", channel: "email" });
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

    dlPush("contact_channel_select", {
      form_id: "contact_form",
      channel: "whatsapp",
      lead_type: pendingPayload.tipo_pessoa,
      state: (pendingPayload.estado || "").toString().trim().toUpperCase(),
      city: norm(pendingPayload.cidade || ""),
      source_url: pendingPayload.source_url || ""
    });

    dlPush("form_submit", { form_id: "contact_form", channel: "whatsapp" });

    const win = typeof window !== "undefined" ? window.open(href, "_blank", "noopener,noreferrer") : null;
    if (!win && typeof window !== "undefined") window.location.href = href;

    toast.success("Abrindo WhatsApp com sua mensagem pronta. Retornaremos por lá em breve.");
    setModalOpen(false);
    setPendingPayload(null);
  };

  return (
    <>
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
        className="tw-px-[20px] tw-mb-[100px] tw-pt-[200px] tw-mt-[-200px] tw-flex tw-flex-col tw-items-center"
        id="contato"
      >
        <div className="tw-mb-[30px]">
          <small className="tw-text-blue tw-font-light">CONTATO</small>
          <h2 className="tw-text-[30px] tw-leading-[30px]">Entre em contato</h2>
          <p className="tw-mt-[6px] tw-text-[14px] tw-text-slate-600 tw-text-center">
            Ao continuar, você poderá escolher entre WhatsApp ou e-mail.
          </p>
        </div>

        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", opacity: 0 }}>
          <label htmlFor="website">Website</label>
          <input id="website" type="text" autoComplete="off" {...register("website")} />
        </div>

        <fieldset className="tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <legend className="tw-mb-[8px]">Você é:</legend>
          <div className="tw-flex tw-gap-[20px]">
            <label className="tw-flex tw-items-center tw-gap-[6px]">
              <input type="radio" value="pf" {...register("tipo_pessoa", { onChange: handleFieldChange })} />
              Pessoa Física
            </label>
            <label className="tw-flex tw-items-center tw-gap-[6px]">
              <input type="radio" value="empresa" {...register("tipo_pessoa", { onChange: handleFieldChange })} />
              Empresa
            </label>
            <label className="tw-flex tw-items-center tw-gap-[6px]">
              <input type="radio" value="orgao_publico" {...register("tipo_pessoa", { onChange: handleFieldChange })} />
              Órgão Público
            </label>
          </div>
        </fieldset>

        {exigeRazao ? (
          <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
            <label htmlFor="razao_social">Razão social:</label>
            <input
              id="razao_social"
              type="text"
              {...register("razao_social", { required: true, onChange: handleFieldChange })}
              autoComplete="organization"
              className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
            />
            {errors.razao_social ? <span className="tw-text-red-600">*Campo obrigatório</span> : null}
          </div>
        ) : null}

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            {...register("name", { required: true, onChange: handleFieldChange })}
            autoComplete="name"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.name ? <span className="tw-text-red-600">*Campo obrigatório</span> : null}
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="phone">Telefone:</label>
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
                className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
              />
            )}
          </InputMask>
          {errors.phone ? <span className="tw-text-red-600">*Campo obrigatório</span> : null}
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true, onChange: handleFieldChange })}
            autoComplete="email"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.email ? <span className="tw-text-red-600">*Campo obrigatório</span> : null}
        </div>

        <div className="tw-flex tw-gap-[20px] tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <div className="tw-flex tw-flex-col tw-w-1/2">
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              {...register("estado", { required: true, onChange: handleFieldChange })}
              autoComplete="address-level1"
              className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
            >
              <option value="">Selecione o estado</option>
              {estados.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.nome}
                </option>
              ))}
            </select>
            {errors.estado ? <span className="tw-text-red-600">*Campo obrigatório</span> : null}
          </div>

          <div className="tw-flex tw-flex-col tw-w-1/2">
            <label htmlFor="cidade">Cidade:</label>
            <select
              id="cidade"
              {...register("cidade", { required: true, onChange: handleFieldChange })}
              autoComplete="address-level2"
              className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
              disabled={cidades.length === 0}
            >
              <option value="">Selecione a cidade</option>
              {cidades.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>
            {errors.cidade ? <span className="tw-text-red-600">*Campo obrigatório</span> : null}
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="message">Mensagem:</label>
          <textarea
            id="message"
            {...register("message", { required: true, onChange: handleFieldChange })}
            autoComplete="off"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.message ? <span className="tw-text-red-600">*Campo obrigatório</span> : null}
        </div>

        <input type="hidden" {...register("gclid")} />
        <input type="hidden" {...register("gbraid")} />
        <input type="hidden" {...register("wbraid")} />
        <input type="hidden" {...register("source_url")} />

        <button
          type="submit"
          disabled={isSending}
          aria-busy={isSending}
          className={`tw-bg-blue tw-text-white tw-w-[240px] tw-h-[50px] hover:tw-bg-white hover:tw-border-blue hover:tw-border-[1px] hover:tw-text-blue tw-transition tw-duration-300 ${
            isSending ? "tw-opacity-60 tw-cursor-not-allowed" : ""
          }`}
        >
          CONTINUAR
        </button>
      </form>
    </>
  );
}
