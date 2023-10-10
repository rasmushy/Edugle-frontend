import createApolloClient from "../lib/apolloClient"; 
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
  const client = createApolloClient;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};