import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    const sql = `INSERT INTO medi_connect.conversations (id_patient, question, reponse) 
             VALUES (?, ?, ?)`

    await pool.query(sql, [json.id_patient, json.question, json.result])
    console.log('Insertion en base de données avec :', {
      id_patient: json.id_patient,
      question: json.question,
      result: json.result
    })

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const liste = async (req: any) => {
  try {
    const json: any = req
    const urlParams = new URLSearchParams(new URL(json.url).search)

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

    const sql = `SELECT * FROM conversations ${whereClause}`

    const [rows] = await pool.query(sql)
    const data: any = rows

    return { erreur: false, data: data }
  } catch (error) {
    console.error('Erreur lors de la récupération des villes:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
