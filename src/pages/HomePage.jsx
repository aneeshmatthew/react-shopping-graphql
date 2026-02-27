import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useSearchParams } from 'react-router-dom';
import { SEARCH_PRODUCTS } from '../graphql/queries';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

const SORT_OPTIONS = [
  { label: 'Relevance', value: null },
  { label: 'Name A–Z', value: { name: 'ASC' } },
  { label: 'Name Z–A', value: { name: 'DESC' } },
  { label: 'Price: Low to High', value: { price: 'ASC' } },
  { label: 'Price: High to Low', value: { price: 'DESC' } },
];

const PAGE_SIZE = 12;

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [page, setPage] = useState(0);

  const searchQuery = searchParams.get('search') || '';

  const { data, loading, error } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      term: searchQuery || undefined,
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      collectionSlug: selectedCollection || undefined,
      sort: sortBy || undefined,
    },
    fetchPolicy: 'cache-and-network',
  });

  const results = data?.search?.items || [];
  const totalItems = data?.search?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const handleCollectionSelect = (slug) => {
    setSelectedCollection(slug);
    setPage(0);
  };

  const handleSearch = (query) => {
    setPage(0);
    if (query.trim()) {
      setSearchParams({ search: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (e) => {
    setSortBy(JSON.parse(e.target.value));
    setPage(0);
  };

  return (
    <main className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__hero-title">Discover Amazing Products</h1>
        <p className="home-page__hero-subtitle">
          Shop the latest collection — electronics, furniture, sports &amp; more
        </p>
        <div className="home-page__hero-search">
          <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
        </div>
      </section>

      <div className="home-page__content container">
        <div className="home-page__toolbar">
          <CategoryFilter
            selectedCollection={selectedCollection}
            onSelect={handleCollectionSelect}
          />

          <div className="home-page__sort">
            <label htmlFor="sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-select"
              className="sort-select"
              value={JSON.stringify(sortBy)}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.label} value={JSON.stringify(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {searchQuery && (
          <p className="home-page__search-info">
            Search results for: <strong>&ldquo;{searchQuery}&rdquo;</strong>
            {!loading && ` — ${totalItems} product${totalItems !== 1 ? 's' : ''} found`}
          </p>
        )}

        {error && (
          <div className="error-state">
            <p>Failed to load products. Please try again later.</p>
            <p className="error-state__detail">{error.message}</p>
          </div>
        )}

        {loading && results.length === 0 ? (
          <LoadingSpinner fullPage />
        ) : results.length === 0 && !loading ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-state__icon">
              <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
              <path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h2>No products found</h2>
            <p>Try a different search term or category.</p>
          </div>
        ) : (
          <>
            {loading && (
              <div className="home-page__loading-overlay">
                <LoadingSpinner />
              </div>
            )}
            <div className={`product-grid ${loading ? 'product-grid--loading' : ''}`}>
              {results.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn--outline"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Previous
                </button>
                <span className="pagination__info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn--outline"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;
