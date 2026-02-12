import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || '', 10);
    const month = parseInt(searchParams.get('month') || '', 10);

    if (!year || !month || month < 1 || month > 12) {
      return Response.json({ error: 'Valid year and month are required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Calculate month range in JST (Asia/Tokyo = UTC+9)
    // Start of month in JST = start of month in UTC - 9 hours
    const startJST = new Date(Date.UTC(year, month - 1, 1, -9, 0, 0));
    const endJST = new Date(Date.UTC(year, month, 1, -9, 0, 0));
    const startISO = startJST.toISOString();
    const endISO = endJST.toISOString();

    // Fetch completed purchases for this artist in the given month
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: purchases, error: purchasesError } = await (
      supabaseAdmin.from('purchases') as any
    )
      .select('id, price_paid, card_id, cards!inner(id, name, rarity, artist_id)')
      .eq('status', 'completed')
      .eq('cards.artist_id', id)
      .gte('purchased_at', startISO)
      .lt('purchased_at', endISO);

    if (purchasesError) {
      return Response.json({ error: purchasesError.message }, { status: 500 });
    }

    // Group by card
    const cardMap = new Map<
      string,
      {
        card_id: string;
        card_name: string;
        rarity: string;
        quantity: number;
        revenue: number;
      }
    >();

    for (const p of purchases || []) {
      const card = p.cards;
      const existing = cardMap.get(card.id);
      if (existing) {
        existing.quantity += 1;
        existing.revenue += p.price_paid;
      } else {
        cardMap.set(card.id, {
          card_id: card.id,
          card_name: card.name,
          rarity: card.rarity,
          quantity: 1,
          revenue: p.price_paid,
        });
      }
    }

    const sales = Array.from(cardMap.values());
    const totals = {
      quantity: sales.reduce((sum, s) => sum + s.quantity, 0),
      revenue: sales.reduce((sum, s) => sum + s.revenue, 0),
    };

    // Fetch payout record for this month
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payout } = await (supabaseAdmin.from('artist_payouts') as any)
      .select('*')
      .eq('artist_id', id)
      .eq('year', year)
      .eq('month', month)
      .single();

    return Response.json({
      sales,
      totals,
      payout: payout
        ? { status: payout.payout_status, note: payout.note }
        : { status: 'pending', note: '' },
    });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const body = await request.json();
    const { year, month, payout_status, note } = body;

    if (!year || !month || month < 1 || month > 12) {
      return Response.json({ error: 'Valid year and month are required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'transferred', 'confirmed'];
    if (!validStatuses.includes(payout_status)) {
      return Response.json({ error: 'Invalid payout_status' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Build upsert payload - only include note if explicitly provided
    const upsertData: Record<string, unknown> = {
      artist_id: id,
      year,
      month,
      payout_status,
    };
    if (note !== undefined) {
      upsertData.note = note || null;
    }

    // Upsert: insert or update on conflict
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin.from('artist_payouts') as any)
      .upsert(upsertData, { onConflict: 'artist_id,year,month' })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ payout: data });
  } catch (error) {
    return handleAdminError(error);
  }
}
