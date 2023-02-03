import { gql } from "@apollo/client";
export const CREATE_COMMENTS = gql`
  mutation createComments($data: CommentInput!) {
    createComment(data: $data) {
      data {
        id
      }
    }
  }
`;
