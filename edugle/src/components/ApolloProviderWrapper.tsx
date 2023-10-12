import { useSession } from "next-auth/react";
import createApolloClient from "../lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();
  const client = createApolloClient(session?.user.token as string);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
