import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}graphql`,
  credentials: "same-origin",
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${process.env.NEXT_PUBLIC_WS_URL}`,
        }),
      )
    : null;

const errorLink =
  typeof window !== "undefined"
    ? onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      })
    : null;

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink,
      )
    : httpLink;

function createApolloClient(token: string | null) {
const authMiddleware = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

return new ApolloClient({
  link: from([authMiddleware, link]),
  credentials: "same-origin",
  cache: new InMemoryCache(),
});
}

export default createApolloClient;
