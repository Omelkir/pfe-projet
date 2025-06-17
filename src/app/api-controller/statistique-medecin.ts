import pool from '@/utils/connexion'

export const statistiqueMedecin = async (req: any) => {
  try {
    const json: any = req
    const urlParams = new URLSearchParams(new URL(json.url).search)

    // Convertir les paramètres en un objet JSON
    const paramsObj = Object.fromEntries(urlParams.entries())
    let whereClause = ''

    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['getall', 'page', 'limit'].indexOf(key) === -1) {
        if (index === 0) {
          whereClause += ` WHERE ${key} = ${paramsObj[key]}`
        } else {
          whereClause += ` AND ${key} = ${paramsObj[key]}`
        }
      }
    })
    const sql = `SELECT * FROM relation_patient ${whereClause}`

    const [rows] = await pool.query(sql)
    const data: any = rows

    return { erreur: false, data: data }
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
