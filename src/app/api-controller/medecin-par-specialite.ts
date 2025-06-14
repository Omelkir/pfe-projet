import pool from '@/utils/connexion'

export const liste = async (req: any) => {
  try {
    const urlParams = new URLSearchParams(new URL(req.url).search)
    const paramsObj = Object.fromEntries(urlParams.entries())

    let whereClause = 'WHERE 1=1'

    if (paramsObj.specialites) {
      const specialites = paramsObj.specialites
        .split(',')
        .map(s => `'${s.trim().toLowerCase()}'`)
        .join(',')

      whereClause += ` AND LOWER(specialite) IN (${specialites})`
    }

    const sql = `
      SELECT id, nom, prenom, ville, specialite
      FROM medi_connect.medecin
      ${whereClause}
    `

    const [rows] = await pool.query(sql)

    return { erreur: false, data: rows }
  } catch (error) {
    console.error('Erreur SQL:', error)

    return { erreur: true, message: 'Erreur lors de la récupération des données' }
  }
}
