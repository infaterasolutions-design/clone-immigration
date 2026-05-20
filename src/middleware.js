import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Enforce www — redirect non-www to www
  if (host === 'unitedstatesimmigrationnews.com') {
    const wwwUrl = new URL(request.url);
    wwwUrl.host = 'www.unitedstatesimmigrationnews.com';
    wwwUrl.protocol = 'https:';
    return NextResponse.redirect(wwwUrl, { status: 301 });
  }

  // Enforce HTTPS — redirect http://www to https://www
  if (url.protocol === 'http:' && host === 'www.unitedstatesimmigrationnews.com') {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|icons/).*)',
  ],
};
