import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { supprimer } from '@/app/api-controller/ordannance'

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ erreur: true, message: 'ID is required' }, { status: 400 })
    }

    const data = await supprimer({ params: { id } })

    return NextResponse.json(data, { status: data.erreur ? 400 : 200 })
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error)

    return NextResponse.json({ erreur: true, message: 'Erreur lors du traitement de la requête' }, { status: 500 })
  }
}
