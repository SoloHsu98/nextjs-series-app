import { gql } from "@apollo/client";
export const GET_ALL_SERIES = gql`
  query getAllSeries(
    $pageSize: Int
    $page: Int
    $filters: SeriesDetailFiltersInput
    $data: [String]
  ) {
    seriesDetails(
      pagination: { pageSize: $pageSize, page: $page }
      filters: $filters
      sort: $data
    ) {
      data {
        id
        attributes {
          title
          rating
          saved
          slug
          collections {
            data {
              id
              attributes {
                name
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
      meta {
        pagination {
          total
          pageCount
          page
        }
      }
    }
  }
`;

export const GET_TRENDING_SERIES = gql`
  query getTrending(
    $pageSize: Int
    $page: Int
    $filters: SeriesDetailFiltersInput
  ) {
    seriesDetails(
      filters: $filters
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      data {
        id
        attributes {
          title
          rating
          slug
          saved
          genre
          status
          collections {
            data {
              id
              attributes {
                name
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
      meta {
        pagination {
          total
          pageCount
          page
        }
      }
    }
  }
`;

export const GET_POPULAR_SERIES = gql`
  query getPopular(
    $pageSize: Int
    $page: Int
    $filters: SeriesDetailFiltersInput
  ) {
    seriesDetails(
      filters: $filters
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      data {
        id
        attributes {
          title
          rating
          slug
          status
          collections {
            data {
              id
              attributes {
                name
              }
            }
          }
          genre
          saved
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
      meta {
        pagination {
          total
          pageCount
          page
        }
      }
    }
  }
`;
export const GET_ONGOING_SERIES = gql`
  query getOngoing(
    $pageSize: Int
    $page: Int
    $filters: SeriesDetailFiltersInput
  ) {
    seriesDetails(
      filters: $filters
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      data {
        id
        attributes {
          title
          rating
          slug
          status
          saved
          genre
          collections {
            data {
              id
              attributes {
                name
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
      meta {
        pagination {
          total
          pageCount
          page
        }
      }
    }
  }
`;
export const GET_SIMILAR_SERIES = gql`
  query getSimilarSeries(
    $genre: String
    $slug: String
    $pageSize: Int
    $page: Int
  ) {
    seriesDetails(
      filters: { genre: { eq: $genre }, slug: { ne: $slug } }
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      data {
        id
        attributes {
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

export const GET_SAVED_SERIES = gql`
  query getSavedSeries($filters: SeriesDetailFiltersInput) {
    seriesDetails(filters: $filters, pagination: { limit: 100 }) {
      data {
        id
        attributes {
          title
          rating
          slug
          saved
          collections {
            data {
              id
              attributes {
                name
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
export const GET_UPCOMING_SERIES = gql`
  query getTrending(
    $pageSize: Int
    $page: Int
    $filters: SeriesDetailFiltersInput
  ) {
    seriesDetails(
      filters: $filters
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      data {
        id
        attributes {
          title
          rating
          slug
          saved
          genre
          status
          collections {
            data {
              id
              attributes {
                name
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
      meta {
        pagination {
          total
          pageCount
          page
        }
      }
    }
  }
`;
