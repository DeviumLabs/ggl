import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InputMask from "react-input-mask";
import Head from "next/head";

export default function Contact({ budgetMessage }) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo_pessoa: "pf",  
      razao_social: "",
    },
  });

  const phoneWatcher = watch("phone");
  const tipoPessoa = watch("tipo_pessoa");
  const exigeRazao = tipoPessoa === "empresa" || tipoPessoa === "orgao_publico";

  const [loading, setLoading] = useState("ENVIAR");
  const [isSending, setIsSending] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  const norm = (s) => (s || "").toString().trim().toLowerCase();
  const onlyDigits = (s) => (s || "").toString().replace(/\D/g, "");
  const withDDI55 = (digits) => (!digits ? "" : digits.startsWith("55") ? digits : `55${digits}`);
  const splitName = (full = "") => {
    const parts = full.trim().split(/\s+/);
    if (!parts[0]) return { first_name: "", last_name: "" };
    return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
  };

  const formStartedRef = useRef(false);
  const progressSentRef = useRef(false);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch("/data/estados-cidades.json");
        const data = await res.json();
        setEstados(data.estados);
      } catch (error) {
        console.error("Erro ao carregar estados e cidades:", error);
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
  }, [setValue]);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_contact_form",
      form_id: "contact_form",
    });
  }, []);

  const checkFormProgress = () => {
    const filled = [watch("name"), watch("phone"), watch("email"), watch("estado"), watch("cidade")]
      .filter(Boolean).length;
    if (!progressSentRef.current && filled >= 3) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_progress",
        form_id: "contact_form",
        progress: "50%",
      });
      progressSentRef.current = true;
    }
  };

  const handleFieldChange = () => {
    if (!formStartedRef.current) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "start_form",
        form_id: "contact_form",
      });
      formStartedRef.current = true;
    }
    checkFormProgress();
  };

  const onSubmit = async ({
    name,
    email,
    phone,
    message,
    estado,
    cidade,
    tipo_pessoa,
    razao_social,
    website,
    gclid,
    gbraid,
    wbraid,
  }) => {
    if (website) {
      reset({ tipo_pessoa: "pf", razao_social: "" });
      return;
    }
    if (isSending) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "form_submit",
      form_id: "contact_form",
    });

    const company = exigeRazao ? (razao_social || "") : "";

    try {
      setIsSending(true);
      setLoading("Enviando...");

      await axios.post("/api/mail", {
        replyTo: email,
        name,
        email,
        phone,
        tipo_pessoa,
        razao_social: company, 
        estado,
        cidade,
        message: message || "",
        gclid: gclid || "",
        gbraid: gbraid || "",
        wbraid: wbraid || "",
      });

      toast.success("Mensagem enviada!");
      reset({ tipo_pessoa: "pf", razao_social: "" });

      const { first_name, last_name } = splitName(name);
      const cleanedCompany = (company || "").toString().trim();
      const cleanedCity = norm(cidade);
      const cleanedRegion = (estado || "").toString().trim().toUpperCase();
      const cleanedEmail = norm(email);
      const cleanedPhone = withDDI55(onlyDigits(phone));

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_submit_success",
        form_id: "contact_form",
        company: cleanedCompany,
        city: cleanedCity,
        state: cleanedRegion,
        lead_type: tipo_pessoa,
      });

      window.dataLayer.push({
        event: "generate_lead",
        value: 1.0,
        currency: "BRL",
        company: cleanedCompany,
        city: cleanedCity,
        state: cleanedRegion,
        lead_type: tipo_pessoa,
        user_data: {
          email: cleanedEmail,
          phone_number: cleanedPhone,
          first_name: norm(first_name),
          last_name: norm(last_name),
          city: cleanedCity,
          region: cleanedRegion,
          country: "BR",
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Houve um erro, por favor tente novamente mais tarde!");
    } finally {
      setIsSending(false);
      setLoading("ENVIAR");
    }
  };

  return (
    <>
      <Head>
        <title>Entre em contato | GGL Móveis</title>
        <meta
          name="description"
          content="Fale com a GGL Móveis de Aço. Tire dúvidas e solicite orçamento."
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </Head>

      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="tw-px-[20px] tw-mb-[100px] tw-pt-[200px] tw-mt-[-200px] tw-flex tw-flex-col tw-items-center"
        id="contato"
      >
        <div className="tw-mb-[30px]">
          <small className="tw-text-blue tw-font-light">CONTATO</small>
          <h1 className="tw-text-[30px] tw-leading-[30px]">Entre em contato</h1>
        </div>

        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", opacity: 0 }}>
          <label htmlFor="website">Website</label>
          <input id="website" type="text" autoComplete="off" {...register("website")} />
        </div>

        <fieldset className="tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <legend className="tw-mb-[8px]">Você é:</legend>
          <div className="tw-flex tw-gap-[20px]">
            <label className="tw-flex tw-items-center tw-gap-[6px]">
              <input
                type="radio"
                value="pf"
                {...register("tipo_pessoa", { onChange: handleFieldChange })}
              />
              Pessoa Física
            </label>
            <label className="tw-flex tw-items-center tw-gap-[6px]">
              <input
                type="radio"
                value="empresa"
                {...register("tipo_pessoa", { onChange: handleFieldChange })}
              />
              Empresa
            </label>
            <label className="tw-flex tw-items-center tw-gap-[6px]">
              <input
                type="radio"
                value="orgao_publico"
                {...register("tipo_pessoa", { onChange: handleFieldChange })}
              />
              Órgão Público
            </label>
          </div>
        </fieldset>

        {exigeRazao && (
          <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
            <label htmlFor="razao_social">Razão social:</label>
            <input
              id="razao_social"
              type="text"
              {...register("razao_social", {
                required: true,
                onChange: handleFieldChange,
              })}
              autoComplete="organization"
              className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
            />
            {errors.razao_social && <span className="tw-text-red-600">*Campo obrigatório</span>}
          </div>
        )}

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            {...register("name", { required: true, onChange: handleFieldChange })}
            autoComplete="name"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.name && <span className="tw-text-red-600">*Campo obrigatório</span>}
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="phone">Telefone:</label>
          <InputMask
            mask={
              phoneWatcher && phoneWatcher.replace(/\D/g, "").length > 10
                ? "(99) 99999-9999"
                : "(99) 9999-99999"
            }
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
          {errors.phone && <span className="tw-text-red-600">*Campo obrigatório</span>}
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
          {errors.email && <span className="tw-text-red-600">*Campo obrigatório</span>}
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
            {errors.estado && <span className="tw-text-red-600">*Campo obrigatório</span>}
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
            {errors.cidade && <span className="tw-text-red-600">*Campo obrigatório</span>}
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="message">Mensagem:</label>
          <textarea
            id="message"
            defaultValue={budgetMessage || ""}
            {...register("message", { required: true, onChange: handleFieldChange })}
            autoComplete="off"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.message && <span className="tw-text-red-600">*Campo obrigatório</span>}
        </div>

        <input type="hidden" {...register("gclid")} />
        <input type="hidden" {...register("gbraid")} />
        <input type="hidden" {...register("wbraid")} />

        <button
          type="submit"
          disabled={isSending}
          aria-busy={isSending}
          className={`tw-bg-blue tw-text-white tw-w-[240px] tw-h-[50px] hover:tw-bg-white hover:tw-border-blue hover:tw-border-[1px] hover:tw-text-blue tw-transition tw-duration-300 ${isSending ? "tw-opacity-60 tw-cursor-not-allowed" : ""}`}
        >
          {loading}
        </button>
      </form>
    </>
  );
}