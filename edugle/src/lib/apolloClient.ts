import { ApolloClient, HttpLink, InMemoryCache, from, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  credentials: "same-origin",
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${process.env.NEXT_PUBLIC_WS_URL}`,
          shouldRetry(errOrCloseEvent) {
            // If true is returned, the link will try to reconnect.
            // Returning false halts reconnects.
            return true;
          },
        }),
      )
    : null;

const splitLink =
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

const client = (token: string) => {
  const authMiddleware = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: from([authMiddleware, splitLink]),
    credentials: "same-origin",
    cache: new InMemoryCache(),
  });
};

export default client;
