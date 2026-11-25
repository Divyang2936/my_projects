import React, { useState } from "react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { useRouter } from "../router/RouterContext";
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, ShoppingBag, Star } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

export const SkinQuizPage: React.FC = () => {
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const products = useProducts();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    skinType: "",
    concern: "",
    texture: "",
  });

  const questions = [
    {
      title: "How does your skin feel 2 hours after washing?",
      subtitle: "Helps identify your natural baseline sebum and lipid barrier level.",
      key: "skinType",
      options: [
        { label: "Tight, dry, or slightly flaky", value: "dry", tag: "Hydration Focus" },
        { label: "Shiny, especially across forehead and nose", value: "oily", tag: "Sebum Regulating" },
        { label: "Oily T-zone, but cheeks feel dry or normal", value: "combination", tag: "Balancing" },
        { label: "Easily flushed, itchy, or reactive to ingredients", value: "sensitive", tag: "Calming" },
      ],
    },
    {
      title: "What is your primary skin goal for the next 7 days?",
      subtitle: "Select the transformation you wish to achieve first.",
      key: "concern",
      options: [
        { label: "Fade persistent sun tanning & dark spots", value: "detan", tag: "De-Tan & Radiance" },
        { label: "Clear active blemishes, blackheads & breakouts", value: "acne", tag: "Blemish Clarifying" },
        { label: "Tighten visible pores & balance daytime oiliness", value: "pores", tag: "Niacinamide Balance" },
        { label: "Revive dull complexion with festive golden glow", value: "ubtan", tag: "Ayurvedic Radiance" },
        { label: "Deep continuous hydration without tightness", value: "hydration", tag: "Cica & Cucumber" },
      ],
    },
    {
      title: "What cleanser sensation does your ritual crave?",
      subtitle: "Every Causiva formula offers a tailored sensorial finish.",
      key: "texture",
      options: [
        { label: "Cooling electrolyte hydration with zero stripping", value: "cooling" },
        { label: "Invigorating citrus aromatherapy that wakes up skin", value: "citrus" },
        { label: "Earthy sandalwood & saffron herbal tranquility", value: "saffron" },
        { label: "Refreshing botanical foam that unclogs every pore", value: "purifying" },
      ],
    },
  ];

  const handleSelectOption = (key: string, val: string) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(questions.length); // Result screen
    }
  };

  // Determine recommended product
  let recommendedProduct = products[0] || PRODUCTS[0]; // default Vitamin C
  if (answers.concern === "detan") {
    recommendedProduct = products.find((p) => p.slug === "de-tan-face-wash") || products[2] || PRODUCTS[2];
  } else if (answers.concern === "acne") {
    recommendedProduct = products.find((p) => p.slug === "salicylic-acid-face-wash") || products[3] || PRODUCTS[3];
  } else if (answers.concern === "pores") {
    recommendedProduct = products.find((p) => p.slug === "niacinamide-face-wash") || products[4] || PRODUCTS[4];
  } else if (answers.concern === "ubtan") {
    recommendedProduct = products.find((p) => p.slug === "ubtan-face-wash") || products[5] || PRODUCTS[5];
  } else if (answers.concern === "hydration" || answers.skinType === "dry" || answers.skinType === "sensitive") {
    recommendedProduct = products.find((p) => p.slug === "cucumber-face-wash") || products[1] || PRODUCTS[1];
  }

  const isCompleted = currentStep >= questions.length;

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-3xl mx-auto px-4 space-y-10">
      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Apothecary Skin Consultation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Discover Your 7-Day Botanical Match
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
          Answer 3 brief questions to receive our herbalists' personalized cold-pressed cleanser recommendation.
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 border border-outline-variant/30 shadow-sm space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-secondary">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
              {questions[currentStep].title}
            </h2>
            <p className="text-xs text-secondary">
              {questions[currentStep].subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {questions[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(questions[currentStep].key, opt.value)}
                className="w-full p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container hover:border-primary text-left transition-all flex items-center justify-between group active:scale-[0.99]"
              >
                <div>
                  <h4 className="font-serif text-sm font-bold text-primary group-hover:text-primary-container">
                    {opt.label}
                  </h4>
                  {opt.tag && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary">
                      {opt.tag}
                    </span>
                  )}
                </div>
                <ArrowRight size={16} className="text-secondary group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 border border-outline-variant/30 shadow-xl space-y-8 text-center animate-fade-in">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-secondary-container bg-primary px-3.5 py-1 rounded-full uppercase tracking-wider">
              <CheckCircle2 size={14} />
              <span>98% Botanical Match Found</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Your Prescribed Daily Ritual
            </h2>
            <p className="text-xs text-secondary max-w-md mx-auto">
              Based on your unique barrier profile, our herbalists recommend incorporating this formula into your morning &amp; evening cleanse.
            </p>
          </div>

          {/* Recommended Product Card */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-left space-y-4 shadow-sm">
            <div className="flex gap-4 items-center">
              <img
                src={recommendedProduct.image}
                alt={recommendedProduct.name}
                className="w-24 h-24 rounded-xl object-cover border border-outline-variant/30 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-500" />
                  ))}
                  <span className="text-[11px] font-bold text-primary ml-1">{recommendedProduct.rating}</span>
                </div>
                <h3 className="font-serif text-base font-bold text-primary">
                  {recommendedProduct.name}
                </h3>
                <p className="text-xs text-secondary">
                  {recommendedProduct.tagline}
                </p>
                <p className="text-sm font-bold text-primary pt-1">
                  ₹{recommendedProduct.price} <span className="text-xs text-secondary line-through">₹{recommendedProduct.originalPrice}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-3">
              {recommendedProduct.description}
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  addToCart(recommendedProduct, "100ml", 1);
                }}
                className="w-full py-3 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag size={15} />
                <span>Add Prescribed Wash to Bag • ₹{recommendedProduct.price}</span>
              </button>

              <button
                onClick={() => navigate(`/product/${recommendedProduct.slug}`)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-primary hover:underline text-center"
              >
                Read Full Formula Details &amp; Clinical Studies →
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setCurrentStep(0);
                setAnswers({ skinType: "", concern: "", texture: "" });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary font-semibold"
            >
              <RotateCcw size={13} />
              <span>Retake Skin Consultation Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
