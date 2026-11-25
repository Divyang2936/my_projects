import React, { useState } from "react";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "../components/ui/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

export const ShopPage: React.FC = () => {
  const [selectedConcern, setSelectedConcern] = useState<string>("All");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  const products = useProducts();

  const concerns = ["All", "Brightening", "Hydration", "Breakouts", "Pore Tightening", "Tan Removal", "Golden Glow"];
  const skinTypes = ["All", "Oily", "Dry", "Combination", "Sensitive", "All Skin Types"];

  let filtered = products.filter((p) => {
    if (selectedConcern !== "All" && !p.concern.includes(selectedConcern)) return false;
    if (selectedSkinType !== "All" && !p.skinType.includes(selectedSkinType)) return false;
    return true;
  });

  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-container-max mx-auto px-4 md:px-8 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/30 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          100% Cold-Pressed Botanic Cleansers
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary tracking-tight">
          The Botanical Cleanser Apothecary
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-xl mx-auto leading-relaxed">
          Crafted in small micro-batches with organic cold-pressed botanicals, wild herbs, and pure plant amino acids. Formulated without sulfates, parabens, or synthetic fragrance.
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-y border-outline-variant/30">
        {/* Concerns Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-semibold text-secondary mr-2 shrink-0">
            <SlidersHorizontal size={14} />
            <span>Concern:</span>
          </div>
          {concerns.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedConcern(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedConcern === c
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-secondary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <span className="text-xs text-secondary font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-primary cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Results */}
      <div>
        <p className="text-xs font-semibold text-secondary mb-6">
          Showing {filtered.length} Cold-Pressed Formulations
        </p>
        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="font-serif text-lg font-bold text-primary">No products match this filter.</p>
            <button
              onClick={() => {
                setSelectedConcern("All");
                setSelectedSkinType("All");
              }}
              className="text-xs font-bold text-primary underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div id="shop-product-grid" className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <div key={product.id} className="min-w-[82vw] snap-start md:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
