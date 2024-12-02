import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    const isStaticFile = pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico');
    const isLoginPage = pathname === '/account/login';
    const isAccountRoute = pathname.startsWith('/account');
    const isAuthRoute = pathname.startsWith('/api/auth');

    if (!token && !isAccountRoute && !isLoginPage && !isAuthRoute && !isStaticFile) {
        return NextResponse.redirect(new URL('/account/login', req.url));
    } else if (token && isAccountRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/(.*)'], 
};
