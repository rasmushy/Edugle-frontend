export const IS_PROD = process.env.ENV === "production";
export const WS_URI = IS_PROD
  ? "ws://localhost:3000/subscriptions"
  : "ws://localhost:3000/subscriptions";

export const HTTP_URI = IS_PROD
  ? "http://localhost:3000/graphql"
  : "http://localhost:3000/graphql";
export const AUTH_TOKEN = "auth-token";
