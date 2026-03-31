import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc('get_submission_count');

    if (error) {
      console.error('Submission count error:', error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json(
      { count: data || 0 },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
