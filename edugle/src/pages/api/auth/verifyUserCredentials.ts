import { gql } from "@apollo/client";
import {AUTH_TOKEN} from "~/constants";
import client from "~/lib/apolloClient";  // Adjust path as needed

const CHECK_TOKEN = gql`
  query CheckToken($token: String!) {
    checkToken(token: $token) {
      email
    }
  }
`;

export async function verifyTokenValidity(token: string) {
  try {
    const { data } = await client.query({
      query: CHECK_TOKEN,
      variables: { token: token }
    });

    return data.checkToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function verifyUserCredentials(email: string, password: string) {
  // Your logic to verify email and password.
  // If you need to check a token's validity as part of this process, you can call `verifyTokenValidity`.

  const token: string = localStorage.getItem(AUTH_TOKEN) || "";  // Replace with your logic
  const isValidToken = await verifyTokenValidity(token);
  
  if (isValidToken) {
    // return user or some data
  } else {
    // handle invalid credentials or token
  }
}