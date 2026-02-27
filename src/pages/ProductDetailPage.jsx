import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useDispatch } from 'react-redux';
import { GET_PRODUCT } from '../graphql/queries';
import { addToCart } from '../store/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const formatPrice = (cents, currency) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(cents / 100);

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { slug },
    onCompleted: (d) => {
      const variants = d?.product?.variants;
      if (variants?.length) {
        const first = variants.find((v) => v.stockLevel === 'IN_STOCK') || variants[0];
        setSelectedVariantId(first.id);
      }
    },
  });

  const product = data?.product;

  if (loading) return <LoadingSpinner fullPage />;

  if (error || !product) {
    return (
      <main className="container error-page">
        <h1>Product not found</h1>
        <p>{error?.message || 'This product could not be found.'}</p>
        <Link to="/" className="btn btn--primary">
          Back to Products
        </Link>
      </main>
    );
  }

  const { name, description, featuredAsset, assets, variants, collections } = product;

  const images =
    assets?.length
      ? assets.map((a) => a.preview)
      : featuredAsset
      ? [featuredAsset.preview]
      : [];

  const selectedVariant =
    variants?.find((v) => v.id === selectedVariantId) || variants?.[0];

  const price = selectedVariant?.price;
  const currency = selectedVariant?.currencyCode || 'USD';
  const isAvailable = selectedVariant?.stockLevel === 'IN_STOCK';

  const primaryCollection = collections?.[0];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    dispatch(
      addToCart({
        id: product.id,
        variantId: selectedVariant.id,
        name,
        price: price != null ? price / 100 : 0,
        currency,
        thumbnail: featuredAsset?.preview || null,
        variant: selectedVariant.name,
      })
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="product-detail container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb__link">
          Products
        </Link>
        {primaryCollection && (
          <>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <Link
              to={`/?collection=${primaryCollection.slug}`}
              className="breadcrumb__link"
            >
              {primaryCollection.name}
            </Link>
          </>
        )}
        <span className="breadcrumb__sep" aria-hidden="true">›</span>
        <span className="breadcrumb__current" aria-current="page">
          {name}
        </span>
      </nav>

      <div className="product-detail__grid">
        <div className="product-detail__gallery">
          <div className="product-detail__main-image-wrap">
            {images.length > 0 ? (
              <img
                src={`${images[activeImage]}?w=600&h=600`}
                alt={name}
                className="product-detail__main-image"
              />
            ) : (
              <div className="product-detail__no-image">No image available</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="product-detail__thumbnails">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  className={`product-detail__thumb ${
                    activeImage === idx ? 'product-detail__thumb--active' : ''
                  }`}
                  onClick={() => setActiveImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={`${url}?w=80&h=80`} alt={`${name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__info">
          {primaryCollection && (
            <span className="product-detail__category">{primaryCollection.name}</span>
          )}
          <h1 className="product-detail__name">{name}</h1>

          <div className="product-detail__price">
            {price != null ? formatPrice(price, currency) : 'Price unavailable'}
          </div>

          <div className={`product-detail__stock ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
            {isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
          </div>

          {variants && variants.length > 1 && (
            <div className="product-detail__variants">
              <p className="product-detail__variants-label">
                Variant: <strong>{selectedVariant?.name}</strong>
              </p>
              <div className="product-detail__variant-list">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    className={`variant-btn ${
                      selectedVariantId === v.id ? 'variant-btn--active' : ''
                    } ${v.stockLevel !== 'IN_STOCK' ? 'variant-btn--unavailable' : ''}`}
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={v.stockLevel !== 'IN_STOCK'}
                    title={
                      v.stockLevel !== 'IN_STOCK'
                        ? 'Out of stock'
                        : `${v.name} — ${formatPrice(v.price, v.currencyCode)}`
                    }
                  >
                    {v.name}
                    {v.price !== price && v.price != null && (
                      <span className="variant-btn__price">
                        {' '}({formatPrice(v.price, v.currencyCode)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {description && (
            <div className="product-detail__description">
              <h2 className="product-detail__description-heading">About this product</h2>
              <p>{description}</p>
            </div>
          )}

          <div className="product-detail__actions">
            <button
              className={`btn btn--primary btn--lg ${!isAvailable ? 'btn--disabled' : ''} ${
                addedToCart ? 'btn--success' : ''
              }`}
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              {addedToCart ? '✓ Added to Cart' : isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="btn btn--outline btn--lg" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>

          {selectedVariant?.sku && (
            <p className="product-detail__sku">SKU: {selectedVariant.sku}</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
