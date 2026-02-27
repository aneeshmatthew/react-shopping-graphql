import{g as e}from"./apollo-B6mPe2es.js";const t=e`
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
`,r=e`
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
`,o=e`
  query GetCollections {
    collections(options: { take: 20 }) {
      items {
        id
        name
        slug
      }
    }
  }
`;export{o as G,t as S,r as a};
