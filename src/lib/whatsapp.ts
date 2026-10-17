export const WHATSAPP_NUMBER = '917708569545'
export const WHATSAPP_DISPLAY = '7708569545'
export const INSTAGRAM_HANDLE = '@ajitha_colletion'
export const INSTAGRAM_URL = 'https://www.instagram.com/ajitha_colletion/'

export const WHATSAPP_HELLO = 'Hi Ajitha Collection, I would like to know more.'

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  const text = message?.trim() || WHATSAPP_HELLO
  return `${base}?text=${encodeURIComponent(text)}`
}

export function productEnquiryMessage(name: string, priceLabel: string, size?: string) {
  const sizeBit = size ? ` Size: ${size}.` : ''
  return `Hi Ajitha Collection, I'm interested in the ${name} (${priceLabel}).${sizeBit} Please share fabric, availability and stitching time.`
}
