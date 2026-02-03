import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Verify that the current user is an authenticated operator
 * Returns the user if authenticated and is operator, throws error otherwise
 */
export async function requireOperator() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: operator } = await supabase
    .from('operators')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!operator) {
    throw new Error('Forbidden');
  }

  return { user, operator, supabase };
}

/**
 * Handle admin API errors consistently
 */
export function handleAdminError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ error: 'Internal Server Error' }, { status: 500 });
}
