import { config } from "dotenv";

config();

const env = {
  CORS_URL: process.env.CORS_URL,
  PORT: process.env.PORT || 3000,
  EMAIL_ID: process.env.EMAIL_ID,
  EMAIL_PASS: process.env.EMAIL_PASS,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
};


export default env;