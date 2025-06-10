// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')

  return NextResponse.next() // Continue vers la route demandée
}

// Spécifie où appliquer le middleware
export const config = {
  matcher: ['/api/:path*'] // Le middleware ne s'appliquera qu'aux routes API
}
