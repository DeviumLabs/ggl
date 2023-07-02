import { useForm } from "react-hook-form";
import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Contact() {
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

  //6LcUikYhAAAAAKnwsxZBGlB3ZrSpBkpJWHTH4eVf

  const onSubmit = async ({ name, email, phone, message }) => {
    const body = `
                                <h3>Novo contato via site GGL Móveis</h3>
                                <p>Nome: ${name}</p>  
                                <p>Email: ${email}</p>  
                                <p>Telefone: ${phone}</p>  
                                    
                                <p>Mensagem: ${message}</p>                   
                      `;

    try {
      setLoading("Enviando...");

      const res = await axios.post(
        "./api/mail",
        { body },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log(res.data);

      toast.success("Mensagem enviada!");
    } catch (e) {
      console.log(e);
      toast.error("Houve um erro, por favor tente novamente mais tarde!");
    } finally {
      setLoading("ENVIAR");
    }
  };

  return (
    <>
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
          <label htmlFor="">Nome:</label>
          <input
            type="text"
            name="name"
            {...register("name", { required: true })}
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.name && (
            <span className="tw-text-red">*Campo obrigatório</span>
          )}
        </div>
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="">Telefone:</label>
          <input
            type="tel"
            name="phone"
            mask={
              !!phoneWatcher && phoneWatcher.length <= 14
                ? "(99) 9999-9999?"
                : "(99) 99999-9999"
            }
            // formatchars={{ 9: "[0-9]", "?": "[0-9 ]" }}
            // maskchar={null}
            {...register("phone", { required: true })}
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.phone && (
            <span className="tw-text-red">*Campo obrigatório</span>
          )}
        </div>
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="">E-mail:</label>
          <input
            type="email"
            name="email"
            {...register("email", { required: true })}
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.email && (
            <span className="tw-text-red">*Campo obrigatório</span>
          )}
        </div>
        <div className="tw-flex tw-flex-col tw-w-full tw-max-w-[600px] tw-mb-[20px]">
          <label htmlFor="">Mensagem</label>
          <textarea
            name="message"
            {...register("message", { required: true })}
            className="tw-border-blue tw-border-[1px] tw-py-[12px] tw-px-[12px]"
          />
          {errors.message && (
            <span className="tw-text-red">*Campo obrigatório</span>
          )}
        </div>
        <button
          type="submit"
          className="tw-bg-blue tw-text-white tw-w-[240px] tw-h-[50px] hover:tw-bg-white hover:tw-border-blue hover:tw-border-[1px] hover:tw-text-blue tw-transition-300"
        >
          {loading}
        </button>
      </form>
    </>
  );
}
