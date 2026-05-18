require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('articles').select('slug, cluster_slug, category_slug').eq('slug', 'may-2026-visa-bulletin-explained-for-immigrants').then(res => console.log(res.data));
