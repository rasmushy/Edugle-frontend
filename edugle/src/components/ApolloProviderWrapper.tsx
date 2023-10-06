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
import { HTTP_URI, WS_URI, AUTH_TOKEN } from "../constants";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { split } from "@apollo/client";

const httpLink = new HttpLink({
  uri: HTTP_URI,
  credentials: "same-origin",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URI,
/*     connectionParams: {
      authToken: AUTH_TOKEN,
    }, */
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
      uri: "http://localhost:3000/graphql",
      link: from([authMiddleware, link]),
      credentials: "same-origin",
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
