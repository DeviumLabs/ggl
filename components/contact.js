import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InputMask from "react-input-mask";
import { Helmet } from "react-helmet";

export default function Contact({ budgetMessage }) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const phoneWatcher = watch("phone");
  const [loading, setLoading] = useState("ENVIAR");
  const [isSending, setIsSending] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

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

  const onSubmit = async ({
    name,
    email,
    phone,
    message,
    estado,
    cidade,
    company,
    website,
    gclid,
    gbraid,
    wbraid,
  }) => {
    if (website) {
      reset();
      return;
    }
    if (isSending) return;

    const body = `
      <h3>Novo contato via site GGL Móveis</h3>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${phone}</p>
      <p><strong>Empresa/Órgão Público:</strong> ${company || "Não informado"}</p>
      <p><strong>Estado:</strong> ${estado}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
      <p><strong>Mensagem:</strong> ${message}</p>
      <hr/>
      <p><em>(códigos do anúncio)</em></p>
      <p>gclid: ${gclid || "-"}</p>
      <p>gbraid: ${gbraid || "-"}</p>
      <p>wbraid: ${wbraid || "-"}</p>
    `;

    try {
      setIsSending(true);
      setLoading("Enviando...");
      await axios.post("/api/mail", { body });
      toast.success("Mensagem enviada!");
      reset();

      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-16882485681/MSWBCND8xKEaELGTmfI-",
        });
      }
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
      <Helmet>
        <title>Entre em contato | GGL Móveis</title>
        <meta
          name="description"
          content="Fale com a GGL Móveis de Aço. Tire dúvidas e solicite orçamento."
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                if (window.gtag) {
                  gtag('event', 'conversion', {
                    'send_to': 'AW-16882485681/MSWBCND8xKEaELGTmfI-',
                    'value': 1.0,
                    'currency': 'BRL',
                    'event_callback': callback
                  });
                }
                return false;
              }
            `,
          }}
        />
      </Helmet>

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

        {/* Honeypot (anti-spam) */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-10000px", opacity: 0 }}
        >
          <label htmlFor="website">Website</label>
          <input id="website" type="text" autoComplete="off" {...register("website")} />
        </div>

        {/* Nome */}
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            {...register("name", { required: true })}
            autoComplete="name"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.name && <span className="tw-text-red">*Campo obrigatório</span>}
        </div>

        {/* Telefone */}
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="phone">Telefone:</label>
          <InputMask
            mask={
              phoneWatcher && phoneWatcher.replace(/\D/g, "").length > 10
                ? "(99) 99999-9999"
                : "(99) 9999-99999"
            }
            maskChar={null}
            {...register("phone", { required: true })}
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
          {errors.phone && <span className="tw-text-red">*Campo obrigatório</span>}
        </div>

        {/* Email */}
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            autoComplete="email"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.email && <span className="tw-text-red">*Campo obrigatório</span>}
        </div>

        {/* Empresa (opcional) */}
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="company">Empresa / Órgão público (opcional):</label>
          <input
            id="company"
            type="text"
            {...register("company")}
            autoComplete="organization"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
        </div>

        {/* Estado/Cidade */}
        <div className="tw-flex tw-gap-[20px] tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <div className="tw-flex tw-flex-col tw-w-1/2">
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              {...register("estado", { required: true })}
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
            {errors.estado && <span className="tw-text-red">*Campo obrigatório</span>}
          </div>

          <div className="tw-flex tw-flex-col tw-w-1/2">
            <label htmlFor="cidade">Cidade:</label>
            <select
              id="cidade"
              {...register("cidade", { required: true })}
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
            {errors.cidade && <span className="tw-text-red">*Campo obrigatório</span>}
          </div>
        </div>

        {/* Mensagem */}
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="message">Mensagem:</label>
          <textarea
            id="message"
            defaultValue={budgetMessage || ""}
            {...register("message", { required: true })}
            autoComplete="off"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.message && <span className="tw-text-red">*Campo obrigatório</span>}
        </div>

        {/* Hidden: gclid/gbraid/wbraid */}
        <input type="hidden" {...register("gclid")} />
        <input type="hidden" {...register("gbraid")} />
        <input type="hidden" {...register("wbraid")} />

        <button
          type="submit"
          disabled={isSending}
          aria-busy={isSending}
          className={`tw-bg-blue tw-text-white tw-w-[240px] tw-h-[50px] hover:tw-bg-white hover:tw-border-blue hover:tw-border-[1px] hover:tw-text-blue tw-transition-300 ${
            isSending ? "tw-opacity-60 tw-cursor-not-allowed" : ""
          }`}
        >
          {loading}
        </button>
      </form>
    </>
  );
}
