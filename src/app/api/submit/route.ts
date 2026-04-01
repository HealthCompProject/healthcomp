import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fullSubmissionSchema } from '@/lib/validations/submission';

async function hashIP(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    throw new Error('IP_HASH_SALT environment variable is required');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint_hash, invite_code, ...formData } = body;

    // Convert null values to undefined (empty optional number fields arrive as null)
    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value === null ? undefined : value])
    );

    // Validate form data
    const result = fullSubmissionSchema.safeParse(cleanedData);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Validate invite code if provided
    if (invite_code) {
      const { data: isValid } = await supabase.rpc('validate_invite_code', {
        p_code: invite_code,
      });

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid or already-used invite code' },
          { status: 400 }
        );
      }
    }

    // Hash the IP for duplicate detection
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const ip_hash = await hashIP(ip);

    // Check for duplicate submission (same IP + fingerprint within 24 hours)
    if (fingerprint_hash) {
      const { data: existing } = await supabase
        .from('submissions')
        .select('id')
        .eq('ip_hash', ip_hash)
        .eq('submission_fingerprint', fingerprint_hash)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (existing && existing.length > 0) {
        const { error: updateError } = await supabase
          .from('submissions')
          .update({
            ...result.data,
            ip_hash,
            submission_fingerprint: fingerprint_hash,
          })
          .eq('id', existing[0].id);

        if (updateError) {
          return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
        }

        return NextResponse.json({ success: true, updated: true, invite_codes: [] });
      }
    }

    // Insert new submission
    const { data: insertedRow, error: insertError } = await supabase
      .from('submissions')
      .insert({
        ...result.data,
        ip_hash,
        submission_fingerprint: fingerprint_hash || null,
        invite_code_used: invite_code || null,
        comp_data_year: new Date().getFullYear(),
      })
      .select('id')
      .single();

    if (insertError || !insertedRow) {
      console.error('Submission insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    // Mark invite code as used
    if (invite_code) {
      await supabase.rpc('use_invite_code', {
        p_code: invite_code,
        p_submission_id: insertedRow.id,
      });
    }

    // Generate 3 new invite codes for this submitter
    const { data: newCodes } = await supabase.rpc('generate_codes_for_submission', {
      p_submission_id: insertedRow.id,
    });

    return NextResponse.json({
      success: true,
      invite_codes: newCodes || [],
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
