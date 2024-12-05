import { createClient } from "@supabase/supabase-js";
import env from "./env";

const supabaseUrl = env.SUPABASE_URL as string;
const supabaseKey = env.SUPABASE_KEY;

if (!supabaseKey || !supabaseUrl)
  throw new Error(
    "SUPABASE_URL or SUPABASE_KEY is not defined in the environment variables"
  );

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
