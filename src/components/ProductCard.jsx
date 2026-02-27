import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const formatPrice = (cents, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(cents / 100);
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { productId, productName, slug, productAsset, priceWithTax, currencyCode } = product;

  const minPrice = priceWithTax?.min ?? priceWithTax?.value ?? null;
  const maxPrice = priceWithTax?.max ?? null;
  const currency = currencyCode || 'USD';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        id: productId,
        variantId: `${productId}-default`,
        name: productName,
        price: minPrice != null ? minPrice / 100 : 0,
        currency,
        thumbnail: productAsset?.preview || null,
        variant: 'Default',
      })
    );
  };

  return (
    <Link to={`/product/${slug}`} className="product-card">
      <div className="product-card__image-wrap">
        {productAsset?.preview ? (
          <img
            src={`${productAsset.preview}?w=400&h=400`}
            alt={productName}
            className="product-card__image"
            loading="lazy"
          />
        ) : (
          <div className="product-card__no-image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
              <path d="m21 15-5-5L5 21" strokeWidth="1.5" />
            </svg>
          </div>
        )}
        <button
          className="product-card__quick-add"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${productName} to cart`}
        >
          + Add to Cart
        </button>
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">{productName}</h3>
        <div className="product-card__price">
          {minPrice != null ? (
            <>
              <span className="product-card__price--current">{formatPrice(minPrice, currency)}</span>
              {maxPrice && maxPrice !== minPrice && (
                <span className="product-card__price--range">
                  &nbsp;– {formatPrice(maxPrice, currency)}
                </span>
              )}
            </>
          ) : (
            <span className="product-card__price--na">Price unavailable</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
