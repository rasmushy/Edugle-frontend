// ApolloProviderWrapper.tsx
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";
import client from "../lib/apolloClient";  // Adjust path as needed

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};