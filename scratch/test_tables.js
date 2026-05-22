const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.rpc('get_tables_rpc'); // Note: we don't have this RPC. Let's just query a known table or standard postgrest if possible, but PostgREST doesn't expose schema easily without pg_meta.
  // Better way: let's just try to query 'clusters' table!
  const { data: clustersData, error: clustersError } = await supabase.from('clusters').select('*').limit(1);
  if (clustersError) {
    console.log('clusters table does not exist or error:', clustersError.message);
  } else {
    console.log('clusters table exists!', clustersData);
  }
}

run();
