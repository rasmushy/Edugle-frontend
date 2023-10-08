import { SessionProvider } from "next-auth/react";
import { AppType } from "next/dist/shared/lib/utils";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { ApolloProviderWrapper } from "../components/ApolloProviderWrapper";
import Header from "../components/Header";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60} // Re-fetch session every 5 minutes
      refetchOnWindowFocus={true} // Re-fetches session when window is focused
    >
      <style>
        {`
          body {
            background: #2C7DA0;
            overflow-x: hidden;
          }
        `}
      </style>
      <ApolloProviderWrapper>
        <Header />
        <Component {...pageProps} />
      </ApolloProviderWrapper>
    </SessionProvider>
  );
};

export default MyApp;
