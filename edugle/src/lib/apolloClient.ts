import { ApolloClient, HttpLink, InMemoryCache, from, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import {HTTP_URI, WS_URI} from "../../constants";

const httpLink = new HttpLink({
  uri: `${HTTP_URI}/graphql`,
  credentials: "same-origin",
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${WS_URI}`,
        }),
      )
    : null;

const splitLink =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === "OperationDefinition" && definition.operation === "subscription";
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
        authorization: `Bearer ${token}`,
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
