export default function Header() {
  return (
    <header className="tw-flex tw-items-center tw-z-[400] tw-bg-white tw-w-[100%] tw-px-[5%] tw-fixed tw-top-0 tw-left-0 tw-justify-between tw-py-[15px] tw-border-black tw-border-b-[1px]">
      <a href="/" className="tw-flex">
        <img src="/assets/icons/logo.svg" className="tw-w-[100px]" />
      </a>
      <div>
        <a
          href="/"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Home
        </a>
        <a
          href="/#sobre"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Sobre
        </a>
        <a
          href="/produtos"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Produtos
        </a>
        <a
          href="/#catalogo"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Catálogo
        </a>
        <a
          href="/#videos"
          className="tw-mx-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Vídeos
        </a>
        <a
          href="#contato"
          className="tw-ml-[30px] hover:tw-text-blue tw-transition-[0.4s]"
        >
          Contato
        </a>
      </div>
    </header>
  );
}
