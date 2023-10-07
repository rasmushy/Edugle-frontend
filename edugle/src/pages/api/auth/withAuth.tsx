import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import React, { PropsWithRef, useEffect, useState } from "react";
import { gql } from "@apollo/client";

const withAuth = (WrappedComponent: any) => {
  const WithAuthComponent = (props: any) => {
    const [token, setToken] = useState<string>("");
    const [authUser, setAuth] = useState(null);
    const CHECK_TOKEN = gql(`query CheckToken($token: String!) {
          checkToken(token: $token) {
            email
        }
      }`);

    const checkToken = useQuery(CHECK_TOKEN, {
      variables: {
        token: token,
      },
      onCompleted: ({ checkToken }) => {
        setAuth(checkToken);
      },
    });

    const isAuthentication = async () => {
      try {
        // Perform localStorage action
        const token = localStorage.getItem("token") || "";
        setToken(token);
        const userToken = await checkToken.refetch();
        return userToken;
      } catch (exception) {
        setAuth(null);
        return null;
      }
    };

    const router = useRouter();

    useEffect(() => {
      // Perform the login check only when the component mounts
      isAuthentication().then((isAuth) => {
        if (!isAuth) {
          // Redirect to the main page if not authenticated
          router.replace("/");
        }
      });
    }, []);

    // Render the wrapped component if authenticated, or return null

    return authUser ? <WrappedComponent {...props} /> : null;
  };

  return WithAuthComponent;
};

export default withAuth;
