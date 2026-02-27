import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart, selectCartCount, selectIsCartOpen } from '../store/cartSlice';
import CartDrawer from './CartDrawer';
import SearchBar from './SearchBar';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const isCartOpen = useSelector(selectIsCartOpen);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__container">
          <Link to="/" className="navbar__logo">
            <svg viewBox="0 0 32 32" fill="currentColor" className="navbar__logo-icon">
              <path d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2zm-2 19.5v-3h4v3h-4zm4-5h-4c0-3.25 4-3.5 4-6 0-1.1-.9-2-2-2s-2 .9-2 2h-4c0-3.31 2.69-6 6-6s6 2.69 6 6c0 3.5-4 3.75-4 6z" />
            </svg>
            <span>ShopGraphQL</span>
          </Link>

          <div className="navbar__search">
            <SearchBar onSearch={handleSearch} />
          </div>

          <nav className="navbar__actions">
            <Link to="/" className="navbar__link">
              Products
            </Link>
            <Link to="/cart" className="navbar__link">
              Cart
            </Link>
            <button
              className="navbar__cart-btn"
              onClick={() => dispatch(toggleCart())}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                  strokeWidth="2"
                />
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="2" />
              </svg>
              {cartCount > 0 && (
                <span className="navbar__cart-badge" aria-label={`${cartCount} items in cart`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {isCartOpen && <CartDrawer />}
    </>
  );
};

export default Navbar;
