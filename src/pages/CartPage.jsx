import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/cartSlice';

const formatPrice = (amount, currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const currency = items[0]?.currency || 'USD';

  const subtotal = total;
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 5.99) : 0;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <main className="cart-page container">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-state__icon">
            <path
              d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
              strokeWidth="1.5"
            />
            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.5" />
            <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="1.5" />
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to get started.</p>
          <Link to="/" className="btn btn--primary">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page container">
      <div className="cart-page__header">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => dispatch(clearCart())}
        >
          Clear All
        </button>
      </div>

      <div className="cart-page__layout">
        <section className="cart-page__items" aria-label="Cart items">
          <div className="cart-table">
            <div className="cart-table__head">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {items.map((item) => (
              <div key={item.variantId} className="cart-table__row">
                <div className="cart-table__product">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="cart-table__image"
                    />
                  ) : (
                    <div className="cart-table__no-image" />
                  )}
                  <div>
                    <Link
                      to={`/product/${item.id.split('/').pop()}`}
                      className="cart-table__name"
                    >
                      {item.name}
                    </Link>
                    {item.variant && item.variant !== 'Default' && (
                      <p className="cart-table__variant">{item.variant}</p>
                    )}
                  </div>
                </div>

                <div className="cart-table__price">
                  {formatPrice(item.price, item.currency)}
                </div>

                <div className="cart-table__quantity">
                  <div className="quantity-control">
                    <button
                      className="quantity-control__btn"
                      onClick={() =>
                        dispatch(
                          updateQuantity({ variantId: item.variantId, quantity: item.quantity - 1 })
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity-control__value">{item.quantity}</span>
                    <button
                      className="quantity-control__btn"
                      onClick={() =>
                        dispatch(
                          updateQuantity({ variantId: item.variantId, quantity: item.quantity + 1 })
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-table__total">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </div>

                <div className="cart-table__remove">
                  <button
                    className="btn btn--ghost btn--icon"
                    onClick={() => dispatch(removeFromCart(item.variantId))}
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" />
                      <path
                        d="M19 6l-1 14H6L5 6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 6V4h6v2" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-page__continue">
            <Link to="/" className="btn btn--outline">
              ← Continue Shopping
            </Link>
          </div>
        </section>

        <aside className="cart-page__summary">
          <h2 className="cart-summary__title">Order Summary</h2>

          <div className="cart-summary__lines">
            <div className="cart-summary__line">
              <span>Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="cart-summary__line">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="cart-summary__free">Free</span>
                ) : (
                  formatPrice(shipping, currency)
                )}
              </span>
            </div>
            <div className="cart-summary__line">
              <span>Estimated Tax (8%)</span>
              <span>{formatPrice(tax, currency)}</span>
            </div>
          </div>

          {shipping > 0 && (
            <p className="cart-summary__free-shipping-note">
              Add {formatPrice(50 - subtotal, currency)} more for free shipping!
            </p>
          )}

          <div className="cart-summary__total">
            <span>Total</span>
            <span>{formatPrice(orderTotal, currency)}</span>
          </div>

          <button className="btn btn--primary btn--full btn--lg">
            Proceed to Checkout
          </button>

          <div className="cart-summary__trust">
            <span>🔒 Secure checkout</span>
            <span>🚚 Fast delivery</span>
            <span>↩️ Easy returns</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
