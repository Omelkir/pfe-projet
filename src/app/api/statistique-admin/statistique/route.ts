import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { statistiqueAdmin } from '@/app/api-controller/statistique-admin'

export async function GET(req: NextRequest) {
  try {
    const data = await statistiqueAdmin(req)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors du traitement de la requête', error)

    return NextResponse.json({ erreur: true, message: 'Erreur lors du traitement de la requête' }, { status: 500 })
  }
}
