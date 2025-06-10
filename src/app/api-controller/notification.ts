import pool from '@/utils/connexion'

export const getNotification = async (req: any) => {
  try {
    const json: any = req
    const urlParams = new URLSearchParams(new URL(json.url).search)

    const paramsObj = Object.fromEntries(urlParams.entries())
    let whereClause = ''

    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['page', 'limit'].indexOf(key) === -1) {
        if (index === 0) {
          whereClause += ` WHERE ${key} = ${paramsObj[key]}`
        } else {
          whereClause += ` AND ${key} = ${paramsObj[key]}`
        }
      }
    })
    const sql = `SELECT n.*,p.nom as nom,p.prenom as prenom,p.image as image FROM notification n LEFT JOIN patient p ON n.id_patient = p.id ${whereClause}`

    const [rows]: any = await pool.query(sql)

    const data = rows // selon ton driver (pg ou mysql), adapte ici
    const total = data.length
    const vuno = data.filter((item: any) => item.vu != 1).length

    return {
      erreur: false,
      data,
      total,
      vuno
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const vu = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.notification
      SET vu =1
      WHERE id = ${id}
    `

    await pool.query(sql)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}
