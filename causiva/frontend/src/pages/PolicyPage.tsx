import React from "react";
import { useRouter } from "../router/RouterContext";

export const PolicyPage: React.FC = () => {
  const { currentPath } = useRouter();

  let title = "Privacy Policy";
  let content = (
    <>
      <p>
        At Causiva, we respect your privacy and are committed to protecting the personal information you share with us. This policy outlines how we collect, handle, and safeguard your data.
      </p>
      <h3 className="font-serif text-base font-bold text-primary pt-2">1. Information We Collect</h3>
      <p>
        We collect personal details such as your name, shipping address, email, and phone number exclusively to fulfill your orders, deliver tracking updates, and provide personalized skin consultation recommendations.
      </p>
      <h3 className="font-serif text-base font-bold text-primary pt-2">2. Zero Third-Party Selling</h3>
      <p>
        We never sell, rent, or trade your personal data with third-party data brokers. Payment data is processed directly through PCI-compliant 256-bit encrypted gateways.
      </p>
    </>
  );

  if (currentPath === "/terms") {
    title = "Terms of Service";
    content = (
      <>
        <p>
          Welcome to Causiva. By accessing our apothecary sanctuary website and placing an order, you agree to abide by these Terms of Service.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">1. Authentic Formulations</h3>
        <p>
          All Causiva products are formulated with authentic, cold-pressed plant ingredients. While our products are dermatologically gentle, we recommend conducting a 24-hour patch test before full facial application.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">2. Pricing &amp; Orders</h3>
        <p>
          All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST taxes. We reserve the right to modify pricing or promotional discounts at any time without prior notice.
        </p>
      </>
    );
  } else if (currentPath === "/shipping-policy") {
    title = "Shipping & Zero-Carbon Packaging Policy";
    content = (
      <>
        <p>
          We pride ourselves on offering rapid, environmentally conscious shipping across India.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">1. Express Dispatch</h3>
        <p>
          Orders placed before 2:00 PM IST are dispatched on the same business day from our Bengaluru apothecary workshop. Standard delivery takes 2 to 4 business days.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">2. Free Shipping Threshold</h3>
        <p>
          Orders of ₹499 and above qualify for Free Express Shipping and a complimentary handwoven Bamboo Muslin Cloth. Orders below ₹499 incur a flat ₹60 shipping fee.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">3. Zero-Plastic Eco Cushioning</h3>
        <p>
          Every amber glass vessel is secured in corrugated Kraft paper honeycomb sleeves and sealed with water-activated starch paper tape—100% biodegradable and plastic-free.
        </p>
      </>
    );
  } else if (currentPath === "/returns-policy") {
    title = "30-Day Ritual Guarantee & Returns Policy";
    content = (
      <>
        <p>
          We stand by the transformative efficacy of our cold-pressed botanical formulations with our 30-Day Ritual Guarantee.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">1. 30-Day Efficacy Guarantee</h3>
        <p>
          If you use your Causiva cleanser for at least 7 days and do not observe an improvement in your skin radiance or comfort, reach out to our team within 30 days of receipt for an exchange or full refund.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">2. Damaged or Broken Glass</h3>
        <p>
          In the rare event that an amber glass bottle is damaged in transit, email a photograph to herbalist@causiva.com and we will courier a fresh replacement immediately at zero cost.
        </p>
      </>
    );
  } else if (currentPath === "/cookies") {
    title = "Cookie Policy";
    content = (
      <>
        <p>
          Our website uses functional cookies to remember items in your shopping bag, persist your session, and store your skin consultation quiz results.
        </p>
        <h3 className="font-serif text-base font-bold text-primary pt-2">1. Essential Cookies</h3>
        <p>
          These cookies are necessary for cart functionality, checkout security, and navigation state. You may disable cookies in your browser settings, though this may prevent shopping bag items from saving.
        </p>
      </>
    );
  }

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-3xl mx-auto px-4 space-y-8">
      <div className="space-y-2 border-b border-outline-variant/30 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Legal &amp; Sanctum Policies
        </span>
        <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-secondary">Last updated: February 2026</p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm space-y-4 text-xs text-on-surface-variant leading-relaxed">
        {content}
      </div>
    </div>
  );
};
