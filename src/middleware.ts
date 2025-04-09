import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('bfarmx-auth');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is a QR page
  const isQRPage = path.startsWith('/qr/');

  if (auth && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!auth && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If it's a QR page, allow access without authentication
  if (isQRPage) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - qr/ (QR code pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|qr/).*)',
  ],
};
