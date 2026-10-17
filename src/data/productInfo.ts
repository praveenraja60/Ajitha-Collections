/** Copy per product number. Colour is as photographed until confirmed on WhatsApp. */
export type ProductInfo = {
  name?: string
  tagline?: string
  description?: string
  price?: number
  priceLabel?: string
  fabric?: string
  color?: string
  sizes?: string[]
  category?: string
}

export const CATEGORIES = ['Festive', 'Occasion', 'Everyday', 'Statement'] as const

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const AS_SHOWN = 'As shown — confirm on WhatsApp'

export const productInfo: Record<number, ProductInfo> = {
  1: {
    name: 'Festive Anarkali',
    tagline: 'Flowing festive silhouette',
    category: 'Festive',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A festive Anarkali from the atelier. Share your preferred length, neckline and fabric — we stitch to your measurements.',
  },
  2: {
    name: 'Occasion Kurta Set',
    tagline: 'Coordinated occasion wear',
    category: 'Occasion',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A coordinated kurta set for functions and evenings. Custom fit and finishing available on order.',
  },
  3: {
    name: 'Everyday Kurti',
    tagline: 'Easy, elegant daily wear',
    category: 'Everyday',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A light everyday kurti designed for comfort. Ask on WhatsApp for fabric, print and sleeve options.',
  },
  4: {
    name: 'Reception Gown',
    tagline: 'Graceful occasion drape',
    category: 'Statement',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A statement gown for receptions and parties. Made to order with your preferred fall and detailing.',
  },
  5: {
    name: 'Festive Churidar',
    tagline: 'Classic festive set',
    category: 'Festive',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'Traditional festive churidar styling with a flattering atelier fit. Measurements taken on WhatsApp.',
  },
  6: {
    name: 'Occasion Dress',
    tagline: 'Modern occasion silhouette',
    category: 'Occasion',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A soft occasion dress you can customise in colour, length and sleeve. Stitched after we confirm details.',
  },
  7: {
    name: 'Festive Kurta',
    tagline: 'Celebration-ready set',
    category: 'Festive',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'Festive kurta detailing with a wearable drape. Fabric and embroidery level confirmed on order.',
  },
  8: {
    name: 'Statement Anarkali',
    tagline: 'Grand occasion presence',
    category: 'Statement',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A statement Anarkali for weddings and receptions. Share a reference look and we will craft the fit.',
  },
  9: {
    name: 'Cotton Day Set',
    tagline: 'Easy festive and day wear',
    category: 'Everyday',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A cotton set for day events and easy festive wear. Custom length and neckline on request.',
  },
  10: {
    name: 'Custom Occasion Dress',
    tagline: 'Your design, our craft',
    category: 'Occasion',
    fabric: 'Your choice',
    color: 'Your choice',
    sizes: SIZES,
    description:
      'Bring a reference photo or sketch. We help with fabric, measurements and finishing for a made-to-order look.',
  },
  11: {
    name: 'Everyday Silhouette',
    tagline: 'Quiet, wearable elegance',
    category: 'Everyday',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A clean everyday silhouette from the current edit. Enquire for fabric hand-feel and available colours.',
  },
  12: {
    name: 'Statement Ensemble',
    tagline: 'Designed to be noticed',
    category: 'Statement',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A statement piece for evenings. Made to order — share size and preferred detailing on WhatsApp.',
  },
  13: {
    name: 'Festive Suit',
    tagline: 'Festive polish, atelier fit',
    category: 'Festive',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'Festive suiting with refined finishing. We confirm fabric, lining and measurements before stitching.',
  },
  14: {
    name: 'Occasion Anarkali',
    tagline: 'Soft occasion volume',
    category: 'Occasion',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'An Anarkali for functions and family events. Custom flare and dupatta styling available.',
  },
  15: {
    name: 'Everyday Kurta',
    tagline: 'Simple lines, careful finish',
    category: 'Everyday',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A kurta for daily wear. Ask for sleeve, slit and length options when you order.',
  },
  16: {
    name: 'Statement Set',
    tagline: 'Clean cut, evening presence',
    category: 'Statement',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A statement set for evenings and celebrations. Stitched after size and fabric confirmation.',
  },
  17: {
    name: 'Festive Ensemble',
    tagline: 'Light festive layering',
    category: 'Festive',
    fabric: 'Confirm on WhatsApp',
    color: AS_SHOWN,
    sizes: SIZES,
    description:
      'A festive ensemble for daytime celebrations. Customisable in fabric and finishing.',
  },
  18: {
    name: 'Atelier Custom Look',
    tagline: 'Built from your reference',
    category: 'Occasion',
    fabric: 'Your choice',
    color: 'Your choice',
    sizes: SIZES,
    description:
      'A custom look from your preferred design. Send fabric, colour and measurements on WhatsApp to begin.',
  },
}
