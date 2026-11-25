import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, volume?: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  freeGiftUnlocked: boolean;
  amountNeededForGift: number;
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "causiva_cart_items";
const FREE_SHIPPING_THRESHOLD = 499;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial cart items matching screenshots
    return [
      {
        id: "prod-vit-c-100ml",
        productId: "prod-vit-c",
        name: "Vitamin C Brightening Face Wash",
        slug: "vitamin-c-face-wash",
        price: 449,
        volume: "100ml",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJWOylq-xi7HZJkyLvc13vwF6UwxODmk38HEPTxi3UtTsiVTPSTqlObfrmC8YaDIedTvhLgKGybnm1ygqcCYBFJ8lslC2T172UTb8itU7KQP0RTcpPQzu4rYEmLeUOLSrCpxsJLrCXAMHPVR8YiezSfgZ_o5KGhGeu2Rv56RkJ2pNsct3ux5TvHq9EJmueR0GSWt3QC5jejR_VafNJ8WM_YFkKT7Pqm4AnsyhugRtqm3nLMAymMFKB",
        quantity: 1,
      },
      {
        id: "prod-cuc-100ml",
        productId: "prod-cuc",
        name: "Cucumber Hydrating Face Wash",
        slug: "cucumber-face-wash",
        price: 399,
        volume: "100ml",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu1yRpC98At6Wy6DQOXrEqrcrrbhDz1f3sJ8NOg4MMaqWNyvGXlyWR19rY2LMFHjVTP-UMM4V2fQ0MumY0Xg2aRX2P5mOmWTJNeSGHmv4N1roNDftxUEfCDaWb4d2-w-813nAdjQsCOIfx-maEWfsp4MAFrGc-huMuCc6KEgU3ojdIPdlWrimq1GRY4rxp94s__mfcmf6IS-d_XBtx6L67976fsXLULtlImnhYxf-bTxIWqYJBnh18",
        quantity: 1,
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product: Product, volume: string = "100ml", quantity: number = 1) => {
    const itemPrice = volume === "200ml" ? Math.round(product.price * 1.7) : product.price;
    const itemId = `${product.id}-${volume}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: itemPrice,
          volume,
          image: product.image,
          quantity,
        },
      ];
    });

    showToast(`Added "${product.name}" to your bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeGiftUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal > 0 && !freeGiftUnlocked ? 60 : 0;
  const total = subtotal + shippingFee;
  const amountNeededForGift = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shippingFee,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeGiftUnlocked,
        amountNeededForGift,
        totalItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
