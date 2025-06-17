import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { statistiqueMedecin } from '@/app/api-controller/statistique-medecin'

export async function GET(req: NextRequest) {
  try {
    const data = await statistiqueMedecin(req)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors du traitement de la requête', error)

    return NextResponse.json({ erreur: true, message: 'Erreur lors du traitement de la requête' }, { status: 500 })
  }
}
