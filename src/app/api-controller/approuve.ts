import nodemailer from 'nodemailer'

import pool from '@/utils/connexion'

export const updateApprovalMedecin = async (body: any) => {
  try {
    const { id, email, nom_ut } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'gkka ctir ardv fyea'
      }
    })

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.medecin
      SET approuve =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    const mailOptions = {
      from: '"MediConnect" <mediconnect048@gmail.com>',
      to: email,
      subject: 'Confirmation de votre compte',
      html: `
    <p>Bonjour <strong>Dr. ${nom_ut}</strong>,</p>

    <p>Nous avons le plaisir de vous informer que votre compte a été <strong>accepté</strong>.</p>

    <p>Merci d’avoir choisi <strong>MediConnect</strong>.</p>

    <p>Cordialement,<br>
    L'équipe <strong>MediConnect</strong></p>
  `
    }

    await transporter.sendMail(mailOptions)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const updateApprovalLaboratoire = async (body: any) => {
  try {
    const { id, nom_ut, email } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'gkka ctir ardv fyea'
      }
    })

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.laboratoire
      SET approuve =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    const mailOptions = {
      from: '"MediConnect" <mediconnect048@gmail.com>',
      to: email,
      subject: 'Confirmation de votre compte',
      html: `
    <p>Bonjour <strong>${nom_ut}</strong>,</p>

    <p>Nous avons le plaisir de vous informer que votre compte a été <strong>accepté</strong>.</p>

    <p>Merci d’avoir choisi <strong>MediConnect</strong>.</p>

    <p>Cordialement,<br>
    L'équipe <strong>MediConnect</strong></p>
  `
    }

    await transporter.sendMail(mailOptions)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const updateApprovalPatient = async (body: any) => {
  try {
    const { id, email, nom, prenom } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'gkka ctir ardv fyea'
      }
    })

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.patient
      SET approuve =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    const mailOptions = {
      from: '"MediConnect" <mediconnect048@gmail.com>',
      to: email,
      subject: 'Confirmation de votre compte',
      html: `
    <p>Bonjour <strong>${nom} ${prenom}</strong>,</p>

    <p>Nous avons le plaisir de vous informer que votre compte a été <strong>accepté</strong>.</p>

    <p>Merci d’avoir choisi <strong>MediConnect</strong> pour la gestion de vos soins de santé.</p>

    <p>Nous restons à votre disposition pour toute information complémentaire.</p>

    <p>Cordialement,<br>
    L'équipe <strong>MediConnect</strong></p>
  `
    }

    await transporter.sendMail(mailOptions)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const updateApprovalConsultation = async (body: any) => {
  // try {
  const { id_el, el, id, id_patient, email, nom, prenom } = body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mediconnect048@gmail.com',
      pass: 'gkka ctir ardv fyea'
    }
  })

  if (!id) {
    return { erreur: true, message: 'Paramètres invalides' }
  }

  const sqlVerif = `
      Select * from  medi_connect.relation_patient
      WHERE id_el = '${id_el}' and el = '${el}' and id_patient = '${id_patient}'
    `

  const [rows]: any = await pool.query(sqlVerif)

  if (rows?.length === 0) {
    await pool.query(
      `INSERT INTO medi_connect.relation_patient (el, id_el, id_patient,date) VALUES ('${el}','${id_el}','${id_patient}',CURDATE())`
    )
  }

  const sql = `
      UPDATE medi_connect.consultation
      SET approuve =1
      WHERE id = ${id}
    `

  await pool.query(sql, [id])

  const mailOptions = {
    from: '"MediConnect" <mediconnect048@gmail.com>',
    to: email,
    subject: 'Confirmation de votre rendez-vous',
    html: `
    <p>Bonjour <strong>${nom} ${prenom}</strong>,</p>

    <p>Nous avons le plaisir de vous informer que votre rendez-vous a été <strong>accepté</strong>.</p>

    <p>Merci d’avoir choisi <strong>MediConnect</strong> pour la gestion de vos soins de santé.</p>

    <p>Nous restons à votre disposition pour toute information complémentaire.</p>

    <p>Cordialement,<br>
    L'équipe <strong>MediConnect</strong></p>
  `
  }

  await transporter.sendMail(mailOptions)

  return { erreur: false, data: true }

  // } catch (error) {
  //   console.error('Erreur lors de la mise à jour de l’approbation', error)

  //   return { erreur: true, message: 'Erreur lors de la mise à jour' }
  // }
}
