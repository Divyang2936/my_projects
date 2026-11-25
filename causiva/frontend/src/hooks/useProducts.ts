import { useEffect, useState } from "react";
import { PRODUCTS } from "../data/products";
import { Product } from "../types";
import { api, ApiProduct } from "../lib/api";

const fromApi = (remote: ApiProduct): Product => {
  const local = PRODUCTS.find((product) => product.slug === remote.slug);
  if (local) {
    return { ...local, id: remote.id, name: remote.name, price: remote.price, originalPrice: remote.originalPrice, volume: remote.volume, image: remote.imageUrl || local.image };
  }
  return {
    id: remote.id,
    name: remote.name,
    slug: remote.slug,
    tagline: "Everyday botanical cleansing care",
    price: remote.price,
    originalPrice: remote.originalPrice,
    volume: remote.volume,
    volumeOptions: [remote.volume],
    rating: 0,
    reviewsCount: 0,
    image: remote.imageUrl || "/products/vitc-clean.jpg",
    galleryImages: [remote.imageUrl || "/products/vitc-clean.jpg"],
    skinType: ["All Skin Types"],
    concern: ["Daily Cleansing"],
    description: "A Causiva botanical cleanser for a considered everyday ritual.",
    benefits: ["Gentle everyday cleansing"],
    keyIngredients: [],
    howToUse: ["Wet your face, massage cleanser gently, then rinse thoroughly."],
    badge: undefined,
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    api.products()
      .then((remote) => setProducts(remote.map(fromApi)))
      .catch((error: unknown) => setProducts(error instanceof TypeError ? PRODUCTS : []));
  }, []);
  return products;
};
