import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  const publicPaths = ['/login', '/login/admin', '/login/teacher', '/unauthorized'];

  if (publicPaths.some(path => pathname.startsWith(path))) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        const role = payload.role;

        const redirectMap = {
          ADMIN: '/admin',
          TEACHER: '/teacher',
          STUDENT: '/student',
        };

        return NextResponse.redirect(new URL(redirectMap[role as keyof typeof redirectMap], req.url));
      } catch {
      }
    }
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/teacher') && role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/student') && role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
