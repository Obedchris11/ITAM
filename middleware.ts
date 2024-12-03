import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value
  const currentPath = request.nextUrl.pathname

  // List of valid paths in your application, including submenu paths
  const validPaths = [
    '/login',
    '/Dashboard',
    '/Inspeksi',
    '/Peminjaman',
    '/Profil-User',
    '/Registrasi-Inventaris',
    '/Storage',
    '/Tambah-Pengguna'
  ]

  // List of valid parent paths that can have submenus
  const validParentPaths = ['/Registrasi-Inventaris', '/Storage']

  // Check if current path is valid or is a submenu of a valid parent path
  const isValidPath = validPaths.some(path => currentPath === path) ||
    validParentPaths.some(parentPath => currentPath.startsWith(parentPath + '/'))

  // Always allow access to login page
  if (currentPath === '/login') {
    if (authToken) {
      // If user is already logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/Dashboard', request.url))
    }
    return NextResponse.next()
  }

  // If user is not authenticated, redirect to login
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If path is not valid and user is authenticated, redirect to dashboard
  if (!isValidPath && authToken) {
    return NextResponse.redirect(new URL('/Dashboard', request.url))
  }

  // Allow access to valid paths and their submenus for authenticated users
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}