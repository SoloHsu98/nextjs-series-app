import { gql } from "@apollo/client";
export const UPDATE_SERIES_DETAIL = gql`
  mutation updateSeries($id: ID!, $data: SeriesDetailInput!) {
    updateSeriesDetail(id: $id, data: $data) {
      data {
        id
        attributes {
          title
          saved
        }
      }
    }
  }
`;
