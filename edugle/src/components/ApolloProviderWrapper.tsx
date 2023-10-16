import { useSession } from "next-auth/react";
import createApolloClient from "../lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { useState, useContext, useEffect, createContext, type ReactNode } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Error from "../pages/_error";

interface NavBarContextType {
  isNavBarOpen: boolean;
  openNavBar: () => void;
  closeNavBar: () => void;
}

const NavBarContext = createContext<NavBarContextType | undefined>(undefined);

export const ApolloProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const openNavBar = () => setIsNavBarOpen(true);
  const closeNavBar = () => setIsNavBarOpen(false);

  const { data: session, status } = useSession();
  const client = createApolloClient(session?.token as string);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/", redirect: true });
    }
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;

 
  return (
    <ApolloProvider client={client}>
      <NavBarContext.Provider value={{ isNavBarOpen, openNavBar, closeNavBar }}>{children}</NavBarContext.Provider>
    </ApolloProvider>
  );
};

export const useNavBar = (): NavBarContextType => {
  const context = useContext(NavBarContext);
  if (!context) {
    return {
      isNavBarOpen: false,
      openNavBar: () => {},
      closeNavBar: () => {},
    };
  }
  return context;
};
