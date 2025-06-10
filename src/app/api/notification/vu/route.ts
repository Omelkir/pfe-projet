import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { vu } from '@/app/api-controller/notification'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await vu(body)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors du traitement de la requête', error)

    return NextResponse.json({ erreur: true, message: 'Erreur lors du traitement de la requête' }, { status: 500 })
  }
}
