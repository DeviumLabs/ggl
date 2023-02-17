import { Squash as Hamburger } from 'hamburger-react'
import { useState } from 'react';


export default function Header() {

  const [isOpen, setOpen] = useState(false)


  return (
    <header className="tw-flex tw-items-center tw-z-[400] tw-bg-white tw-w-[100%] tw-px-[20px] tw-fixed tw-top-0 tw-left-0 tw-justify-center tw-border-black tw-border-b-[1px] tw-h-[110px]">
      <div className='tw-flex tw-items-center tw-justify-between tw-max-w-[1280px] tw-w-full'>
        <a href="/" className="tw-flex">
          <img src="/assets/icons/logo.svg" className="tw-w-[100px]" />
        </a>
        <div className='tw-fixed md:tw-static tw-top-[110px] tw-left-0 tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center md:tw-justify-end tw-flex-col md:tw-flex-row tw-gap-[30px] md:tw-bg-transparent tw-bg-blue tw-text-white md:tw-text-black tw-duration-200 tw-ease-out md:!tw-translate-x-0'
        style={{
          transform: !isOpen ? "translateX(100%)" : "translateX(0)"
        }}>
          <a
            href="/"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => setOpen(false)}
          >
            Home
          </a>
          <a
            href="/#sobre"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => setOpen(false)}
          >
            Sobre
          </a>
          <a
            href="/produtos"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => setOpen(false)}
          >
            Produtos
          </a>
          <a
            href="/#catalogo"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => setOpen(false)}
          >
            Catálogo
          </a>

          <a
            href="#contato"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => setOpen(false)}
          >
            Contato
          </a>
        </div>
        <div className='md:tw-hidden tw-block'>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
      </div>
    </header>
  );
}
