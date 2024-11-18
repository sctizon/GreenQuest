const DEV_API_URL = 'http://localhost:3000/api';
const PROD_API_URL = 'https://your-production-api-url.com';

export const API_URL = process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;
