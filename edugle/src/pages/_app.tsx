import { SessionProvider } from "next-auth/react";
import { AppType } from "next/dist/shared/lib/utils";
import { Session } from "next-auth";
import { ApolloProviderWrapper } from "../components/ApolloProviderWrapper";
import  Header  from "../components/Header";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <style>
        {`
          body {
            background: #15162c;
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
