import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter, Link } from "../router/RouterContext";
import { Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, Tag } from "lucide-react";

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeGiftUnlocked,
    amountNeededForGift,
    freeShippingThreshold,
    shippingFee,
  } = useCart();

  const { navigate } = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "BOTANICAL15" || promoCode.trim().toUpperCase() === "CAUSIVA15") {
      setDiscountPercent(15);
      setPromoSuccess("15% Botanical Ritual Discount applied!");
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try using 'BOTANICAL15' for 15% off.");
      setPromoSuccess("");
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount + shippingFee;
  const progressPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="pt-0 md:pt-36 pb-24 max-w-container-max mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-secondary mx-auto">
          <span className="material-symbols-outlined text-4xl">local_mall</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-primary">Your Ritual Bag is Empty</h1>
          <p className="text-xs text-secondary max-w-md mx-auto">
            You haven't added any cold-pressed botanical face washes to your sanctuary yet.
          </p>
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="px-8 py-3.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-md"
        >
          Explore Cleansers
        </button>
      </div>
    );
  }

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-container-max mx-auto px-4 md:px-8 lg:px-8 space-y-8">
      {/* Breadcrumb & Title */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs text-secondary font-medium uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-primary font-bold">Shopping Bag</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Your Botanical Ritual Bag
          </h1>
          <span className="text-xs text-secondary font-medium">
            {items.reduce((s, i) => s + i.quantity, 0)} consciously selected formulas in your sanctum
          </span>
        </div>
      </div>

      {/* Free Shipping & Gift Milestone Bar */}
      <div className="bg-surface-container-low rounded-2xl p-5 md:p-6 border border-outline-variant/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-xl">spa</span>
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-primary">
                {freeGiftUnlocked ? (
                  <span>
                    🎉 You unlocked <span className="text-tertiary-container font-bold">FREE Express Shipping</span> &amp; Complimentary Bamboo Muslin Cloth!
                  </span>
                ) : (
                  <span>
                    You are <strong className="text-tertiary-container font-bold">₹{amountNeededForGift} away</strong> from FREE Express Shipping &amp; Complimentary Bamboo Cloth!
                  </span>
                )}
              </p>
              <p className="text-xs text-secondary">
                Threshold unlocks handcrafted bamboo weave &amp; climate-neutral priority dispatch.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary bg-surface-container-highest px-3 py-1 rounded-full self-start sm:self-auto">
            {progressPercentage}% Complete
          </span>
        </div>
        <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Grid: Items List & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 divide-y divide-outline-variant/20 overflow-hidden shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-outline-variant/30 shrink-0 cursor-pointer"
                  onClick={() => navigate(`/product/${item.slug}`)}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => navigate(`/product/${item.slug}`)}
                      className="font-serif text-sm font-bold text-primary hover:underline cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-secondary hover:text-error transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-secondary font-medium">
                    Volume: {item.volume} • Cold-Pressed Pure Extract
                  </p>
                  <p className="text-xs font-bold text-primary">₹{item.price} each</p>
                </div>

                {/* Quantity & Item Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                  <div className="flex items-center border border-outline-variant/40 rounded-full bg-surface-container-low px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 text-secondary hover:text-primary font-bold text-xs"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2 text-xs font-bold text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 text-secondary hover:text-primary font-bold text-xs"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="font-serif text-sm font-bold text-primary min-w-[70px] text-right">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Complimentary Item Banner if unlocked */}
          {freeGiftUnlocked && (
            <div className="p-4 rounded-xl bg-secondary-container/40 border border-secondary-container flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-primary shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Complimentary Bamboo Muslin Cloth</h4>
                  <p className="text-secondary">Eco-friendly gentle cleansing companion • Handwoven</p>
                </div>
              </div>
              <span className="font-bold text-xs bg-primary text-on-primary px-2.5 py-1 rounded-full">
                FREE GIFT
              </span>
            </div>
          )}
        </div>

        {/* Right: Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 space-y-5 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-primary border-b border-outline-variant/30 pb-3">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                <Tag size={12} />
                <span>Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. BOTANICAL15"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase hover:bg-primary-container transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && <p className="text-[11px] text-green-700 font-semibold">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] text-error font-medium">{promoError}</p>}
            </form>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-secondary border-t border-outline-variant/30 pt-4">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-primary">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-700 font-semibold">
                  <span>Ritual Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Express Courier Shipping</span>
                <span className="font-semibold text-primary">
                  {freeGiftUnlocked ? "FREE" : "₹60"}
                </span>
              </div>
              {freeGiftUnlocked && (
                <div className="flex items-center justify-between text-primary font-medium">
                  <span>Bamboo Muslin Cleansing Cloth</span>
                  <span className="font-bold text-green-700">₹0</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-bold text-primary pt-3 border-t border-outline-variant/30">
                <span>Estimated Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-4 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-secondary">
              <ShieldCheck size={14} className="text-primary" />
              <span>Guaranteed safe checkout & climate-neutral transit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
