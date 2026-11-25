import React from "react";
import { Leaf, ShieldCheck, Heart, Sparkles, RefreshCw } from "lucide-react";
import { Link } from "../router/RouterContext";

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-container-max mx-auto px-4 md:px-8 lg:px-8 space-y-16">
      {/* Header Banner */}
      <div className="bg-surface-container-low rounded-3xl p-8 md:p-16 border border-outline-variant/30 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Our Botanical Sanctuary &amp; Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-primary tracking-tight max-w-2xl mx-auto leading-tight">
          Where Ancient Apothecary Meets Clean Phytochemistry
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-2xl mx-auto leading-relaxed">
          Causiva was born from a fundamental frustration with industrial skincare: commercial cleansers loaded with synthetic foamers, SLS, and artificial perfumes that destroy the delicate skin acid mantle.
        </p>
      </div>

      {/* The Story & Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
            The Cold-Pressed Difference
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Why High Heat Destroys Living Botanicals
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Most mass-market cleansers boil their active plant extracts during processing to speed up emulsification. This destroys up to 80% of heat-sensitive antioxidants, polyphenols, and enzymes.
          </p>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            At Causiva, our micro-batch apothecary employs a hydraulic cold-pressing technique under strict temperature control. Saffron threads, mountain cucumbers, Valencia oranges, and wild willow bark are extracted slowly, preserving 100% of their bio-active cellular vitality.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-primary">
            <span className="flex items-center gap-1.5 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
              <Leaf size={14} className="text-secondary" />
              Direct-from-Farmer Harvest
            </span>
            <span className="flex items-center gap-1.5 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
              <RefreshCw size={14} className="text-secondary" />
              Zero-Waste Micro Batching
            </span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border border-outline-variant/30 shadow-xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL-UgHpdFFm2PW2Ci1Ew5HMoDfXZgsZiJ4XjhjAGrk1k3Ug6GCrb3Vj8h6A4pddBBkakQKMIiLmq_Z5AGqDNn9VOq_qwIeEHwyCOl-9XRpZvWKrhd8E9saQp_RqjlxUa5-VFdTAYItXEhRdBQOo3W4ncoTpcUXOu8NafDi0utyv0tOnSGmKWDW_VRbQwbMVmMWNVurWWhIk77aGLfmQGL0Qp5kDyQJX-fteShNHQb_uvXBInsquC3N"
              alt="Artisanal Cold-Pressed Skincare"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* 3 Core Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-outline-variant/30">
        <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-primary">
            <Leaf size={24} />
          </div>
          <h3 className="font-serif text-lg font-bold text-primary">Zero-Sulfates Promise</h3>
          <p className="text-xs text-secondary leading-relaxed">
            We never use SLS, SLES, artificial colorants, or synthetic fragrances. Our foaming action comes entirely from coconut and apple amino-acid lipids.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-serif text-lg font-bold text-primary">Amber Glass Sanctum</h3>
          <p className="text-xs text-secondary leading-relaxed">
            Plastic bottles leach chemical endocrine disruptors into formulas. We bottle solely in pharmaceutical amber glass that filters out UV light degradation.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-primary">
            <Heart size={24} />
          </div>
          <h3 className="font-serif text-lg font-bold text-primary">Ethical Wildcrafting</h3>
          <p className="text-xs text-secondary leading-relaxed">
            Every botanical is harvested in harmony with seasonal moon and weather cycles, ensuring the regeneration of wild Himalayan and Western Ghat ecosystems.
          </p>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="text-center pt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-md"
        >
          <span>Experience the 7-Day Cleanser Ritual</span>
        </Link>
      </div>
    </div>
  );
};
