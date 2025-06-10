import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { updateApprovalPatient } from '@/app/api-controller/approuve'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await updateApprovalPatient(body)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors du traitement de la requête', error)

    return NextResponse.json({ erreur: true, message: 'Erreur lors du traitement de la requête' }, { status: 500 })
  }
}
