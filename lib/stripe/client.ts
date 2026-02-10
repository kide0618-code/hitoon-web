import Stripe from 'stripe';

/**
 * Get Stripe client for server-side operations
 * Uses lazy initialization to avoid errors during build
 */
function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return new Stripe(apiKey, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
  });
}

// Lazy-loaded stripe client
let _stripe: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      _stripe = getStripeClient();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_stripe as any)[prop];
  },
});

/**
 * Get or create Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  // First, check if customer already exists in our DB
  // For now, create a new customer each time (should be cached in DB)

  const customer = await stripe.customers.create({
    email,
    metadata: {
      user_id: userId,
    },
  });

  return customer.id;
}

/**
 * Create checkout session for card purchase
 */
export async function createCheckoutSession({
  customerId,
  cardId,
  cardName,
  artistName,
  imageUrl,
  price,
  quantity,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string;
  cardId: string;
  cardName: string;
  artistName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: `${artistName} - ${cardName}`,
            images: imageUrl ? [imageUrl] : [],
            metadata: {
              card_id: cardId,
            },
          },
          unit_amount: price,
        },
        quantity,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      card_id: cardId,
      quantity: String(quantity),
    },
    payment_intent_data: {
      setup_future_usage: 'on_session',
    },
  });

  return session;
}

/**
 * Cart item for checkout
 */
export interface CartCheckoutItem {
  cardId: string;
  cardName: string;
  artistName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

/**
 * Create checkout session for cart purchase (multiple items)
 */
export async function createCartCheckoutSession({
  customerId,
  items,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string;
  items: CartCheckoutItem[];
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // Build line items for each card in the cart
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'jpy',
      product_data: {
        name: `${item.artistName} - ${item.cardName}`,
        images: item.imageUrl ? [item.imageUrl] : [],
        metadata: {
          card_id: item.cardId,
        },
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  // Store items data as JSON in metadata (for webhook processing)
  // Stripe has a 500 char limit per metadata value, so we store minimal info
  const itemsMetadata = items.map((item) => ({
    id: item.cardId,
    qty: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      // Store items as JSON (webhook will parse this)
      cart_items: JSON.stringify(itemsMetadata),
      is_cart_checkout: 'true',
    },
    payment_intent_data: {
      setup_future_usage: 'on_session',
    },
  });

  return session;
}
