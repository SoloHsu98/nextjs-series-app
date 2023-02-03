import { gql } from "@apollo/client";
export const GET_COMMENTS = gql`
  query ($filters: CommentFiltersInput, $page: Int!, $pageSize: Int!) {
    comments(
      sort: "createdAt:desc"
      filters: $filters
      pagination: { page: $page, pageSize: $pageSize }
    ) {
      data {
        id
        attributes {
          comment
          username
          profile
          createdAt
          series_details {
            data {
              id
            }
          }
        }
      }
      meta {
        pagination {
          total
          page
          pageSize
          pageCount
        }
      }
    }
  }
`;
