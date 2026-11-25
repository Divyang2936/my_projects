import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter, Link } from "../router/RouterContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { useProducts } from "../hooks/useProducts";
import { ShieldCheck, Lock, CreditCard, Smartphone, Banknote, ArrowLeft, CheckCircle2 } from "lucide-react";

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { navigate } = useRouter();
  const { user } = useAuth();
  const products = useProducts();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [formData, setFormData] = useState({
    email: "priya.sharma@example.com",
    firstName: "Priya",
    lastName: "Sharma",
    address: "Flat 402, Green Meadows Residency",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560034",
    phone: "+91 98765 43210",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const productBySlug = new Map(products.map((product) => [product.slug, product]));
      const order = await api.createOrder({
        items: items.map((item) => ({ productId: productBySlug.get(item.slug)?.id, volume: item.volume, quantity: item.quantity })),
        paymentMethod,
        ...formData,
      }, idempotencyKey);
      clearCart();
      navigate(`/order-confirmed?orderId=${order.orderNumber}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-0 md:pt-36 pb-24 max-w-container-max mx-auto px-4 text-center space-y-4">
        <h1 className="font-serif text-2xl font-bold text-primary">No Items to Checkout</h1>
        <p className="text-xs text-secondary">Your shopping bag is empty.</p>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-container-max mx-auto px-4 md:px-8 lg:px-8 space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <Link href="/cart" className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary font-semibold">
          <ArrowLeft size={14} />
          <span>Return to Bag</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-primary font-bold">
          <Lock size={14} />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Details & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-primary">
              1. Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-primary">
              2. Shipping Sanctum Address
            </h2>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                  Street Address & Apartment
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-secondary uppercase block mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-primary">
              3. Payment Selection
            </h2>
            <div className="space-y-2.5">
              <label
                onClick={() => setPaymentMethod("upi")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "upi"
                    ? "bg-secondary-container/20 border-primary shadow-sm"
                    : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className="text-primary" />
                  <div>
                    <h4 className="text-xs font-bold text-primary">UPI / QR Code / GPay / PhonePe</h4>
                    <p className="text-[11px] text-secondary">Instant zero-fee payment confirmation</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="accent-primary"
                />
              </label>

              <label
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "bg-secondary-container/20 border-primary shadow-sm"
                    : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-primary" />
                  <div>
                    <h4 className="text-xs font-bold text-primary">Credit / Debit Card</h4>
                    <p className="text-[11px] text-secondary">Visa, MasterCard, RuPay, Amex</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-primary"
                />
              </label>

              <label
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "bg-secondary-container/20 border-primary shadow-sm"
                    : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote size={20} className="text-primary" />
                  <div>
                    <h4 className="text-xs font-bold text-primary">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-secondary">Pay upon arrival at your doorstep</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-primary"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            {submitting ? "Placing order..." : `Complete Order • ₹${total}`}
          </button>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 space-y-5">
          <h3 className="font-serif text-base font-bold text-primary border-b border-outline-variant/30 pb-3">
            In Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})
          </h3>

          <div className="divide-y divide-outline-variant/20 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-outline-variant/30" />
                  <div className="min-w-0">
                    <p className="font-bold text-primary truncate font-serif">{item.name}</p>
                    <p className="text-[11px] text-secondary">Qty: {item.quantity} • {item.volume}</p>
                  </div>
                </div>
                <span className="font-bold text-primary shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/30 pt-4 space-y-2 text-xs text-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-primary">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-semibold text-primary">{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-outline-variant/30">
              <span>Total Payable</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
