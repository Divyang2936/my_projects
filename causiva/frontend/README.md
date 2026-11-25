# Causiva — React storefront

A clean, responsive Causiva skincare storefront built with React + Vite. The six face-wash products use the product photos supplied for this project.

## Included
- Causiva branded storefront UI
- 6 products: Vitamin C, Cucumber, De-Tan, 2% Niacinamide, 2% Salicylic Acid, Ubtan
- Product detail, shop, cart, checkout and supporting pages from the supplied starter site
- Framer Motion animations for hero/product interactions and scroll reveals
- Product images stored locally in `public/products`
- Responsive mobile navigation and cart flow

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Backend-ready

The current storefront keeps the existing frontend cart flow. Product/order API integration can be connected next through a Spring Boot backend without changing the product UI structure.
