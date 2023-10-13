import { useSession } from "next-auth/react";
import createApolloClient from "../lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import type { PropsWithChildren } from "react";
import { useEffect} from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
  const { data: session, status: status } = useSession();
  const client = createApolloClient(session?.token as string);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    console.log("session=", session);
    if (status === "unauthenticated") {
      console.log("not authorized");
      router.push("/");
    }

    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/", redirect: true });
    }
  }, [session]);


  if(status === "loading") return <div>Loading...</div>

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
