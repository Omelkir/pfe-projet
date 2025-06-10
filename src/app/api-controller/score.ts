import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    await pool.query(`INSERT INTO medi_connect.score (id_el,el,user,pr) 
                       VALUES ('${json.id_el}','${json.el}','${json.user}','${json.pr}')`)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const liste = async (req: any) => {
  try {
    const sql = `SELECT *,AVG(pr) as score FROM medi_connect.score group by id_el`

    await pool.query(sql)
    const [rows] = await pool.query(sql)
    const data: any = rows

    return { erreur: false, data: data }
  } catch (error) {
    console.error('Erreur lors de la récupération des villes:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
