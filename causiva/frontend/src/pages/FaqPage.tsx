import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { Link } from "../router/RouterContext";

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What does cold-pressed mean for a facial cleanser?",
      a: "Traditional cleansers cook botanical oils and extracts at high temperatures (up to 85°C) to speed manufacturing, which oxidizes active vitamins and enzymes. Our cold-press extraction uses mechanical pressure without external heat, preserving 100% of the active cellular nutrients, polyphenols, and antioxidants in the plants.",
    },
    {
      q: "How soon can I expect visible changes to my skin barrier?",
      a: "Most customers notice that their skin feels calm, dewy, and noticeably less tight immediately after the very first cleanse. Within 7 consecutive days of daily morning and evening rituals, you will see a reduction in surface dullness, regulated sebum production, and enhanced lit-from-within luminosity.",
    },
    {
      q: "Are Causiva cleansers suitable for sensitive, reactive skin?",
      a: "Yes. All our cleansers are free of synthetic fragrance, parabens, phthalates, and sulfates (SLS/SLES). For highly sensitive or eczema-prone skin, we especially recommend our Cucumber Hydrating Face Wash, which contains 40% cold-pressed cucumber distillate and 5% Centella Asiatica (Cica).",
    },
    {
      q: "How does the Complimentary Bamboo Muslin Cloth offer work?",
      a: "Whenever your ritual order totals ₹499 or more, our fulfillment team automatically adds a complimentary handwoven bamboo muslin cloth to your package, alongside free express courier delivery. No coupon code is required.",
    },
    {
      q: "What is your 30-Day Ritual Guarantee?",
      a: "We want you to love your skin transformation. If you incorporate any Causiva cleanser into your routine for 7 to 30 days and aren't completely delighted with your skin barrier's vitality, simply message our herbalist team for a prompt, hassle-free replacement or refund.",
    },
    {
      q: "How should I store my cold-pressed cleanser?",
      a: "Store your bottle in a cool, dry place away from direct sunlight. Because our formulas are housed in pharmaceutical-grade amber glass, the delicate plant nutrients remain protected against UV degradation.",
    },
  ];

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-3xl mx-auto px-4 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Common Questions &amp; Guidance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Apothecary Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
          Everything you need to know about our cold-pressing process, ingredients, and delivery policies.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 flex items-center justify-between text-left font-serif text-sm font-bold text-primary hover:bg-surface-container-low transition-colors"
            >
              <span className="pr-4">{faq.q}</span>
              <ChevronDown
                size={18}
                className={`text-secondary shrink-0 transition-transform duration-200 ${
                  openIndex === idx ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="p-5 pt-0 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 mt-1">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center space-y-2">
        <h3 className="font-serif text-base font-bold text-primary">Still have a question?</h3>
        <p className="text-xs text-secondary">
          Our herbalists are happy to assist with routine advice or orders.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors"
          >
            Contact an Herbalist
          </Link>
        </div>
      </div>
    </div>
  );
};
