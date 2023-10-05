import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import { HTTP_URI, WS_URI } from "~/constants";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { split } from "@apollo/client";
import { AUTH_TOKEN } from "~/constants";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
  credentials: "same-origin",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "http://localhost:3000/api/",
    connectionParams: {
      authToken: AUTH_TOKEN,
    },
  }),
);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
  const client = useMemo(() => {
    const authMiddleware = setContext(async (_, { headers }) => {
      const token = localStorage.getItem(AUTH_TOKEN);
      //const { token } = await fetch("").then((res) => res.json());

      console.log("token", token);

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}`: "",
        },
      };
    });

    return new ApolloClient({
      link: from([authMiddleware, link]),
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
