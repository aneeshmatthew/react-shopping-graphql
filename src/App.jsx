import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { Provider } from 'react-redux';
import client from './apollo/client';
import store from './store';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import './index.css';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
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
