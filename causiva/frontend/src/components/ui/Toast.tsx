import React from "react";
import { useCart } from "../../context/CartContext";
import { CheckCircle2 } from "lucide-react";

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-primary text-on-primary px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-primary-container text-xs font-semibold">
        <CheckCircle2 size={16} className="text-secondary-fixed shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
