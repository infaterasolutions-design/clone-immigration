require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkCategories() {
  const { data, error } = await supabase.from('categories').select('id, name, slug, parent_slug');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
checkCategories();
