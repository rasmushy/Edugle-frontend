import { SessionProvider } from "next-auth/react";
import { AppType } from "next/dist/shared/lib/utils";
import { Session } from "next-auth";
import { ApolloProviderWrapper } from "~/components/apollo-provider-wrapper";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ApolloProviderWrapper>
        <Component {...pageProps} />
      </ApolloProviderWrapper>
    </SessionProvider>
  );
};

export default MyApp;
