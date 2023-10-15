import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import type { Session } from "next-auth";
import { ApolloProviderWrapper } from "../components/ApolloProviderWrapper";
import Header from "../components/navBar/Header";

import "~/styles/globals.css";
import { NavBarProvider } from "../components/navBar/NavBarProvider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <style>
        {`
          body {
            background: #2C7DA0;
          }
          `}
      </style>
      <NavBarProvider>
        <ApolloProviderWrapper>
          <Header />
          <Component {...pageProps} />
        </ApolloProviderWrapper>
      </NavBarProvider>
    </SessionProvider>
  );
};

export default MyApp;
