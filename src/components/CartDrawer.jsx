import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  closeCart,
} from '../store/cartSlice';

const formatPrice = (amount, currency) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(
    amount
  );
};

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const currency = items[0]?.currency || 'USD';

  const handleClose = () => dispatch(closeCart());

  const handleViewCart = () => {
    handleClose();
    navigate('/cart');
  };

  const handleQuantityChange = (variantId, quantity) => {
    dispatch(updateQuantity({ variantId, quantity: parseInt(quantity, 10) }));
  };

  return (
    <>
      <div className="cart-drawer__overlay" onClick={handleClose} aria-hidden="true" />
      <aside className="cart-drawer" role="dialog" aria-label="Shopping cart">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Shopping Cart</h2>
          <button className="cart-drawer__close" onClick={handleClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="cart-drawer__empty-icon">
                <path
                  d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                  strokeWidth="1.5"
                />
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.5" />
                <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="1.5" />
              </svg>
              <p>Your cart is empty</p>
              <button className="btn btn--primary" onClick={handleClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={item.variantId} className="cart-item">
                  <div className="cart-item__image-wrap">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="cart-item__image" />
                    ) : (
                      <div className="cart-item__no-image" />
                    )}
                  </div>
                  <div className="cart-item__details">
                    <p className="cart-item__name">{item.name}</p>
                    {item.variant && item.variant !== 'Default' && (
                      <p className="cart-item__variant">{item.variant}</p>
                    )}
                    <p className="cart-item__price">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                    <div className="cart-item__controls">
                      <div className="quantity-control">
                        <button
                          className="quantity-control__btn"
                          onClick={() =>
                            handleQuantityChange(item.variantId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity-control__value">{item.quantity}</span>
                        <button
                          className="quantity-control__btn"
                          onClick={() =>
                            handleQuantityChange(item.variantId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-item__remove"
                        onClick={() => dispatch(removeFromCart(item.variantId))}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Total</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
            <button className="btn btn--primary btn--full" onClick={handleViewCart}>
              View Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
