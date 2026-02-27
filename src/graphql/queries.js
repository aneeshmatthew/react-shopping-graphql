import { gql } from '@apollo/client';

/**
 * Vendure Shop API — prices are integers in cents (e.g. 32900 = $329.00).
 * Divide by 100 when displaying. currencyCode is the ISO code (e.g. "USD").
 */

export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $term: String
    $take: Int!
    $skip: Int
    $collectionSlug: String
    $sort: SearchResultSortParameter
  ) {
    search(
      input: {
        term: $term
        take: $take
        skip: $skip
        collectionSlug: $collectionSlug
        groupByProduct: true
        sort: $sort
      }
    ) {
      totalItems
      items {
        productId
        productName
        slug
        description
        priceWithTax {
          ... on PriceRange {
            min
            max
          }
          ... on SinglePrice {
            value
          }
        }
        currencyCode
        productAsset {
          preview
        }
        collectionIds
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        preview
      }
      assets {
        preview
      }
      variants {
        id
        name
        price
        currencyCode
        stockLevel
        sku
      }
      collections {
        id
        name
        slug
      }
    }
  }
`;

export const GET_COLLECTIONS = gql`
  query GetCollections {
    collections(options: { take: 20 }) {
      items {
        id
        name
        slug
      }
    }
  }
`;
