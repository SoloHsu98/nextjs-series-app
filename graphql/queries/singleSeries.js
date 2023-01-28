import { gql } from "@apollo/client";
export const GET_SERIES = gql`
  query getSeries($slug: String!) {
    seriesDetails(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          title
          year
          rating
          slug
          status
          genre
          plotSummary
          totalEpisodes
          casts {
            data {
              id
              attributes {
                castName
              }
            }
          }
          poster {
            data {
              id
              attributes {
                formats
              }
            }
          }
        }
      }
    }
  }
`;
