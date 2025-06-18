import { mkdir, writeFile } from 'fs/promises'

import path from 'path'

import fs from 'fs'

import bcrypt from 'bcrypt'

import { v4 as uuidv4 } from 'uuid'

import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    req.checkUrl = ''

    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')

      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const filename = `${uuidv4()}_${file.name}`
      const filepath = path.join(uploadDir, filename)

      req.checkUrl = '/uploads/' + filename
      await writeFile(filepath, buffer)
    }

    const json: Record<string, any> = {}

    formData.forEach((value: any, key: any) => {
      json[key] = value
    })

    let table = ''

    switch (json.role) {
      case '4':
        table = 'patient'

        break
      case '2':
        table = 'medecin'

        break
      case '3':
        table = 'laboratoire'

        break

      default:
        table = ''
        break
    }

    const checkEmailSql = `SELECT * FROM medi_connect.${table} WHERE email = '${json.email}'`
    const [emailExists]: any = await pool.query(checkEmailSql)

    if (emailExists.length > 0) {
      return { erreur: true, message: "L'email est déjà utilisé." }
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(json.mdp, saltRounds)

    if (table === 'patient') {
      const sql = `INSERT INTO medi_connect.patient (nom, prenom, email, mdp, role, image, id_ville, approuve, age, tel)
    VALUES ('${json.nom}', '${json.prenom}','${json.email}','${hashedPassword}', 4, '${req.checkUrl}', '${json.id_ville}', 0, '${json.age}', '${json.tel}')`

      const [insertResult]: any = await pool.query(sql)
      const patientId = insertResult.insertId

      console.log('patientId', patientId)

      const [patientRows]: any = await pool.query(
        `SELECT nom, prenom FROM medi_connect.patient WHERE id = ${patientId}`
      )

      const { nom, prenom } = patientRows[0] || {}
      const message = `<strong>${prenom} ${nom}</strong> a créé un compte(Patient).`

      await pool.query(
        `INSERT INTO medi_connect.notification (date, id_recepteur, el, vu, titre, message, id_patient)
     VALUES (NOW(), '1', '1', 0, 'Création d''un compte', ?, ?)`,
        [message, patientId]
      )
    } else if (table === 'medecin') {
      const sql = `INSERT INTO medi_connect.medecin (nom_ut, email, mdp, role, image, tarif, id_ville, heurD, heurF, id_spe, info, approuve, adresse)
    VALUES ('${json.nom_ut}', '${json.email}', '${hashedPassword}', 2, '${req.checkUrl}', '${json.tarif}', '${json.id_ville}', '${json.heurD}', '${json.heurF}', '${json.id_spe}', '${json.info}', 0, '${json.adresse}')`

      const [insertResult]: any = await pool.query(sql)
      const medecinId = insertResult.insertId

      console.log('medecinId', medecinId)

      const [rows]: any = await pool.query(`SELECT nom_ut FROM medi_connect.medecin WHERE id = ${medecinId}`)
      const { nom_ut } = rows[0] || {}
      const message = `<strong>${nom_ut}</strong> a créé un compte(Médecin).`

      await pool.query(
        `INSERT INTO medi_connect.notification (date, id_recepteur, el, vu, titre, message, id_patient)
     VALUES (NOW(), '1', '1', 0, 'Création d''un compte', ?, ?)`,
        [message, medecinId]
      )
    } else if (table === 'laboratoire') {
      const sql = `INSERT INTO medi_connect.laboratoire (nom_ut, email, mdp, role, image, id_ville, heurD, heurF, info, approuve, mode_pre, adresse)
    VALUES ('${json.nom_ut}', '${json.email}', '${hashedPassword}', 3, '${req.checkUrl}', '${json.id_ville}', '${json.heurD}', '${json.heurF}', '${json.info}', 0, '${json.mode_pre}', '${json.adresse}')`

      const [insertResult]: any = await pool.query(sql)
      const laboId = insertResult.insertId

      console.log('laboId', laboId)
      const [rows]: any = await pool.query(`SELECT nom_ut FROM medi_connect.laboratoire WHERE id = ${laboId}`)
      const { nom_ut } = rows[0] || {}
      const message = `<strong>${nom_ut}</strong> a créé un compte(Laboratoire).`

      await pool.query(
        `INSERT INTO medi_connect.notification (date, id_recepteur, el, vu, titre, message,id_patient)
     VALUES (NOW(), '1', '1', 0, 'Création d''un compte', ?, ?)`,
        [message, laboId]
      )
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}
