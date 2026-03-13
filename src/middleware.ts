import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-admin routes entirely
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Login page — forward a marker on the *request* headers so the Server Component layout can read it
  if (pathname.startsWith("/admin/login")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-login", "1");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session (important for token rotation)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.delete("error");
    return NextResponse.redirect(loginUrl);
  }

  // Check whitelist
  const { data: allowed } = await supabase
    .from("admin_whitelist")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!allowed) {
    // Signed in but not whitelisted — sign them out and redirect
    await supabase.auth.signOut();
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("error", "not_whitelisted");
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
