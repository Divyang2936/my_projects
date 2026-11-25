import React, { useState } from "react";
import { Sparkles, Gift, Share2, Copy, CheckCircle2, Star, Award } from "lucide-react";
import { useCart } from "../context/CartContext";

export const RewardsPage: React.FC = () => {
  const { showToast } = useCart();
  const [copied, setCopied] = useState(false);

  const referralLink = "https://causiva.com/invite/PRIYA240";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-4xl mx-auto px-4 md:px-8 space-y-12">
      {/* Rewards Header */}
      <div className="bg-primary text-on-primary rounded-3xl p-8 md:p-12 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
          <Award size={14} />
          <span>The Botanical Sanctuary Club</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
          Your Rewards Sanctum
        </h1>
        <p className="text-xs sm:text-sm text-primary-fixed-dim max-w-lg mx-auto">
          Earn mindful points with every conscious botanical choice. Redeem for complimentary formulations, artisanal tools, and exclusive harvests.
        </p>

        {/* Current Balance */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="p-4 rounded-2xl bg-primary-container border border-primary-container/80 min-w-[180px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-fixed">Available Balance</span>
            <p className="font-serif text-3xl font-bold text-on-primary mt-1">240 Pts</p>
          </div>
          <div className="p-4 rounded-2xl bg-primary-container border border-primary-container/80 min-w-[180px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-fixed">Current Tier</span>
            <p className="font-serif text-xl font-bold text-secondary-fixed mt-1">Botanical Patron</p>
          </div>
        </div>
      </div>

      {/* Ways to Earn Points */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-primary">How to Earn Points</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <span className="text-lg font-bold text-primary font-serif">+1 Pt / ₹10</span>
            <h4 className="text-xs font-bold text-primary">Place an Order</h4>
            <p className="text-[11px] text-secondary">Earn points automatically with every cold-pressed cleanser purchase.</p>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <span className="text-lg font-bold text-primary font-serif">+50 Pts</span>
            <h4 className="text-xs font-bold text-primary">Take Skin Quiz</h4>
            <p className="text-[11px] text-secondary">Complete our apothecary consultation to find your ideal match.</p>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <span className="text-lg font-bold text-primary font-serif">+30 Pts</span>
            <h4 className="text-xs font-bold text-primary">Review a Formula</h4>
            <p className="text-[11px] text-secondary">Share your 7-day before-and-after skin journey with our community.</p>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <span className="text-lg font-bold text-primary font-serif">+100 Pts</span>
            <h4 className="text-xs font-bold text-primary">Refer a Companion</h4>
            <p className="text-[11px] text-secondary">Give ₹150 off, get 100 points when your friend completes their ritual.</p>
          </div>
        </div>
      </div>

      {/* Referral Link Strip */}
      <div className="p-6 rounded-2xl bg-secondary-container/30 border border-secondary-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-base font-bold text-primary">Share the Botanical Secret</h3>
          <p className="text-xs text-secondary">Your friends get ₹150 off their first cold-pressed wash order.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-mono text-primary select-all w-full sm:w-60"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
          >
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
