import React, { useState } from "react";
import { Link } from "../../router/RouterContext";
import { Leaf, ShieldCheck, Heart, Sparkles, Mail, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-surface-container-low text-on-surface border-t border-outline-variant/30 mt-24">
      {/* Newsletter Strip */}
      <div className="bg-primary text-on-primary py-12 px-4 md:px-8">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold tracking-tight">
              Join Our Botanical Sanctuary
            </h3>
            <p className="text-sm text-primary-fixed-dim max-w-md">
              Receive early access to limited wild harvests, seasonal ritual guides, and ₹150 off your first ritual.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 sm:min-w-0">
            {subscribed ? (
              <div className="flex items-start sm:items-center gap-2 bg-secondary-container text-on-secondary-container px-4 sm:px-5 py-3 rounded-2xl sm:rounded-full text-xs font-semibold">
                <CheckCircle2 size={16} />
                <span>Welcome to the sanctuary! Check your inbox for your code.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="px-5 py-3 rounded-full bg-primary-container text-on-primary placeholder:text-primary-fixed-dim/60 text-xs focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="px-7 py-3 rounded-full bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-container-max mx-auto px-4 md:px-8 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16">
          {/* Brand Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[16px]">spa</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-primary">
                Causiva
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Artisanal clean skincare formulated with 100% cold-pressed botanicals, wild-harvested plant essences, and biocompatible nutrients to nourish and revitalize your natural skin barrier in 7 days.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary text-xs">
                <Leaf size={14} />
              </span>
              <span className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary text-xs">
                <Sparkles size={14} />
              </span>
              <span className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary text-xs">
                <ShieldCheck size={14} />
              </span>
              <span className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary text-xs">
                <Heart size={14} />
              </span>
            </div>
          </div>

          {/* Formulations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              The Formulations
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/product/vitamin-c-face-wash" className="hover:text-primary transition-colors">
                  Vitamin C Brightening Face Wash
                </Link>
              </li>
              <li>
                <Link href="/product/cucumber-face-wash" className="hover:text-primary transition-colors">
                  Cucumber Hydrating Face Wash
                </Link>
              </li>
              <li>
                <Link href="/product/de-tan-face-wash" className="hover:text-primary transition-colors">
                  De-Tan Clarifying Face Wash
                </Link>
              </li>
              <li>
                <Link href="/product/salicylic-acid-face-wash" className="hover:text-primary transition-colors">
                  Salicylic Acid Purifying Face Wash
                </Link>
              </li>
              <li>
                <Link href="/product/niacinamide-face-wash" className="hover:text-primary transition-colors">
                  Niacinamide Pore-Minimizing Face Wash
                </Link>
              </li>
              <li>
                <Link href="/product/ubtan-face-wash" className="hover:text-primary transition-colors">
                  Ubtan Radiance Ritual Face Wash
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Help & Concierge
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/track-order" className="hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-primary transition-colors">
                  Shipping & Zero-Waste Packaging
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-primary transition-colors">
                  30-Day Ritual Guarantee & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Apothecary FAQs
                </Link>
              </li>
              <li>
                <Link href="/skin-quiz" className="hover:text-primary transition-colors">
                  Skin Consultation Quiz
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Our Herbalists
                </Link>
              </li>
            </ul>
          </div>

          {/* Clean Certifications & Payments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Clean Certifications
            </h4>
            <p className="text-xs text-on-surface-variant">
              Every batch independently tested for purity and microbial safety.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full text-[11px] font-semibold text-secondary">
                ✓ Cruelty-Free
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full text-[11px] font-semibold text-secondary">
                ✓ 100% Vegan
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full text-[11px] font-semibold text-secondary">
                ✓ Sulfate & Paraben Free
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full text-[11px] font-semibold text-secondary">
                ✓ GMP Certified Lab
              </span>
            </div>

            <div className="pt-3">
              <span className="text-[10px] uppercase tracking-wider text-secondary font-bold block mb-1.5">
                Safe & Secure Payments
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-secondary">
                <span className="px-2 py-1 bg-surface-container-highest rounded">UPI</span>
                <span className="px-2 py-1 bg-surface-container-highest rounded">GPAY</span>
                <span className="px-2 py-1 bg-surface-container-highest rounded">PAYTM</span>
                <span className="px-2 py-1 bg-surface-container-highest rounded">VISA</span>
                <span className="px-2 py-1 bg-surface-container-highest rounded">MASTERCARD</span>
                <span className="px-2 py-1 bg-surface-container-highest rounded">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 border-t border-outline-variant/40 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-xs text-on-surface-variant text-center md:text-left">
          <p className="max-w-xl leading-5">© 2026 Causiva Botanicals. Mindfully handcrafted in India. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
