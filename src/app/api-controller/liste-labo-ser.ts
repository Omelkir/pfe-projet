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
          whereClause += ` AND l.${key} like '%${paramsObj[key]}%'`
        } else {
          whereClause += ` AND l.${key} = '${paramsObj[key]}'`
        }
      }

      if (key === 'page') {
        currentPage = parseInt(paramsObj[key] as string)
      }

      if (key === 'limit') {
        itemsPerPage = parseInt(paramsObj[key] as string)
      }
    })
    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.laboratoire l ${whereClause}`

    const totalCountResult: any = await pool.query(totalCountQuery)

    const totalCount = totalCountResult[0][0].count

    const offset = (currentPage - 1) * itemsPerPage

    const sql = `SELECT
    l.*,
    COALESCE(AVG(s.pr) * 5 / 100, 0) AS sc,
    sr.ser AS ser,
    v.ville AS ville
  FROM medi_connect.laboratoire l
  LEFT JOIN medi_connect.score s
    ON s.id_el = l.id AND s.el = 3 
  LEFT JOIN medi_connect.service sr
   ON l.id_ser = sr.id
  LEFT JOIN medi_connect.ville v
   ON l.id_ville = v.id
  ${whereClause} 
  GROUP BY l.id  
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
      firstPageUrl: `/api/laboratoire/liste?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/laboratoire/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/laboratoire/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/laboratoire/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur SQL:', error)

    return { erreur: true, message: 'Erreur lors de la récupération des données' }
  }
}
