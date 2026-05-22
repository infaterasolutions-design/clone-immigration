require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkLatestDate() {
  const { data: articles } = await supabase
    .from('articles')
    .select('title, published_at')
    .eq('status', 'published')
    .eq('is_indexed', true)
    .order('published_at', { ascending: false })
    .limit(5);
    
  console.log('Latest 5 published articles:');
  articles?.forEach(a => console.log(a.published_at, a.title));
}

checkLatestDate();
