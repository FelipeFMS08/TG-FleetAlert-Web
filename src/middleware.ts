// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const accountUrl = '/account/login';

  const isAccountPage = req.nextUrl.pathname === accountUrl;

  if (!token && !isAccountPage) {
    return NextResponse.redirect(new URL(accountUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|account).*)',
    
  ],
};
