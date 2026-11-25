import React, { useEffect, useState } from "react";
import { Search, CheckCircle2, Truck, Package, Clock, ShieldCheck } from "lucide-react";
import { api, ApiOrder } from "../lib/api";

export const TrackOrderPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialOrderId = urlParams.get("orderId") || "CAUSIVA-892341";

  const [orderInput, setOrderInput] = useState(initialOrderId);
  const [tracked, setTracked] = useState(true);
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId === "CAUSIVA-892341") return;
    api.order(initialOrderId).then(setOrder).catch((e: Error) => setError(e.message));
  }, [initialOrderId]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTracked(true);
    setOrder(null);
    setError("");
    api.order(orderInput).then(setOrder).catch((e: Error) => setError(e.message));
  };

  const steps = [
    { title: "Order Placed & Confirmed", desc: "Received at our botanical workshop", done: true, time: "Yesterday, 10:15 AM" },
    { title: "Cold-Pressed Formulation & Quality Assurance", desc: "Batch tested for purity and sealed in amber glass", done: true, time: "Today, 08:30 AM" },
    { title: "Dispatched from Sanctuary Hub", desc: "Handed over to climate-neutral express logistics", done: true, time: "Today, 02:45 PM" },
    { title: "In Transit to Regional Center", desc: "Arriving at delivery facility", done: false, time: "Estimated Tomorrow morning" },
    { title: "Out for Delivery", desc: "Courier partner delivering to your doorstep", done: false, time: "Estimated Tomorrow by 4:00 PM" },
  ];

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-2xl mx-auto px-4 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Live Dispatch Concierge
        </span>
        <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">
          Track Your Botanical Order
        </h1>
        <p className="text-xs text-secondary">
          Enter your order identifier to see the live formulation and dispatch status.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleTrack} className="flex gap-2">
        <div className="flex-1 flex items-center bg-surface-container-low rounded-full px-4 py-2.5 border border-outline-variant/40 focus-within:ring-1 focus-within:ring-primary">
          <Search size={16} className="text-secondary mr-2" />
          <input
            type="text"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            placeholder="e.g. CAUSIVA-892341"
            className="bg-transparent border-none text-xs text-primary focus:outline-none w-full font-mono uppercase"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase rounded-full hover:bg-primary-container transition-colors shadow-sm"
        >
          Track
        </button>
      </form>

      {/* Progress Timeline */}
      {tracked && (
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 space-y-6 shadow-sm">
          {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-secondary">
                Tracking Details for
              </span>
              <h3 className="font-mono text-sm font-bold text-primary">{orderInput}</h3>
            </div>
            <span className="text-xs font-bold text-secondary-container bg-primary px-3 py-1 rounded-full">
              {order?.status || "In Transit"}
            </span>
          </div>

          <div className="space-y-6 relative pl-6 border-l-2 border-primary-fixed">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step.done
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-highest border border-outline-variant text-secondary"
                  }`}
                >
                  {step.done ? "✓" : idx + 1}
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${step.done ? "text-primary" : "text-secondary"}`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-secondary">{step.desc}</p>
                  <span className="text-[10px] text-secondary font-mono block mt-1">{step.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-secondary">
            <span>Carrier: BlueDart Express Priority</span>
            <span className="text-primary font-bold">Climate Neutral Delivery</span>
          </div>
        </div>
      )}
    </div>
  );
};
