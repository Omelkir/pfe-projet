import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import nodemailer from 'nodemailer'
import { MdToken } from 'react-icons/md'

import pool from '@/utils/connexion'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { to, role, text } = body

  console.log('role', role)

  let table = ''

  switch (role) {
    case 1:
      table = 'admin'

      break
    case 2:
      table = 'medecin'

      break
    case 3:
      table = 'laboratoire'

      break
    case 4:
      table = 'patient'

      break

    default:
      table = ''
      break
  }

  const token: any = crypto.randomUUID()

  await pool.query(`UPDATE medi_connect.${table} SET token = '${token}' where email='${to}'`)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mediconnect048@gmail.com',
      pass: 'gkka ctir ardv fyea'
    }
  })

  try {
    await transporter.sendMail({
      from: 'mediconnect048@gmail.com',
      to,
      subject: 'Demmande de réinitialisation mot de passe',
      html: `
      <p>Bonjour <strong>${to}</strong>,</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <p>
        <a href="http://localhost:3000/reset-password?token=${token}&to=${to}&role=${role}" style="color: #007bff; text-decoration: none; font-weight: bold;">
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p>Si vous n'avez pas demandé de réinitialisation, ignorez cet email.</p>
      <br/>
      <p>Cordialement,<br/>L'équipe de support</p>
    `
    })

    return NextResponse.json({ erreur: false, message: 'Mail sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)

    return NextResponse.json({ erreur: true, message: 'Failed to send mail' }, { status: 500 })
  }
}
