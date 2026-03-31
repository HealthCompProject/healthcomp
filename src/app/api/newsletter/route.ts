import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod/v4';

const newsletterSchema = z.object({
  email: z.email('Please enter a valid email address'),
  source: z.enum(['footer', 'post_submission', 'dashboard_gate']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email, source } = result.data;
    const supabase = createAdminClient();

    // Upsert newsletter subscriber
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      { email, source },
      { onConflict: 'email' }
    );

    if (error) {
      console.error('Newsletter signup error:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    // TODO: Send welcome email via Resend when API key is configured
    // if (process.env.RESEND_API_KEY) { ... }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
