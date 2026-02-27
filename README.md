# ShopGraphQL — React Online Shopping App

A modern, fully-featured online shopping app built with React, GraphQL, and Redux.

## Tech Stack

- **React 18** — UI framework with hooks throughout
- **Vite 5** — fast build tool and dev server
- **Apollo Client v4** — GraphQL data fetching (`useQuery`)
- **Redux Toolkit** — shopping cart state management
- **React Router DOM v6** — client-side routing
- **GraphQL API** — [Vendure Demo Shop API](https://demo.vendure.io/shop-api) (public, no auth required)

## Features

- Browse 50+ real products across categories (Electronics, Furniture, Sports, Footwear, etc.)
- Filter by collection / category
- Search products with debounced input
- Sort by name or price
- Paginated product grid
- Product detail page with image gallery and variant selection
- Add to cart — badge updates without interrupting browsing
- Cart drawer (slide-in panel) and full cart page
- Quantity controls and order summary with shipping and tax estimate
- Responsive design (mobile, tablet, desktop)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
  apollo/
    client.js             # Apollo Client → Vendure Shop API
  graphql/
    queries.js            # SEARCH_PRODUCTS, GET_PRODUCT, GET_COLLECTIONS
  store/
    index.js              # Redux store
    cartSlice.js          # Cart reducer: add / remove / updateQuantity / clearCart
  components/
    Navbar.jsx            # Sticky header with cart badge
    SearchBar.jsx         # Debounced search with URL sync
    ProductCard.jsx       # Grid card with quick-add
    CartDrawer.jsx        # Slide-in cart panel
    CategoryFilter.jsx    # Collection pill filters
    LoadingSpinner.jsx    # Reusable spinner
  pages/
    HomePage.jsx          # Product grid, filters, search, pagination
    ProductDetailPage.jsx # Image gallery, variant selector, add to cart
    CartPage.jsx          # Full cart table, quantity controls, order summary
  App.jsx                 # Providers (Apollo, Redux, Router) + routes
  main.jsx
```

## GraphQL API

All data is fetched from the **Vendure Demo Shop API**:

```
https://demo.vendure.io/shop-api
```

Key queries used:

| Query | Purpose |
|---|---|
| `search` | Product listing, search, and collection filtering |
| `product(slug)` | Single product detail |
| `collections` | Category filter pills |
