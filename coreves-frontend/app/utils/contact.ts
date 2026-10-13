export const CONTACT_EMAIL = 'hello@coreves.software'

export const CONTACT_PHONES = [
  { display: '+260 975 852 270', tel: '+260975852270', whatsapp: '260975852270' },
  { display: '+260 952 752 510', tel: '+260952752510', whatsapp: '260952752510' },
]

const WHATSAPP_GREETING = "Hi Coreves, I'd like to know more about your solutions."

export function whatsappLink(whatsappNumber: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_GREETING)}`
}
