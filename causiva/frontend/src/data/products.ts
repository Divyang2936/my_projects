import { Product, CustomerReview } from "../types";

const img = (name: string) => `/products/${name}`;

export const PRODUCTS: Product[] = [
  {
    id: "prod-vit-c",
    name: "Vitamin C Face Wash",
    slug: "vitamin-c-face-wash",
    tagline: "Orange Peel + Lemon Balm • For Glowing Skin",
    price: 299,
    originalPrice: 299,
    volume: "100ml",
    volumeOptions: ["100ml"],
    rating: 4.8,
    reviewsCount: 0,
    badge: "Glow",
    image: img("vitc-clean.jpg"),
    galleryImages: [img("vitc-clean.jpg"), img("vitc-front.jpg"), img("vitc-back.jpg")],
    skinType: ["All Skin Types"],
    concern: ["Brightening", "Deep Cleansing"],
    description: "A Vitamin C face wash with orange peel and lemon balm, designed for a fresh, deeply cleansed and glowing-looking complexion.",
    benefits: ["Deep cleansing", "Exfoliating care", "Helps brighten the complexion", "Made for all skin types"],
    keyIngredients: [
      { name: "Vitamin C", purpose: "Brightening and antioxidant-focused cleansing" },
      { name: "Orange Peel Extract", purpose: "Botanical citrus cleansing support" },
      { name: "Lemon Balm Extract", purpose: "Refreshing botanical care" }
    ],
    howToUse: ["Wet your face with water.", "Apply face wash and gently massage in circular motions.", "Rinse thoroughly and pat dry."]
  },
  {
    id: "prod-cuc",
    name: "Cucumber Face Wash",
    slug: "cucumber-face-wash",
    tagline: "Neem Extract + Vitamin E • For Instant Refreshment",
    price: 299,
    originalPrice: 299,
    volume: "100ml",
    volumeOptions: ["100ml"],
    rating: 4.8,
    reviewsCount: 0,
    badge: "Refresh",
    image: img("cucumber-front.jpg"),
    galleryImages: [img("cucumber-front.jpg")],
    skinType: ["All Skin Types"],
    concern: ["Hydration", "Refreshment"],
    description: "A refreshing cucumber face wash with neem extract and Vitamin E, created to cleanse while leaving skin feeling fresh and nourished.",
    benefits: ["Refreshing cleanse", "Helps nourish skin", "Hydrating feel", "Suitable for all skin types"],
    keyIngredients: [
      { name: "Cucumber", purpose: "Refreshing botanical care" },
      { name: "Neem Extract", purpose: "Purifying botanical support" },
      { name: "Vitamin E", purpose: "Nourishing skin-conditioning care" }
    ],
    howToUse: ["Wet your face with water.", "Apply face wash and gently massage in circular motions.", "Rinse thoroughly and pat dry."]
  },
  {
    id: "prod-detan",
    name: "De-Tan Face Wash",
    slug: "de-tan-face-wash",
    tagline: "Papaya Extract + Clove Oil • For Tanned Skin",
    price: 299,
    originalPrice: 299,
    volume: "100ml",
    volumeOptions: ["100ml"],
    rating: 4.9,
    reviewsCount: 0,
    badge: "De-Tan",
    image: img("detan-clean.jpg"),
    galleryImages: [img("detan-clean.jpg"), img("detan-front.jpg"), img("detan-back.jpg")],
    skinType: ["All Skin Types", "Tanned Skin"],
    concern: ["Tan Removal", "Moisturising"],
    description: "A de-tan face wash formulated with papaya extract and clove oil for cleansing, tan-care and a moisturised skin feel.",
    benefits: ["Helps fade the look of tan", "Cleanses impurities", "Moisturising feel", "For all skin types"],
    keyIngredients: [
      { name: "Papaya Extract", purpose: "Fruit-derived exfoliating and tan-care support" },
      { name: "Clove Oil", purpose: "Purifying botanical care" },
      { name: "Licorice Extract", purpose: "Tone-evening botanical support" }
    ],
    howToUse: ["Wet your face with water.", "Apply face wash and gently massage in circular motions.", "Rinse thoroughly and pat dry."]
  },
  {
    id: "prod-niacinamide",
    name: "2% Niacinamide Gentle Face Cleanser",
    slug: "niacinamide-face-cleanser",
    tagline: "ProVitamin B5 + Panthenol • For Skin Hydration",
    price: 299,
    originalPrice: 299,
    volume: "100ml",
    volumeOptions: ["100ml"],
    rating: 4.8,
    reviewsCount: 0,
    badge: "Gentle",
    image: img("niacinamide-front.jpg"),
    galleryImages: [img("niacinamide-front.jpg")],
    skinType: ["Dry", "Normal", "Sensitive"],
    concern: ["Hydration", "Barrier Protection"],
    description: "A gentle 2% niacinamide cleanser with ProVitamin B5 and panthenol for a comfortable, hydrating cleansing routine.",
    benefits: ["Deep hydration", "Barrier-supporting care", "Gentle cleansing", "Suitable for dry, normal and sensitive skin"],
    keyIngredients: [
      { name: "2% Niacinamide", percentage: "2%", purpose: "Skin-conditioning and barrier-supporting care" },
      { name: "ProVitamin B5", purpose: "Hydrating skin-conditioning support" },
      { name: "Panthenol", purpose: "Soothing and moisturising care" }
    ],
    howToUse: ["Wet your face with water.", "Apply cleanser and gently massage in circular motions.", "Rinse thoroughly and pat dry."]
  },
  {
    id: "prod-salicylic",
    name: "2% Salicylic Acid Face Wash",
    slug: "salicylic-acid-face-wash",
    tagline: "Lime Peel + Willow Bark + Allantoin • For Acne-Prone Skin",
    price: 299,
    originalPrice: 299,
    volume: "100ml",
    volumeOptions: ["100ml"],
    rating: 4.9,
    reviewsCount: 0,
    badge: "Acne Care",
    image: img("salicylic-front.jpg"),
    galleryImages: [img("salicylic-front.jpg")],
    skinType: ["Oily", "Combination", "Acne-Prone"],
    concern: ["Pore Purifying", "Sebum Balance"],
    description: "A 2% salicylic acid face wash with lime peel, willow bark and allantoin, created for pore-purifying cleansing and sebum-balancing care.",
    benefits: ["Pore-purifying cleanse", "Helps balance excess sebum", "For oily and acne-prone skin", "Refreshing daily cleanse"],
    keyIngredients: [
      { name: "2% Salicylic Acid", percentage: "2%", purpose: "Pore-focused exfoliating care" },
      { name: "Lime Peel", purpose: "Refreshing botanical cleansing support" },
      { name: "Willow Bark", purpose: "Botanical purifying support" },
      { name: "Allantoin", purpose: "Skin-comforting care" }
    ],
    howToUse: ["Wet your face with water.", "Apply face wash and gently massage in circular motions.", "Rinse thoroughly and pat dry. Avoid the eye area."]
  },
  {
    id: "prod-ubtan",
    name: "Ubtan Face Wash",
    slug: "ubtan-face-wash",
    tagline: "Turmeric + Kumkumadi • For Glowing Skin",
    price: 299,
    originalPrice: 299,
    volume: "100ml",
    volumeOptions: ["100ml"],
    rating: 4.9,
    reviewsCount: 0,
    badge: "Ubtan",
    image: img("ubtan-clean.jpg"),
    galleryImages: [img("ubtan-clean.jpg"), img("ubtan-front.jpg"), img("ubtan-back.jpg")],
    skinType: ["All Skin Types"],
    concern: ["Glow", "Exfoliation", "Pore Detox"],
    description: "An ubtan-inspired face wash with turmeric and kumkumadi, made for exfoliating cleansing, pore detox care and a glowing-looking finish.",
    benefits: ["Exfoliating cleanse", "Pore-detox focused care", "Helps brighten the look of skin", "Suitable for all skin types"],
    keyIngredients: [
      { name: "Turmeric Extract", purpose: "Traditional botanical skin care" },
      { name: "Kumkumadi Oil", purpose: "Traditional Ayurvedic-inspired nourishment" },
      { name: "Saffron Liquid Extract", purpose: "Botanical radiance-focused care" }
    ],
    howToUse: ["Wet your face with water.", "Apply face wash and gently massage in circular motions.", "Rinse thoroughly and pat dry."]
  }
];

export const REVIEWS: CustomerReview[] = [
  { id: "rev-1", author: "Verified Customer", rating: 5, date: "Recent", title: "Fresh and easy to use", content: "The cleanser feels refreshing and leaves my skin comfortable after washing.", verified: true },
  { id: "rev-2", author: "Verified Customer", rating: 5, date: "Recent", title: "Love the Ubtan formula", content: "The Ubtan face wash has become a simple part of my everyday routine.", verified: true },
  { id: "rev-3", author: "Verified Customer", rating: 5, date: "Recent", title: "Good daily cleanse", content: "A nice selection of face washes for different skin concerns.", verified: true }
];
