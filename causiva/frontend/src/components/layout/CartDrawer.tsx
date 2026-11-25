import React from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "../../router/RouterContext";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeGiftUnlocked,
    amountNeededForGift,
    freeShippingThreshold,
    total,
  } = useCart();

  const { navigate } = useRouter();

  if (!isCartOpen) return null;

  const progressPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col border-l border-outline-variant/30">
          {/* Header */}
          <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              <h2 className="font-serif text-lg font-bold text-primary">
                Your Botanical Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping & Gift Milestone Progress Bar */}
          <div className="bg-surface-container-low p-4 border-b border-outline-variant/30">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles size={14} className="text-tertiary-container" />
                {freeGiftUnlocked ? (
                  <span className="text-primary font-bold">
                    Unlocked: Complimentary Bamboo Muslin Cloth + Free Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-tertiary-container">₹{amountNeededForGift}</strong> for Free Shipping & Cloth
                  </span>
                )}
              </span>
              <span className="text-secondary">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                  <ShoppingBag size={30} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-primary">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-secondary max-w-xs">
                    Explore our clean, cold-pressed face washes and begin your 7-day botanical transformation.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/shop");
                  }}
                  className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors"
                >
                  Shop Best Sellers
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-surface border border-outline-variant/30"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-outline-variant/30 shrink-0 cursor-pointer"
                    onClick={() => {
                      closeCart();
                      navigate(`/product/${item.slug}`);
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            closeCart();
                            navigate(`/product/${item.slug}`);
                          }}
                          className="font-serif text-xs font-bold text-primary hover:underline truncate cursor-pointer"
                        >
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-secondary hover:text-error transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-[11px] text-secondary font-medium block">
                        Volume: {item.volume}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-outline-variant/40 rounded-full bg-surface-container-lowest">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-primary transition-colors text-secondary"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-primary transition-colors text-secondary"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-outline-variant/30 bg-surface-container-low space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-primary">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-secondary">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-primary">
                    {freeGiftUnlocked ? "FREE" : "₹60"}
                  </span>
                </div>
                {freeGiftUnlocked && (
                  <div className="flex items-center justify-between text-primary font-medium text-[11px]">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} className="text-tertiary-container" />
                      Complimentary Bamboo Muslin Cloth
                    </span>
                    <span className="font-bold text-secondary-container bg-primary px-2 py-0.5 rounded text-[10px]">
                      FREE
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-bold text-primary pt-2 border-t border-outline-variant/30">
                  <span>Estimated Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/checkout");
                  }}
                  className="w-full py-3.5 px-4 rounded-full bg-primary text-on-primary hover:bg-primary-container text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    navigate("/cart");
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-variant text-xs font-semibold tracking-wide transition-colors text-center border border-outline-variant/40"
                >
                  View Full Ritual Bag Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
