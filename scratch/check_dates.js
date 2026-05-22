require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkDates() {
  const { data, error } = await supabase.from('articles').select('title, date, published_at').limit(5);
  if (error) console.error(error);
  else console.log(data);
}
checkDates();
