import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import React, { PropsWithRef, useEffect, useState } from "react";
import { gql } from "@apollo/client";

const withAuth = (WrappedComponent: any) => {
  const WithAuthComponent = (props: any) => {
    const [token, setToken] = useState<string>("");
    const [authUser, setAuth] = useState(null);

    const CHECK_ADMIN = gql(`query CheckAdmin($token: String!) {
          checkAdmin(token: $token) {
            email
            id
            role
        }
      }`);

    const checkAdmin = useQuery(CHECK_ADMIN, {
      variables: {
        token: token,
      },
      onCompleted: ({ checkAdmin }) => {
        setAuth(checkAdmin);
      },
    });

    const isAuthentication = async () => {
      try {
        // Perform localStorage action
        const token = localStorage.getItem("token") || "";
        setToken(token);
        const userToken = await checkAdmin.refetch();
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
          return null;
        }
      });
    }, []);

    // Render the wrapped component if authenticated, or return null

    return authUser ? <WrappedComponent {...props} /> : null;
  };

  return WithAuthComponent;
};

export default withAuth;
