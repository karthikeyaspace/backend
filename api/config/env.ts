import { config } from "dotenv";

config();

const env = {
  PORT: process.env.PORT || 3000,
  EMAIL_ID: process.env.EMAIL_ID,
  EMAIL_PASS: process.env.EMAIL_PASS,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_TABLE_NAME: process.env.SUPABASE_TABLE_NAME,
};

Object.keys(env).forEach((key) => {
  if (!env[key as keyof typeof env])
    throw new Error(`${key} is not defined in .env file`);
});

export default env;
