import { gql } from "@apollo/client";
export const GET_COLLECTION = gql`
  query getCollection($filters: CollectionFiltersInput) {
    collections(filters: $filters) {
      data {
        id
        attributes {
          name
          series_details {
            data {
              id
              attributes {
                title
              }
            }
          }
        }
      }
    }
  }
`;
