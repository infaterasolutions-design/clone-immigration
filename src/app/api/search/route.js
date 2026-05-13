import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "", 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, category_label, category_slug')
      .eq('status', 'published')
      .ilike('title', `%${q}%`)
      .limit(6);

    if (error) {
      console.error('Supabase search error:', error);
      return NextResponse.json({ results: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ results: data || [] });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ results: [], error: 'Internal Server Error' }, { status: 500 });
  }
}
