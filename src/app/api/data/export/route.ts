import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ROLE_SLUGS } from '@/lib/constants/roles';

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format') || 'json';

  try {
    const supabase = createAdminClient();

    // Get overall benchmarks
    const { data: overall } = await supabase.rpc('get_comp_benchmarks', {
      p_title: null,
      p_revenue_range: null,
      p_tax_status: null,
      p_region: null,
    });

    // Get benchmarks by role
    const roleResults: Record<string, unknown> = {};
    for (const [slug, title] of Object.entries(ROLE_SLUGS)) {
      const { data } = await supabase.rpc('get_comp_benchmarks', {
        p_title: title,
        p_revenue_range: null,
        p_tax_status: null,
        p_region: null,
      });
      if (data?.sufficient_data) {
        roleResults[slug] = data;
      }
    }

    // Get benchmarks by org size
    const orgSizes = ['under_500m', '500m_1b', '1b_3b', '3b_5b', '5b_10b', 'over_10b'];
    const orgSizeResults: Record<string, unknown> = {};
    for (const size of orgSizes) {
      const { data } = await supabase.rpc('get_comp_benchmarks', {
        p_title: null,
        p_revenue_range: size,
        p_tax_status: null,
        p_region: null,
      });
      if (data?.sufficient_data) {
        orgSizeResults[size] = data;
      }
    }

    // Get benchmarks by region
    const regions = ['northeast', 'southeast', 'midwest', 'southwest', 'west', 'pacific_northwest'];
    const regionResults: Record<string, unknown> = {};
    for (const region of regions) {
      const { data } = await supabase.rpc('get_comp_benchmarks', {
        p_title: null,
        p_revenue_range: null,
        p_tax_status: null,
        p_region: region,
      });
      if (data?.sufficient_data) {
        regionResults[region] = data;
      }
    }

    const exportData = {
      metadata: {
        source: 'The Healthcare Executive Compensation Project (healthcomp.org)',
        license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        license_url: 'https://creativecommons.org/licenses/by/4.0/',
        attribution: 'Source: The Healthcare Executive Compensation Project, healthcomp.org',
        generated_at: new Date().toISOString(),
        notes: 'All statistics represent aggregated, anonymized data from self-reported submissions. Minimum 5 submissions required for any statistic. No single submission represents more than 25% of any displayed figure.',
      },
      overall: overall?.sufficient_data ? overall : null,
      by_role: roleResults,
      by_org_size: orgSizeResults,
      by_region: regionResults,
    };

    if (format === 'csv') {
      const csvRows = generateCSV(exportData);
      return new NextResponse(csvRows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="healthcomp-data-${new Date().toISOString().slice(0, 10)}.csv"`,
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
        },
      });
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="healthcomp-data-${new Date().toISOString().slice(0, 10)}.json"`,
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
  }
}

interface BenchmarkData {
  sufficient_data?: boolean;
  submission_count?: number;
  base_salary?: { p25: number; p50: number; p75: number };
  total_cash?: { p25: number; p50: number; p75: number };
  incentive_target_pct?: { p25: number; p50: number; p75: number };
  has_deferred_comp_pct?: number;
  has_ltip_pct?: number;
  has_457f_pct?: number;
  has_serp_pct?: number;
}

function generateCSV(exportData: {
  overall: BenchmarkData | null;
  by_role: Record<string, unknown>;
  by_org_size: Record<string, unknown>;
  by_region: Record<string, unknown>;
}): string {
  const headers = [
    'segment_type',
    'segment_value',
    'submission_count',
    'base_salary_p25',
    'base_salary_p50',
    'base_salary_p75',
    'total_cash_p25',
    'total_cash_p50',
    'total_cash_p75',
    'incentive_target_pct_p25',
    'incentive_target_pct_p50',
    'incentive_target_pct_p75',
    'has_deferred_comp_pct',
    'has_ltip_pct',
    'has_457f_pct',
    'has_serp_pct',
  ];

  const rows: string[] = [headers.join(',')];

  function addRow(type: string, value: string, data: BenchmarkData) {
    if (!data?.sufficient_data) return;
    rows.push([
      type,
      `"${value}"`,
      data.submission_count || '',
      data.base_salary?.p25 || '',
      data.base_salary?.p50 || '',
      data.base_salary?.p75 || '',
      data.total_cash?.p25 || '',
      data.total_cash?.p50 || '',
      data.total_cash?.p75 || '',
      data.incentive_target_pct?.p25 || '',
      data.incentive_target_pct?.p50 || '',
      data.incentive_target_pct?.p75 || '',
      data.has_deferred_comp_pct || '',
      data.has_ltip_pct || '',
      data.has_457f_pct || '',
      data.has_serp_pct || '',
    ].join(','));
  }

  if (exportData.overall) {
    addRow('overall', 'all', exportData.overall);
  }

  for (const [role, data] of Object.entries(exportData.by_role)) {
    addRow('role', role, data as BenchmarkData);
  }

  for (const [size, data] of Object.entries(exportData.by_org_size)) {
    addRow('org_size', size, data as BenchmarkData);
  }

  for (const [region, data] of Object.entries(exportData.by_region)) {
    addRow('region', region, data as BenchmarkData);
  }

  return rows.join('\n');
}
