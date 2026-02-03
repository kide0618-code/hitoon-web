import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/me
 * Get current user info with profile
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Check if operator
    const { data: operator } = await supabase
      .from('operators')
      .select('role')
      .eq('user_id', user.id)
      .single();

    // Get purchase stats
    const { count: purchaseCount } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    const operatorData = operator as { role: string } | null;

    return NextResponse.json({
      id: user.id,
      email: user.email,
      email_verified: user.email_confirmed_at != null,
      created_at: user.created_at,
      profile: profile || null,
      is_operator: !!operatorData,
      operator_role: operatorData?.role || null,
      stats: {
        total_purchases: purchaseCount || 0,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/me
 * Delete current user account
 */
export async function DELETE() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use admin client to delete user
    const adminClient = createAdminClient();

    // Anonymize purchases (keep for records, remove user_id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient.from('purchases') as any)
      .update({ user_id: null })
      .eq('user_id', user.id);

    // Delete user (cascades to profile)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
