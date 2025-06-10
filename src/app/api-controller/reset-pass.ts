import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

import pool from '@/utils/connexion'

export const reset = async (req: any) => {
  try {
    const json: any = req
    const saltRounds = 10
    let table = ''

    console.log('Role reset', json.role)

    switch (json.role) {
      case '1':
        table = 'admin'

        break
      case '2':
        table = 'medecin'

        break
      case '3':
        table = 'laboratoire'

        break
      case '4':
        table = 'patient'

        break

      default:
        table = ''
        break
    }

    console.log('mot de passe', json.mdp)

    const hashedPassword = await bcrypt.hash(json.mdp, saltRounds)

    await pool.query(`UPDATE medi_connect.${table} SET mdp = '${hashedPassword}' where token='${json.token} '`)
    await pool.query(`UPDATE medi_connect.${table} SET token = '' where token='${json.token} '`)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'gkka ctir ardv fyea'
      }
    })

    await transporter.sendMail({
      from: 'mediconnect048@gmail.com',
      to: json.to,
      subject: 'Demmande de réinitialisation mot de passe',
      html: `
          <p>Bonjour <strong>${json.to}</strong>,</p>
          <p>votre mail à été bien réinitialiser </p>
          
          <br/>
          <p>Cordialement,<br/>L'équipe de support</p>
        `
    })

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
