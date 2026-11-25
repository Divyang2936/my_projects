import React from "react";
import { useRouter } from "./RouterContext";
import { HomePage } from "../pages/HomePage";
import { ShopPage } from "../pages/ShopPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmedPage } from "../pages/OrderConfirmedPage";
import { TrackOrderPage } from "../pages/TrackOrderPage";
import { SkinQuizPage } from "../pages/SkinQuizPage";
import { AboutPage } from "../pages/AboutPage";
import { AccountPage } from "../pages/AccountPage";
import { RewardsPage } from "../pages/RewardsPage";
import { JournalPage } from "../pages/JournalPage";
import { ContactPage } from "../pages/ContactPage";
import { FaqPage } from "../pages/FaqPage";
import { PolicyPage } from "../pages/PolicyPage";
import { LoginPage } from "../pages/LoginPage";
import { CreateAccountPage } from "../pages/CreateAccountPage";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

export const AppRouter: React.FC = () => {
  const { currentPath } = useRouter();
  const { user, loading } = useAuth();

  // Normalize path by stripping query params and trailing slash
  const path = currentPath.split("?")[0].replace(/\/$/, "") || "/";
  const protectedPath = ["/checkout", "/account", "/rewards", "/track-order"].includes(path);
  
  const renderPage = () => {
    if (loading && protectedPath) return <div className="p-12 text-center text-sm text-secondary">Loading your account...</div>;
    if (!loading && protectedPath && !user) return <LoginPage />;

    // Product detail dynamic route: /product/:slug
    if (path.startsWith("/product/")) {
      const slug = path.replace("/product/", "");
      return <ProductDetailPage slug={slug} />;
    }

    switch (path) {
      case "/":
        return <HomePage />;
      case "/shop":
        return <ShopPage />;
      case "/cart":
        return <CartPage />;
      case "/checkout":
        return <CheckoutPage />;
      case "/order-confirmed":
        return <OrderConfirmedPage />;
      case "/track-order":
        return <TrackOrderPage />;
      case "/skin-quiz":
        return <SkinQuizPage />;
      case "/about":
        return <AboutPage />;
      case "/account":
        return <AccountPage />;
      case "/login":
        return <LoginPage />;
      case "/create-account":
        return <CreateAccountPage />;
      case "/rewards":
        return <RewardsPage />;
      case "/journal":
        return <JournalPage />;
      case "/contact":
        return <ContactPage />;
      case "/faq":
        return <FaqPage />;
      case "/privacy":
      case "/terms":
      case "/shipping-policy":
      case "/returns-policy":
      case "/cookies":
        return <PolicyPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full flex flex-col flex-1"
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
};
