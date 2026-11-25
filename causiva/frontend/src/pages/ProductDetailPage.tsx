import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "../components/ui/ProductCard";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useRouter, Link } from "../router/RouterContext";
import { Star, ShoppingBag, ShieldCheck, Leaf, Sparkles, ChevronDown, CheckCircle2, Heart } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

export const ProductDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { navigate } = useRouter();
  const products = useProducts();

  const product = products.find((p) => p.slug === slug) || products[0] || PRODUCTS[0];
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedVolume, setSelectedVolume] = useState<string>("100ml");
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<string>("benefits");

  useEffect(() => {
    setActiveImage(product.image);
    setSelectedVolume("100ml");
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug, product]);

  const currentPrice = selectedVolume === "200ml" ? Math.round(product.price * 1.7) : product.price;
  const currentOriginalPrice = selectedVolume === "200ml" ? Math.round(product.originalPrice * 1.7) : product.originalPrice;

  const otherProducts = products.filter((p) => p.id !== product.id).slice(0, 3);
  const favorite = isFavorite(product.id);

  const handleBuyNow = () => {
    addToCart(product, selectedVolume, quantity);
    navigate("/checkout");
  };

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-container-max mx-auto px-4 md:px-8 lg:px-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary font-medium uppercase tracking-wider">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary transition-colors">Shop All</Link>
        <span>/</span>
        <span className="text-primary font-bold">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img ? "border-primary shadow-md scale-105" : "border-outline-variant/40 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="Product view" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="flex-1 aspect-square rounded-3xl overflow-hidden bg-surface-container-low border border-outline-variant/30 shadow-md relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <span className="text-xs font-bold text-primary">{product.rating}</span>
              <span className="text-xs text-secondary">({product.reviewsCount} reviews)</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight leading-tight">
                {product.name}
              </h1>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 transition-colors ${favorite ? "border-[#455a64] bg-[#455a64] text-white" : "border-outline-variant/50 text-secondary hover:border-[#455a64] hover:text-[#455a64]"}`}
                aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
                aria-pressed={favorite}
              >
                <Heart size={18} fill={favorite ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="text-xs font-medium text-secondary tracking-wide">
              {product.tagline}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-serif text-3xl font-bold text-primary">
              ₹{currentPrice}
            </span>
            <span className="text-sm text-secondary line-through">
              ₹{currentOriginalPrice}
            </span>
            <span className="text-xs font-bold text-secondary-container bg-primary px-2.5 py-0.5 rounded-full">
              Save ₹{currentOriginalPrice - currentPrice}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Volume Options */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary block">
              Select Volume: <span className="font-semibold text-secondary">{selectedVolume}</span>
            </label>
            <div className="flex items-center gap-3">
              {product.volumeOptions.map((vol) => (
                <button
                  key={vol}
                  onClick={() => setSelectedVolume(vol)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedVolume === vol
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "bg-surface-container-low text-secondary border-outline-variant/40 hover:text-primary"
                  }`}
                >
                  {vol} {vol === "200ml" && "(Best Value)"}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-outline-variant/50 rounded-full bg-surface-container-low px-2 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 text-secondary hover:text-primary text-sm font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-primary">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 text-secondary hover:text-primary text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={() => addToCart(product, selectedVolume, quantity)}
                className="flex-1 py-3.5 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <ShoppingBag size={15} />
                <span>Add to Bag • ₹{currentPrice * quantity}</span>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-full bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Instant Express Checkout
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-outline-variant/30 text-[11px] text-secondary">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-tertiary-container shrink-0" />
              <span>Free Express Shipping over ₹499</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf size={14} className="text-secondary shrink-0" />
              <span>100% Cold-Pressed Botanic</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary shrink-0" />
              <span>30-Day Ritual Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-primary shrink-0" />
              <span>Complimentary Bamboo Cloth Gift</span>
            </div>
          </div>

          {/* Interactive Accordions */}
          <div className="border-t border-outline-variant/30 pt-4 space-y-2">
            {/* Accordion 1: Benefits */}
            <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === "benefits" ? "" : "benefits")}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-xs font-bold text-primary bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span>Botanical Benefits &amp; Efficacy</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openAccordion === "benefits" ? "rotate-180" : ""}`}
                />
              </button>
              {openAccordion === "benefits" && (
                <div className="p-4 bg-surface text-xs space-y-2 border-t border-outline-variant/20">
                  {product.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <p className="text-secondary leading-relaxed">{b}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Ingredients */}
            <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === "ingredients" ? "" : "ingredients")}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-xs font-bold text-primary bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span>Key Ingredients &amp; Percentages</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openAccordion === "ingredients" ? "rotate-180" : ""}`}
                />
              </button>
              {openAccordion === "ingredients" && (
                <div className="p-4 bg-surface text-xs space-y-3 border-t border-outline-variant/20">
                  {product.keyIngredients.map((ing, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-primary">
                        <span>{ing.name}</span>
                        {ing.percentage && (
                          <span className="text-[10px] bg-secondary-container px-2 py-0.5 rounded-full text-on-secondary-container">
                            {ing.percentage}
                          </span>
                        )}
                      </div>
                      <p className="text-secondary text-[11px]">{ing.purpose}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 3: How to Use */}
            <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === "howToUse" ? "" : "howToUse")}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-xs font-bold text-primary bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span>The 7-Day Cleansing Ritual</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openAccordion === "howToUse" ? "rotate-180" : ""}`}
                />
              </button>
              {openAccordion === "howToUse" && (
                <div className="p-4 bg-surface text-xs space-y-2.5 border-t border-outline-variant/20">
                  {product.howToUse.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-secondary leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="pt-16 border-t border-outline-variant/30 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
            Harmonious Pairings
          </span>
          <h2 className="font-serif text-2xl font-bold text-primary tracking-tight">
            Complete Your Daily Sanctuary Ritual
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
