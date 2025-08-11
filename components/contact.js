import { useForm } from "react-hook-form";
import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Helmet } from "react-helmet";
import InputMask from "react-input-mask";

export default function Contact({ budgetMessage }) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const phoneWatcher = watch("phone");
  const [loading, setLoading] = useState("ENVIAR");
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

  const onSubmit = async ({ name, email, phone, message, estado, cidade, company }) => {
    const body = `
      <h3>Novo contato via site GGL Móveis</h3>
      <p><strong>Nome:</strong> ${name}</p>  
      <p><strong>Email:</strong> ${email}</p>  
      <p><strong>Telefone:</strong> ${phone}</p>
      <p>Empresa/Órgão Público: ${company || "Não informado"}</p>  
      <p><strong>Estado:</strong> ${estado}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
      <p><strong>Mensagem:</strong> ${message}</p>
    `;

    try {
      setLoading("Enviando...");
      const res = await axios.post("/api/mail", { body });
      toast.success("Mensagem enviada!");
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Houve um erro, por favor tente novamente mais tarde!");
    } finally {
      setLoading("ENVIAR");
    }
  };

  const clickButton = () => {
    window.gtag('config', 'AW-16882485681');
    window.gtag('event', 'conversion', {
      'send_to': 'AW-16882485681/MSWBCND8xKEaELGTmfI-'
    });
  };

  return (
    <>
      <Helmet>
        <script
          dangerouslySetInnerHTML={{
            __html: `function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-16570872797/lXFKCOfqxsAZEN3nzd09',
                  'value': 1.0,
                  'currency': 'BRL',
                  'event_callback': callback
              });
              return false;
            }`
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

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label>Nome:</label>
          <input
            type="text"
            {...register("name", { required: true })}
            autoComplete="name"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.name && <span className="tw-text-red">*Campo obrigatório</span>}
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="">Telefone:</label>
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
                type="tel"
                className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
                autoComplete="tel"
                inputMode="tel"
              />
            )}
          </InputMask>
          {errors.phone && (
            <span className="tw-text-red">*Campo obrigatório</span>
          )}
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label>E-mail:</label>
          <input
            type="email"
            {...register("email", { required: true })}
            autoComplete="email"
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.email && <span className="tw-text-red">*Campo obrigatório</span>}
        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="">Empresa / Órgão público (opcional)</label>
          <input
            type="text"
            name="company"
            {...register("company")}
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
        </div>


        <div className="tw-flex tw-gap-[20px] tw-w-full tw-max-w-[600px] tw-mb-[20px]">

          <div className="tw-flex tw-flex-col tw-w-1/2">
            <label>Estado:</label>
            <select
              {...register("estado", { required: true })}
              className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
            >
              <option value="">Selecione o estado</option>
              {estados.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>{estado.nome}</option>
              ))}
            </select>
            {errors.estado && <span className="tw-text-red">*Campo obrigatório</span>}
          </div>

          <div className="tw-flex tw-flex-col tw-w-1/2">
            <label>Cidade:</label>
            <select
              {...register("cidade", { required: true })}
              className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
              disabled={cidades.length === 0}
            >
              <option value="">Selecione a cidade</option>
              {cidades.map((cidade) => (
                <option key={cidade} value={cidade}>{cidade}</option>
              ))}
            </select>
            {errors.cidade && <span className="tw-text-red">*Campo obrigatório</span>}
          </div>

        </div>

        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label>Mensagem:</label>
          <textarea
            defaultValue={budgetMessage || ""}
            {...register("message", { required: true })}
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.message && <span className="tw-text-red">*Campo obrigatório</span>}
        </div>

        <button
          onClick={clickButton}
          type="submit"
          className="tw-bg-blue tw-text-white tw-w-[240px] tw-h-[50px] hover:tw-bg-white hover:tw-border-blue hover:tw-border-[1px] hover:tw-text-blue tw-transition-300"
        >
          {loading}
        </button>
      </form>
    </>
  );
}
