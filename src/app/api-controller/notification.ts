import { log } from 'console'

import pool from '@/utils/connexion'

export const getNotification = async (req: any) => {
  try {
    const json: any = req
    const urlParams = new URLSearchParams(new URL(json.url).search)

    const paramsObj = Object.fromEntries(urlParams.entries())
    let whereClause = ''

    console.log(paramsObj)
    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['page', 'limit'].indexOf(key) === -1) {
        if (index === 0) {
          whereClause += ` WHERE ${key} = ${paramsObj[key]}`
        } else {
          whereClause += ` AND ${key} = ${paramsObj[key]}`
        }
      }
    })

    if (paramsObj.el === '4') {
      const sql = `SELECT n.*,p.nom as nom,p.prenom as prenom,p.image as image FROM notification n LEFT JOIN patient p ON n.id_patient = p.id ${whereClause}`

      const [rows]: any = await pool.query(sql)
      const data = rows
      const total = data.length
      const vuno = data.filter((item: any) => item.vu != 1).length

      return {
        erreur: false,
        data,
        total,
        vuno
      }
    } else if (paramsObj.el === '3') {
      const sql = `SELECT n.*,l.nom_ut as nom_ut,l.image as image FROM notification n LEFT JOIN laboratoire l ON n.id_patient = l.id ${whereClause}`

      const [rows]: any = await pool.query(sql)
      const data = rows
      const total = data.length
      const vuno = data.filter((item: any) => item.vu != 1).length

      return {
        erreur: false,
        data,
        total,
        vuno
      }
    } else if (paramsObj.el === '2') {
      const sql = `SELECT n.*,m.nom_ut as nom_ut,m.image as image FROM notification n LEFT JOIN medecin m ON n.id_patient = m.id ${whereClause}`

      const [rows]: any = await pool.query(sql)
      const data = rows
      const total = data.length
      const vuno = data.filter((item: any) => item.vu != 1).length

      return {
        erreur: false,
        data,
        total,
        vuno
      }
    } else if (paramsObj.el === '1') {
      const sql = `SELECT n.*,a.nom_ut as nom_ut,a.image as image FROM notification n LEFT JOIN admin a ON n.id_patient = a.id ${whereClause} ORDER BY n.vu ASC`

      const [rows]: any = await pool.query(sql)
      const data = rows
      const total = data.length
      const vuno = data.filter((item: any) => item.vu != 1).length

      return {
        erreur: false,
        data,
        total,
        vuno
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const vu = async (body: any) => {
  try {
    const { id } = body

    console.log('id', id)

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.notification
      SET vu = 1
      WHERE id_recepteur = ${id} AND vu = 0
    `

    await pool.query(sql)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}
