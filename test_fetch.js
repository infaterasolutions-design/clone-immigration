import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const now = new Date().toISOString();
  console.log("NOW:", now);
  const { data, error } = await supabase
      .from("sponsored_content")
      .select("*")
      .eq("is_active", true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6);

  console.log("Error:", error);
  console.log("Data:", data);
}

test();
