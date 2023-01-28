import { gql } from "@apollo/client";
export const UPDATE_COLLECTIONS = gql`
  mutation updateCollection($id: ID!, $data: CollectionInput!) {
    updateCollection(id: $id, data: $data) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
export const CREATE_COLLECTIONS = gql`
  mutation createCollection($data: CollectionInput!) {
    createCollection(data: $data) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
