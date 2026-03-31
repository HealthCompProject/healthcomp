import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title') || undefined;
    const revenue_range = searchParams.get('revenue_range') || undefined;
    const tax_status = searchParams.get('tax_status') || undefined;
    const region = searchParams.get('region') || undefined;

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc('get_comp_benchmarks', {
      p_title: title ?? null,
      p_revenue_range: revenue_range ?? null,
      p_tax_status: tax_status ?? null,
      p_region: region ?? null,
    });

    if (error) {
      console.error('Benchmark query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch benchmarks' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Benchmark error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
