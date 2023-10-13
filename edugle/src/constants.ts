export const IS_PROD = process.env.ENV === "production";
export const WS_URI = IS_PROD
  ? "https://edugle-backend.azurewebsites.net"
  : "ws://localhost:4000/subscriptions";

export const HTTP_URI = IS_PROD
  ? "wss://edugle-backend.azurewebsites.net/subscriptions"
  : "http://localhost:4000/graphql";

