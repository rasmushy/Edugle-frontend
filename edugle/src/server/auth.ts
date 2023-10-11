import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { gql } from "@apollo/client";
import { env } from "../env.mjs";
import { print } from "graphql/language/printer";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

const LOGIN_USER = gql`
  mutation LoginUser($credentials: LoginInput!) {
    loginUser(credentials: $credentials) {
      message
      token
      user {
        id
        role
      }
    }
  }
`;

const CHECK_TOKEN = gql`
  query CheckToken($token: String!) {
    checkToken(token: $token) {
      email
      id
      role
      token
      username
    }
  }
`;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session {
    refreshTokenExpires?: number;
    accessTokenExpires?: string;
    refreshToken?: string;
    token?: string;
    error?: string;
    user: User;
  }
  interface User {
    id: string;
    role: string;
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    refreshTokenExpires?: number;
    accessTokenExpires?: number;
    refreshToken?: string;
    token: string;
    exp?: number;
    iat?: number;
    jti?: string;
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
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: print(LOGIN_USER),
            variables: {
              credentials: {
                email: credentials?.email,
                password: credentials?.password,
              },
            },
          }),
        });
        const data = await response.json();
        if (data?.data.loginUser?.token) {
          // Return user details and token to next-auth to manage session
          return {
            ...data.data.loginUser.user,
            token: data.data.loginUser.token,
            error: data.data.loginUser.message,
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
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user?.role) {
        // This will only be executed at login. Each next invocation will skip this part.
        return { ...token, ...user };
      }

      // on subsequent calls, token is provided and we need to check if it's expired
      if (token?.accessTokenExpires) {
        if (Date.now() / 1000 < token?.accessTokenExpires) return { ...token, ...user };
      } else if (token?.refreshToken) return refreshAccessToken(token);

      return { ...token, ...user };
    },
    session: async ({ session, token }: { session: Session; token: JWT }): Promise<Session> => {
      if (
        token?.accessTokenExpires &&
        Date.now() / 1000 > token.accessTokenExpires &&
        token?.refreshTokenExpires &&
        Date.now() / 1000 > token.refreshTokenExpires
      )

 {
        return Promise.reject({
          error: new Error("Refresh token has expired. Please log in again to get a new refresh token."),
        });
      }

      const accessTokenData = JSON.parse(atob(token.token.split(".")?.[1] ?? ""));
      token.accessTokenExpires = accessTokenData.exp;
      session.user = {id: token.id, role: token.role} as User;
      session.token = token?.token;

      return Promise.resolve(session);
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
  secret: env.NEXTAUTH_SECRET,
};

async function refreshAccessToken(tokenObject: JWT) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await fetch(`${env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      body: JSON.stringify({
        query: print(CHECK_TOKEN),
        variables: {
          token: tokenObject.refreshToken,
        },
      }),
    });

    console.log("tokenResponse=", tokenResponse);

    const data = await tokenResponse.json();

    return {
      ...tokenObject,
      token: data.user.token,
      accessTokenExpires: data.accessTokenExpires,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
