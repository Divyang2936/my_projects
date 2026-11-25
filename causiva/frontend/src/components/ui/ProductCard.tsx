import React from "react";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useRouter } from "../../router/RouterContext";
import { ArrowUpRight, Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";

export const ProductCard: React.FC<{ product: Product; index?: number }> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { navigate } = useRouter();
  const favorite = isFavorite(product.id);
  return (
    <motion.article
      className="product-card h-full flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: Math.min(index, 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7 }}
    >
      <button onClick={() => navigate(`/product/${product.slug}`)} className="product-card-image-wrap">
        <img src={product.image} alt={product.name} className="product-card-image" loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <span className="product-arrow"><ArrowUpRight size={17} /></span>
      </button>
      <div className="p-5 md:p-6 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {product.concern.slice(0, 2).map(c => <span key={c} className="product-tag">{c}</span>)}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${favorite ? "text-[#455a64]" : "text-[#455a64] hover:text-[#263238]"}`}
              aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
              aria-pressed={favorite}
            >
              <Heart size={14} fill={favorite ? "currentColor" : "none"} />
              <span className="sr-only">{favorite ? "Favorited" : "Add favorite"}</span>
            </button>
            <span className="text-[11px] font-bold text-[#455a64] flex items-center gap-1"><Star size={11} fill="currentColor" /> {product.rating}</span>
          </div>
        </div>
        <button onClick={() => navigate(`/product/${product.slug}`)} className="text-left block mt-4 w-full">
          <h3 className="font-serif text-xl font-bold text-[#263238]">{product.name}</h3>
          <p className="text-sm leading-6 text-[#455a64] mt-2 min-h-10">{product.tagline}</p>
        </button>
        <div className="mt-auto pt-4 border-t border-[#b0bec5] flex items-center justify-between gap-3">
          <div><span className="font-serif text-xl font-bold text-[#263238]">₹{product.price}</span><span className="text-[11px] text-[#455a64] ml-2">{product.volume}</span></div>
          <button onClick={() => addToCart(product, product.volume, 1)} className="add-button"><ShoppingBag size={14} /> Add</button>
        </div>
      </div>
    </motion.article>
  );
};
