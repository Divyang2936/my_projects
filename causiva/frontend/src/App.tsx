import React from "react";
import { RouterProvider } from "./router/RouterContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { Toast } from "./components/ui/Toast";
import { AppRouter } from "./router/AppRouter";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

export function App() {
  return (
    <RouterProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="min-h-screen flex flex-col bg-surface text-on-surface">
                <Navbar />
                <main className="flex-1"><AppRouter /></main>
                <Footer /><CartDrawer /><Toast />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </RouterProvider>
  );
}

export default App;
