import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    const sql = `INSERT INTO medi_connect.ordonnance ( id_patient,id_el,el,medi,duree,dosage,id_cons) VALUES ('${json.id_patient}','${json.id_el}','${json.el}','${json.medi}','${json.duree}','${json.dosage}','${json.id_cons}')`

    await pool.query(sql)

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
    let currentPage = 1
    let itemsPerPage = 6

    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['getall', 'page', 'limit'].indexOf(key) === -1) {
        if (index === 0) {
          whereClause += ` WHERE o.${key} = ${paramsObj[key]}`
        } else {
          whereClause += ` AND o.${key} = ${paramsObj[key]}`
        }
      }

      if (key === 'page') {
        currentPage = parseInt(paramsObj[key] as string)
      }

      if (key === 'limit') {
        itemsPerPage = parseInt(paramsObj[key] as string)
      }
    })
    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.ordonnance o ${whereClause}`

    const totalCountResult: any = await pool.query(totalCountQuery)
    const totalCount = totalCountResult[0][0].count

    if (paramsObj['getall'] !== undefined) {
      itemsPerPage = totalCount
    }

    const offset = (currentPage - 1) * itemsPerPage

    const sql = `
  SELECT 
    o.id AS id,
    o.medi AS medi, 
    o.duree AS duree, 
    o.dosage AS dosage, 
    c.date AS consultation_date,
    c.id AS consultation_id
  FROM consultation c
  LEFT JOIN ordonnance o ON o.id_cons = c.id
  ${whereClause}
  LIMIT ${itemsPerPage}
  OFFSET ${offset}
`

    const [rows] = await pool.query(sql)
    const data: any = rows

    const pi: any = {
      total: totalCount,
      currentPage: currentPage,
      count: data.length,
      lastPage: Math.ceil(totalCount / itemsPerPage),
      firstItem: offset + 1,
      lastItem: offset + data.length,
      perPage: itemsPerPage.toString(),
      firstPageUrl: `/api/ordonnance/liste?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/ordonnance/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/ordonnance/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/ordonnance/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur lors de la récupération des ordonnances:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const modifier = async (req: any) => {
  try {
    const json: any = req
    const id = json.id
    const sql = `UPDATE medi_connect.ordonnance SET medi ='${json.medi}',duree ='${json.duree}',dosage ='${json.dosage}' where id='${id}'`

    await pool.query(sql)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const supprimer = async (req: any) => {
  try {
    const id = req.params.id

    if (!id) {
      return { erreur: true, message: 'ID is required' }
    }

    const sql = `DELETE FROM medi_connect.ordonnance WHERE id='${id}'`
    const result: any = await pool.query(sql, [id])

    if (result.affectedRows === 0) {
      return { erreur: true, message: 'ordonnance non trouvé' }
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Error deleting:', error)

    return { erreur: true, message: 'Erreur lors de la suppression' }
  }
}
