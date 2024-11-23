export const API_URL =
  process.env.NODE_ENV == "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_URL;
