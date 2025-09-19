import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl: string = "https://pjiwxqbdwebgzzjzjmkb.supabase.co";
const supabaseKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqaXd4cWJkd2ViZ3p6anpqbWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDMwNTEsImV4cCI6MjA3MjY3OTA1MX0.XcdilLjGBc9owScIE79RcMoYRKFe5OTk7MJQLwDFHRk";

export const supabase = (sessionToken: string) => {
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: sessionToken } },
  });
};
