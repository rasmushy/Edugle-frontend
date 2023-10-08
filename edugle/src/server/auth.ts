import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { gql } from "@apollo/client";
import { print } from "graphql";

import { env } from "~/env.mjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      token: string;
    };
  }

  interface JWT {
    token: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const CHECK_CREDENTIALS = gql`
          mutation LoginUser($credentials: LoginInput!) {
            loginUser(credentials: $credentials) {
              message
              token
              user {
                role
                username
                id
                email
              }
            }
          }
        `;

        console.log("Credentials: ", credentials);

        //console.log("Credentials: ", credentials?.data);
        const response = await fetch(`http://localhost:3000/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: print(CHECK_CREDENTIALS),
            variables: {
              credentials: {
                email: credentials?.email,
                password: credentials?.password,
              },
            },
          }),
        });

        const data = await response.json();

        console.log("Data: ", data);

        // Now, check the response
        if (data?.data?.loginUser?.token) {
          // Return user details and token to next-auth to manage session
          return {
            role: data.data.loginUser.user.role,
            id: data.data.loginUser.user.id,
            token: data.data.loginUser.token,
          };
        }

        // If something goes wrong
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as DefaultSession["user"] & {
        id: string;
        role: string;
        token: string;
      };
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: env.NODE_ENV === "production",
      },
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
