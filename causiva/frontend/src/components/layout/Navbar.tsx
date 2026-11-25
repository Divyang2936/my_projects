import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter, Link } from "../../router/RouterContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../hooks/useProducts";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Sparkles, Sun, Moon } from "lucide-react";

export const Navbar: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const { currentPath, navigate } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const products = useProducts();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCleansersOpen, setIsCleansersOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.concern.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.keyIngredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(35,61,46,0.04)] border-b border-outline-variant/30">
      {/* Announcement Bar */}
      <div className="bg-primary text-on-primary py-2 px-3 sm:px-4 text-center text-[10px] sm:text-[11px] font-medium tracking-[0.1em] sm:tracking-widest uppercase flex items-center justify-center gap-1.5 sm:gap-2 leading-4">
        <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-tertiary-fixed shrink-0">eco</span>
        <span>COMPLIMENTARY BOTANICAL CLEANSING CLOTH WITH ORDERS OVER ₹499 <span className="hidden sm:inline">| </span><span className="block sm:inline">FREE EXPRESS SHIPPING</span></span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-container-max mx-auto px-4 md:px-8 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-on-surface hover:text-primary rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[18px]">spa</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary">
                Causiva
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-7">
          <Link
            href="/"
            className={`text-[13px] uppercase tracking-wider font-semibold transition-colors py-2 ${
              isActive("/")
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Home
          </Link>

          <Link
            href="/shop"
            className={`text-[13px] uppercase tracking-wider font-semibold transition-colors py-2 ${
              isActive("/shop")
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Shop All
          </Link>

          {/* Cleansers Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCleansersOpen(true)}
            onMouseLeave={() => setIsCleansersOpen(false)}
          >
            <button
              onClick={() => navigate("/shop")}
              className={`text-[13px] uppercase tracking-wider font-semibold transition-colors py-2 inline-flex items-center gap-1 ${
                currentPath.startsWith("/product")
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span>Cleansers</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isCleansersOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isCleansersOpen && (
              <div className="absolute left-0 top-full pt-2 w-80 z-50">
                <div className="bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-2.5 space-y-1">
                  {products.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.slug}`}
                      onClick={() => setIsCleansersOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-md object-cover border border-outline-variant/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary group-hover:text-primary-container truncate font-serif">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-secondary truncate">
                          {prod.tagline}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary">₹{prod.price}</span>
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-outline-variant/30">
                    <Link
                      href="/shop"
                      onClick={() => setIsCleansersOpen(false)}
                      className="block text-center text-xs font-bold text-primary py-1.5 hover:underline"
                    >
                      View All 6 Cold-Pressed Formulas →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`text-[13px] uppercase tracking-wider font-semibold transition-colors py-2 ${
              isActive("/about")
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            About Us
          </Link>

          <Link
            href="/skin-quiz"
            className={`text-[13px] uppercase tracking-wider font-semibold transition-colors py-2 inline-flex items-center gap-1.5 ${
              isActive("/skin-quiz")
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Sparkles size={14} className="text-secondary" />
            <span>Skin Quiz</span>
          </Link>

          <Link
            href="/journal"
            className={`text-[13px] uppercase tracking-wider font-semibold transition-colors py-2 ${
              isActive("/journal")
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Journal
          </Link>
        </nav>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Live Search Bar */}
          <div ref={searchRef} className="relative hidden sm:block">
            <div className="flex items-center bg-surface-container-low rounded-full px-3.5 py-1.5 ring-1 ring-outline-variant/30 focus-within:ring-primary focus-within:bg-surface-container-lowest transition-all">
              <Search size={16} className="text-secondary mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search botanicals..."
                className="bg-transparent border-none text-xs text-on-surface placeholder:text-outline focus:outline-none w-32 md:w-44 lg:w-52"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-secondary hover:text-primary text-xs ml-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Popup */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-3 z-50 space-y-2">
                <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Matching Formulas ({searchResults.length})
                </p>
                {searchResults.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-md object-cover border border-outline-variant/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary truncate font-serif">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-secondary truncate">
                        {prod.tagline}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary">₹{prod.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low"
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Mobile Search */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low"
            title="Search botanicals"
            aria-label="Search botanicals"
          >
            <Search size={20} />
          </button>

          {/* Wishlist Link */}
          <Link
            href="/rewards"
            className="hidden p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low sm:block"
            title="Rewards & Wishlist"
          >
            <Heart size={20} />
          </Link>

          {/* Cart Icon & Badge */}
          <button
            onClick={openCart}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors relative flex items-center justify-center rounded-full hover:bg-surface-container-low"
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Account Profile */}
          <Link
            href={user ? "/account" : "/login"}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low"
            title={user ? "View your account" : "Log in or create an account"}
          >
            <User size={20} />
          </Link>
        </div>
      </div>

      {/* Mobile Search Panel */}
      {isSearchOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-full z-50 border-b border-outline-variant/40 bg-surface-container-lowest p-4 shadow-lg">
          <div className="flex items-center rounded-full bg-surface-container-low px-4 py-2.5 ring-1 ring-outline-variant/30 focus-within:ring-primary">
            <Search size={17} className="mr-2 shrink-0 text-secondary" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search botanicals..."
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              className="rounded-full p-1 text-secondary hover:text-primary"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-3 max-h-[min(60vh,24rem)] overflow-y-auto space-y-1">
              {searchResults.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    navigate(`/product/${prod.slug}`);
                  }}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-surface-container-low"
                >
                  <img src={prod.image} alt={prod.name} className="h-10 w-10 shrink-0 rounded-md object-cover border border-outline-variant/20" />
                  <span className="min-w-0 flex-1 truncate font-serif text-sm font-semibold text-primary">{prod.name}</span>
                  <span className="text-xs font-bold text-primary">₹{prod.price}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden max-h-[calc(100vh-7rem)] overflow-y-auto bg-surface-container-lowest border-b border-outline-variant/40 px-4 sm:px-6 py-5 space-y-4">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2 border-b border-outline-variant/20"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2 border-b border-outline-variant/20"
            >
              Shop All Cleansers
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2 border-b border-outline-variant/20"
            >
              About Our Sanctuary
            </Link>
            <Link
              href="/skin-quiz"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2 border-b border-outline-variant/20 flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Skin Consultation Quiz</span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2 border-b border-outline-variant/20"
            >
              Shopping Bag ({totalItems})
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2 border-b border-outline-variant/20"
            >
              Log In / Create Account
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2"
            >
              Apothecary FAQs
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
