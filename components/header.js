export default function Header() {
  return (
    <header className="tw-flex tw-items-center tw-z-[100] tw-bg-white tw-w-[100%] tw-px-[5%] tw-fixed tw-top-0 tw-left-0 tw-justify-between tw-py-[15px] tw-border-black tw-border-b-[1px]">
      <div className="tw-flex">
        <img src="/assets/icons/logo.svg" className="tw-w-[100px]" />
      </div>
      <div>
        <a
          href="/"
          target="_blank"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Home
        </a>
        <a
          href="/#sobre"
          target="_blank"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Sobre
        </a>
        <a
          href="/produtos"
          target="_blank"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Produtos
        </a>
        <a
          href="/#catalogo"
          target="_blank"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Catálogo
        </a>
        <a
          href="/#videos"
          target="_blank"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Vídeos
        </a>
        <a
          href="#contato"
          target="_blank"
          className="tw-ml-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Contato
        </a>
      </div>
    </header>
  );
}
