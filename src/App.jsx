import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { Provider } from 'react-redux';
import client from './apollo/client';
import store from './store/cartStore';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import './main.css';

// Lazy load pages — each route becomes a separate JS chunk. User only downloads
// the code for the page they visit (e.g. /cart loads CartPage.js ~5KB, not the
// full 400KB bundle). Improves initial load time.
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            {/* Suspense required for lazy-loaded components. While a page chunk is
                being fetched (e.g. user navigates to /cart), React shows this
                fallback instead of a blank screen. */}
            <Suspense fallback={<LoadingSpinner fullPage />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </Suspense>
            <footer className="footer">
              <div className="container footer__inner">
                <p>© {new Date().getFullYear()} ShopGraphQL — Built with React, GraphQL &amp; Redux</p>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
