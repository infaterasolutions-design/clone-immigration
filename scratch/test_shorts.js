require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkShorts() {
  const { data: articles } = await supabase
    .from('articles')
    .select('title, category_slug, tags');
    
  console.log('Total articles:', articles.length);
  const shorts = articles.filter(a => a.category_slug === 'shorts' || (a.tags && a.tags.includes('shorts')));
  console.log('Found shorts via JS filter:', shorts.length);
}

checkShorts();
