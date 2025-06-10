import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { liste } from '@/app/api-controller/score'

export async function GET(req: NextRequest) {
  try {
    const data = await liste(req)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors du traitement de la requête', error)

    return NextResponse.json({ erreur: true, message: 'Erreur lors du traitement de la requête' }, { status: 500 })
  }
}
