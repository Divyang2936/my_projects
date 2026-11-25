import React, { useState } from "react";
import { PRODUCTS, REVIEWS } from "../data/products";
import { ProductCard } from "../components/ui/ProductCard";
import { TextReveal } from "../components/ui/TextReveal";
import { useRouter } from "../router/RouterContext";
import { ArrowRight, ShieldCheck, Leaf, Heart, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "../hooks/useProducts";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const products = useProducts();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const filters = ["All", "Brightening", "Hydration", "Acne Care", "Tan Care", "Glow"];
  const filteredProducts = products.filter((p) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Brightening") return p.concern.some(c => /bright|glow/i.test(c));
    if (selectedFilter === "Hydration") return p.concern.some(c => /hydration|barrier/i.test(c));
    if (selectedFilter === "Acne Care") return p.slug.includes("salicylic") || p.concern.some(c => /sebum|pore/i.test(c));
    if (selectedFilter === "Tan Care") return p.concern.some(c => /tan/i.test(c));
    if (selectedFilter === "Glow") return p.slug.includes("ubtan") || p.slug.includes("vitamin-c");
    return true;
  });

  return (
    <motion.div 
      className="flex flex-col w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="relative min-h-[640px] sm:min-h-[680px] md:min-h-[720px] flex items-center bg-[#f7f7f7] pt-0 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="causiva-orb causiva-orb-one" />
          <div className="causiva-orb causiva-orb-two" />
        </div>
        <div className="max-w-container-max mx-auto px-4 md:px-8 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div 
              className="lg:col-span-6"
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 rounded-full bg-white/75 border border-[#b0bec5] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#455a64]">
                <Sparkles size={13} /> Everyday skincare, made simple
              </motion.div>
              <motion.h1 variants={FADE_UP} className="mt-6 sm:mt-7 font-serif text-[clamp(2.7rem,12vw,4.5rem)] leading-[0.98] font-bold tracking-tight text-[#263238]">
                <TextReveal>Your skin.</TextReveal><br /><span className="italic font-normal text-[#455a64]"><TextReveal>Your ritual.</TextReveal></span>
              </motion.h1>
              <motion.p variants={FADE_UP} className="mt-7 max-w-xl text-sm sm:text-base leading-8 text-[#455a64]">
                Meet Causiva — a clean, modern home for everyday face washes. Choose a formula around what your skin needs, from Vitamin C glow to Salicylic Acid pore care.
              </motion.p>
              <motion.div variants={FADE_UP} className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate("/shop")} className="cta-primary w-full sm:w-auto relative group overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">Shop the collection <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></span>
                </button>
                <button onClick={() => navigate("/skin-quiz")} className="cta-secondary w-full sm:w-auto hover:bg-[#e0e0e0] transition-colors">Find your formula</button>
              </motion.div>
              <motion.div variants={FADE_UP} className="mt-9 flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-wider text-[#455a64]">
                <span className="inline-flex items-center gap-2 hover:text-[#263238] transition-colors"><Leaf size={15} /> Botanical-inspired</span>
                <span className="inline-flex items-center gap-2 hover:text-[#263238] transition-colors"><ShieldCheck size={15} /> Everyday gentle care</span>
                <span className="inline-flex items-center gap-2 hover:text-[#263238] transition-colors"><Heart size={15} /> Made for routines</span>
              </motion.div>
            </motion.div>

            <div className="lg:col-span-6 relative">
              <motion.div
                className="hero-product-frame"
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                whileHover={{ y: -10, transition: { duration: 0.4, ease: "easeOut" } }}
              >
                <div className="absolute top-5 left-5 z-10 rounded-full bg-white/85 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#263238]">Causiva picks</div>
                <div className="hero-product-glow" />
                <img src={products[0]?.image || PRODUCTS[0].image} alt="Causiva Vitamin C Face Wash" className="hero-product-image" />
                <div className="hero-product-info gap-3">
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#455a64]">01 / 06</span>
                    <h3 className="font-serif text-base sm:text-xl font-bold text-[#263238] mt-1 truncate">Vitamin C Face Wash</h3>
                    <p className="text-[11px] sm:text-xs text-[#455a64] mt-1 truncate">Orange Peel + Lemon Balm</p>
                  </div>
                  <button onClick={() => navigate("/product/vitamin-c-face-wash")} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#263238] text-white flex items-center justify-center hover:scale-105 transition-transform shrink-0" aria-label="View Vitamin C Face Wash"><ArrowRight size={17} /></button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#263238] text-white">
        <div className="max-w-container-max mx-auto px-4 md:px-8 lg:px-8 grid sm:grid-cols-3 gap-5 sm:gap-8">
          {["Six targeted formulas", "100ml everyday essentials", "Built around real skin concerns"].map((text, i) => (
            <motion.div 
              key={text} 
              className="flex items-center gap-4" 
              initial={{ opacity: 0, x: -20, filter: "blur(5px)" }} 
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center font-serif">0{i + 1}</span>
              <p className="text-xs uppercase tracking-[0.15em] text-white/80">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-b border-[#b0bec5] bg-[#ffffff] py-5" aria-label="Featured botanical ingredients">
        <motion.div
          className="flex w-max items-center gap-8 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-[#455a64] sm:gap-12 sm:text-xs"
          animate={{ x: [0, -420] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {["Vitamin C", "Niacinamide", "Salicylic Acid", "Cucumber Water", "Orange Peel", "Ubtan Botanicals", "Vitamin C", "Niacinamide", "Salicylic Acid"].map((ingredient, index) => (
            <React.Fragment key={`${ingredient}-${index}`}>
              <span>{ingredient}</span>
              <span className="text-[#b0bec5]" aria-hidden="true">•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </section>

      <section className="py-16 md:py-24 bg-white" id="collection">
        <div className="max-w-container-max mx-auto px-4 md:px-8 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between gap-7 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER_CONTAINER}
          >
            <div>
              <motion.span variants={FADE_UP} className="eyebrow block">The Causiva collection</motion.span>
              <motion.h2 variants={FADE_UP} className="section-title mt-2">Pick your daily cleanse.</motion.h2>
              <motion.p variants={FADE_UP} className="section-copy mt-4">Six simple formulas. One easy place to find the right starting point.</motion.p>
            </div>
            <motion.button variants={FADE_UP} onClick={() => navigate("/shop")} className="text-xs font-bold uppercase tracking-wider text-[#263238] inline-flex items-center gap-2 group">
              View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {filters.map((filter) => (
              <button key={filter} onClick={() => setSelectedFilter(filter)} className={`filter-pill transition-all duration-300 ${selectedFilter === filter ? "filter-pill-active" : ""}`}>{filter}</button>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER_CONTAINER}
          >
            {filteredProducts.map((product, i) => (
              <motion.div key={product.id} className="min-w-[82vw] snap-start md:min-w-0" variants={FADE_UP}>
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#f7f7f7]">
        <div className="max-w-container-max mx-auto px-4 md:px-8 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER_CONTAINER}
          >
            <motion.span variants={FADE_UP} className="eyebrow block">Find your match</motion.span>
            <motion.h2 variants={FADE_UP} className="section-title text-[#263238] mt-2">Not sure where to start?</motion.h2>
            <motion.p variants={FADE_UP} className="section-copy max-w-lg mt-4">Tell us what you want from your cleanser and Causiva will guide you toward a formula worth trying.</motion.p>
            <motion.button variants={FADE_UP} onClick={() => navigate("/skin-quiz")} className="cta-primary mt-7 group">
              Take the skin quiz <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {products.slice(0, 4).map((p, i) => (
              <motion.button 
                key={p.id} 
                onClick={() => navigate(`/product/${p.slug}`)} 
                className={`mini-product-card transition-all hover:shadow-lg ${i % 2 ? "mt-8" : ""}`}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <img src={p.image} alt={p.name} />
                <span>{p.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-container-max mx-auto px-4 md:px-8 lg:px-8">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER_CONTAINER}
          >
            <motion.span variants={FADE_UP} className="eyebrow block">Customer notes</motion.span>
            <motion.h2 variants={FADE_UP} className="section-title mt-2">Simple routines. Happy skin.</motion.h2>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER_CONTAINER}
          >
            {REVIEWS.map((rev, i) => (
              <motion.div 
                key={rev.id} 
                className="review-card hover:shadow-md transition-shadow"
                variants={FADE_UP}
              >
                <div className="flex items-center gap-1 text-[#455a64]">{[...Array(5)].map((_, x) => <Star key={x} size={14} fill="currentColor" />)}</div>
                <h3 className="font-serif text-lg font-bold text-[#263238] mt-5">“{rev.title}”</h3>
                <p className="text-sm leading-7 text-[#455a64] mt-3">{rev.content}</p>
                <div className="mt-6 pt-4 border-t border-[#b0bec5] flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#455a64]"><CheckCircle2 size={13} /> {rev.author}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

