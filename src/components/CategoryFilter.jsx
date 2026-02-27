import { useQuery } from '@apollo/client/react';
import { GET_COLLECTIONS } from '../graphql/queries';
import LoadingSpinner from './LoadingSpinner';

const CategoryFilter = ({ selectedCollection, onSelect }) => {
  const { data, loading } = useQuery(GET_COLLECTIONS);

  if (loading) return <LoadingSpinner size="small" />;

  const collections = data?.collections?.items || [];

  return (
    <div className="category-filter">
      <button
        className={`category-filter__btn ${!selectedCollection ? 'category-filter__btn--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {collections.map((col) => (
        <button
          key={col.id}
          className={`category-filter__btn ${
            selectedCollection === col.slug ? 'category-filter__btn--active' : ''
          }`}
          onClick={() => onSelect(col.slug)}
        >
          {col.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
