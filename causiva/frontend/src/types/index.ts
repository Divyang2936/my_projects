export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice: number;
  volume: string;
  volumeOptions: string[];
  rating: number;
  reviewsCount: number;
  image: string;
  galleryImages: string[];
  skinType: string[];
  concern: string[];
  description: string;
  benefits: string[];
  keyIngredients: { name: string; percentage?: string; purpose: string }[];
  howToUse: string[];
  badge?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  volume: string;
  image: string;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  skinType?: string;
}
