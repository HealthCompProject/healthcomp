import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('validate_invite_code', {
      p_code: code,
    });

    if (error) {
      console.error('Invite validation error:', error);
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: !!data });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
