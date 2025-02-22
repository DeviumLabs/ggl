import { AiOutlineWhatsApp } from 'react-icons/ai'

export default function Whatsapp() {
  return (
    <a 
        target="_blank" 
        rel="noreferrer" 
        href="https://wa.me/42999357242"
        className="tw-rounded-full tw-h-16 tw-w-16 tw-bg-green-600 tw-fixed tw-right-[20px] tw-bottom-[20px] tw-flex tw-items-center tw-justify-center"
      >
        <AiOutlineWhatsApp color="white" size={40} />
      </a>
  )
}