// Single source of truth for NAP, contact directory, booking links, tracking IDs.
// Fix facts HERE, never in page copy. (Same convention as Main Website.)
//
// ⚠️ BOOKING IS JOTFORM, NOT ACUITY. The grooming Acuity account was DISABLED
// on 2026-07-11 — never link an acuityscheduling.com / as.me URL anywhere on
// this site. The old WordPress pages still carry dead Acuity links; do not
// carry them over.

export const business = {
  name: 'The Fairy Tails Dog Grooming',
  domain: 'https://fairytailsdoggrooming.co.uk',

  address: {
    line1: 'Number 15, Mount Pleasant Road',
    town: 'Hastings',
    postcode: 'TN34 3SB',
    countryCode: 'GB',
    // Locational copy hook: the salon sits at the bottom of Mount Pleasant Road,
    // on the edge of Alexandra Park.
  },
  mapsUrl:
    'https://maps.google.com/maps?q=The+Fairy+Tails+Dog+Grooming+15+Mount+Pleasant+Road+Hastings+TN34+3SB',

  hours: {
    display: 'Mon to Fri 8.00 am – 5.30 pm · Sat, Sun & Bank Holidays closed',
    jsonLd: { opens: '08:00', closes: '17:30', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  },

  // TWO public numbers (from the old site, verified 2026-07-12): the salon
  // landline, and the mobile used for cancellations + WhatsApp.
  phones: {
    main: { label: 'Salon line', display: '01424 300668', tel: 'tel:+441424300668' },
    mobile: {
      label: 'Mobile — cancellations & WhatsApp',
      display: '07842 116216',
      tel: 'tel:+447842116216',
      whatsapp: 'https://wa.me/447842116216',
    },
  },

  emails: {
    info: 'info@thefairytails.co.uk',
  },

  socials: {
    facebook: 'https://www.facebook.com/thefairytailsdoggrooming',
    instagram: 'https://www.instagram.com/thefairytailsgroomers/',
    tiktok: 'https://www.tiktok.com/@thefairytailsdoggrooming',
  },

  // Primary CTA site-wide. The JotForm takes payment (pci.jotform.com) —
  // link out, never iframe.
  booking: {
    jotform: 'https://pci.jotform.com/form/251190647924057',
  },

  // £25/month per dog, alternating Full Groom / Half Groom months, bus
  // pick-up & drop-off included. 2-month minimum term (anti-gaming guard —
  // always show it next to the sign-up CTA). Stripe link is LIVE — never
  // complete a test checkout.
  subscription: {
    stripeUrl: 'https://buy.stripe.com/8x27sM5K57BR1IL94W9MY00',
    price: 25,
    unit: 'per month, per dog',
    minTermMonths: 2,
  },

  // Google Business Profile. rating/count are a 2026-07-12 snapshot — refresh
  // during polish passes, don't treat as live data.
  reviews: {
    placeId: 'ChIJV3P8-VAb30cRHoBgRmxCYIM',
    rating: 4.9,
    count: 63,
    readUrl: 'https://search.google.com/local/reviews?placeid=ChIJV3P8-VAb30cRHoBgRmxCYIM',
    writeUrl: 'https://search.google.com/local/writereview?placeid=ChIJV3P8-VAb30cRHoBgRmxCYIM',
  },

  pickup: {
    freeAreas: 'Hastings & St Leonards',
    freeNote: 'Free pick-up and drop-off for full grooms in Hastings & St Leonards',
    chargedNote: 'Bexhill, Battle and Rye: £5 per journey',
  },

  // The K9 Centre (training/day school) — the sister business this salon is part of.
  sisterSite: 'https://www.thefairytails.co.uk',

  tracking: {
    gtm: 'GTM-W93L9XK5', // shared container with the main site
  },

  // n8n "Grooming Website Enquiry" webhook on the self-hosted VPS —
  // public by design; spam defence lives in n8n (honeypot + elapsedMs).
  enquiryWebhook: 'https://auto.thefairytails.co.uk/webhook/grooming-enquiry',
} as const;
