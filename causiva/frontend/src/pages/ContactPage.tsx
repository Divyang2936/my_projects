import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", concern: "General Consultation", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-4xl mx-auto px-4 md:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Apothecary Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Connect With Our Herbalists
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
          Need guidance choosing the right cold-pressed wash for your skin barrier? Our botanists are here to guide your ritual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left: Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <h3 className="font-serif text-base font-bold text-primary">Sanctum Headquarters</h3>
            <div className="space-y-3 text-xs text-on-surface-variant">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Causiva Botanicals Workshop<br />
                  Plot 14, Koramangala Natural Park Way<br />
                  Bengaluru, Karnataka 560034, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <span>herbalist@causiva.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <span>+91 (800) 722-4822 (Mon-Sat, 9am-7pm)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-secondary-container/30 border border-secondary-container space-y-2">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Fast Turnaround</h4>
            <p className="text-xs text-secondary leading-relaxed">
              Every inquiry is reviewed directly by a licensed natural skincare formulator within 12 business hours.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="md:col-span-7 bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 size={40} className="text-primary mx-auto" />
              <h3 className="font-serif text-xl font-bold text-primary">Message Received!</h3>
              <p className="text-xs text-secondary max-w-xs mx-auto">
                Thank you for reaching out. One of our botanical formulators will email you within 12 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-secondary uppercase block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Radhika Sen"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>

              <div>
                <label className="font-bold text-secondary uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. radhika@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>

              <div>
                <label className="font-bold text-secondary uppercase block mb-1">Inquiry Topic</label>
                <select
                  value={formData.concern}
                  onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                >
                  <option>Skin Routine Consultation</option>
                  <option>Order &amp; Delivery Tracking</option>
                  <option>Wholesale &amp; Retail Inquiries</option>
                  <option>Ingredient Sensitivity Check</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-secondary uppercase block mb-1">Your Message or Skin Concern</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your current skin state or any questions regarding our cold-pressed cleansers..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Send to Herbalist</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
