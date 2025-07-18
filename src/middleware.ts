import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export async function middleware(req: NextRequest) {
  
  const { pathname } = req.nextUrl;
  console.log('[middleware] path:', pathname);

  const token = req.cookies.get('token')?.value;

  const publicPaths = [
    '/admin/login',
    '/teacher/login',
    '/student/login',
    '/unauthorized'
  ];

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    if (token && pathname.endsWith('/login')) {
      try {
        const { payload } = await jwtVerify(token, secret);
        const role = payload.role as Role;
        
        const dashboardPaths = {
          ADMIN: '/admin/dashboard',
          TEACHER: '/teacher/dashboard',
          STUDENT: '/student/dashboard'
        };

        return NextResponse.redirect(new URL(dashboardPaths[role], req.url));
      } catch {
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    }
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/student/login', req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL('/student/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as Role;

    const protectedPaths = {
      '/admin': 'ADMIN',
      '/teacher': 'TEACHER',
      '/student': 'STUDENT'
    };

    for (const [path, requiredRole] of Object.entries(protectedPaths)) {
      if (pathname.startsWith(path) && role !== requiredRole) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/student/login', req.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/',
    '/admin',
    '/admin/:path*',
    '/teacher',
    '/teacher/:path*',
    '/student',
    '/student/:path*',
    '/admin/login',
    '/teacher/login',
    '/student/login',
    '/unauthorized'
  ],
};