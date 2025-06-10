import type { RowDataPacket } from 'mysql2'

import pool from '@/utils/connexion'

export const liste = async (req: any) => {
  try {
    const json: any = req
    const urlParams = new URLSearchParams(new URL(json.url).search)

    const paramsObj = Object.fromEntries(urlParams.entries())

    let whereClause = ' WHERE 1 '
    let currentPage = 1
    let itemsPerPage = 6

    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['page', 'limit'].indexOf(key) === -1) {
        if (key === 'nom_ut') {
          whereClause += ` AND m.${key} like '%${paramsObj[key]}%'`
        } else {
          whereClause += ` AND m.${key} = '${paramsObj[key]}'`
        }
      }

      if (key === 'page') {
        currentPage = parseInt(paramsObj[key] as string)
      }

      if (key === 'limit') {
        itemsPerPage = parseInt(paramsObj[key] as string)
      }
    })
    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.medecin m ${whereClause}`

    const totalCountResult: any = await pool.query(totalCountQuery)

    const totalCount = totalCountResult[0][0].count

    const offset = (currentPage - 1) * itemsPerPage

    const sql = `SELECT
    m.*,
    COALESCE(AVG(s.pr) * 5 / 100, 0) AS sc,
    sp.spe AS spe,
    v.ville AS ville
  FROM medi_connect.medecin m
  LEFT JOIN medi_connect.score s
    ON s.id_el = m.id AND s.el = 2 
  LEFT JOIN medi_connect.specialite sp
   ON m.id_spe = sp.id
  LEFT JOIN medi_connect.ville v
   ON m.id_ville = v.id
  ${whereClause} 
  GROUP BY m.id  
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
      firstPageUrl: `/api/medecin/liste?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/medecin/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/medecin/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/medecin/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur SQL:', error)

    return { erreur: true, message: 'Erreur lors de la récupération des données' }
  }
}
