import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { Provider } from 'react-redux';
import client from './apollo/client';
import store from './store/cartStore';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import './main.css';

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
