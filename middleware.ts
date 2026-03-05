import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware for handling Supabase auth session
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - require authentication
  const protectedPaths = ['/collection', '/activity', '/api/checkout', '/api/purchases'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !user) {
    // API routes should return JSON 401, not redirect to HTML login page
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin routes - require operator role
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is operator
    const { data: operator } = await supabase
      .from('operators')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!operator) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  const authPaths = ['/login'];
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/webhooks (webhook endpoints don't need auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/webhooks).*)',
  ],
};
