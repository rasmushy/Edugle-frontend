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
import { HTTP_URI, WS_URI, AUTH_TOKEN } from "../constants";
import { onError } from "@apollo/client/link/error";
import { useSession } from "next-auth/react";

const httpLink = new HttpLink({
  uri: HTTP_URI,
  credentials: "same-origin",
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: WS_URI,
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

const authMiddleware = setContext(async (_, { headers }) => {
  const { data: session } = useSession();
  const token = localStorage.getItem(AUTH_TOKEN) || session?.user.id || "";
  console.log('token=', token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authMiddleware, link]),
  credentials: "same-origin",
  cache: new InMemoryCache(),
});

export default client;
