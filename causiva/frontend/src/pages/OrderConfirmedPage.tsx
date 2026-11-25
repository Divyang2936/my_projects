import React from "react";
import { useRouter, Link } from "../router/RouterContext";
import { CheckCircle2, Package, Truck, Sparkles, ArrowRight } from "lucide-react";

export const OrderConfirmedPage: React.FC = () => {
  const { navigate } = useRouter();
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId") || "CAUSIVA-892341";

  return (
    <div className="pt-0 md:pt-36 pb-24 max-w-2xl mx-auto px-4 text-center space-y-8">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 size={42} className="text-primary" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Sacred Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Your Botanical Ritual is on Its Way!
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto leading-relaxed">
          Thank you for choosing conscious cold-pressed skincare. Your order is being gently formulated and packed in 100% recyclable amber glass.
        </p>
      </div>

      {/* Order Badge */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 max-w-md mx-auto text-left shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <span className="text-xs text-secondary font-medium">Order Number</span>
          <span className="font-mono text-xs font-bold text-primary">{orderId}</span>
        </div>
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <span className="text-xs text-secondary font-medium">Estimated Arrival</span>
          <span className="text-xs font-bold text-primary">In 2 - 3 Business Days</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">Dispatch Method</span>
          <span className="text-xs font-bold text-primary">Zero-Carbon Express Courier</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate(`/track-order?orderId=${orderId}`)}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Truck size={16} />
          <span>Track Delivery Status</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-variant text-xs font-semibold uppercase tracking-wider transition-colors border border-outline-variant/40"
        >
          Return to Sanctuary Home
        </Link>
      </div>
    </div>
  );
};
