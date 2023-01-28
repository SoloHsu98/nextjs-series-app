// import { ApolloClient } from "apollo-client";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { HttpLink } from "apollo-link-http";

// const cache = new InMemoryCache();
// const link = new HttpLink({
//   uri: "http://localhost:1337/graphql",
// });
// const client = new ApolloClient({
//   cache,
//   link,
// });

// export default client;
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
const GRAPHQL_URL = "http://localhost:1337/graphql";

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
});
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default apolloClient;
