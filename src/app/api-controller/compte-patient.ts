import pool from '@/utils/connexion'

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
        // Ajoute la condition WHERE
        if (index === 0) {
          whereClause += ` WHERE p.${key} = ${paramsObj[key]}`
        } else {
          whereClause += ` AND p.${key} = ${paramsObj[key]}`
        }
      }

      if (key === 'page') {
        currentPage = parseInt(paramsObj[key] as string)
      }

      if (key === 'limit') {
        itemsPerPage = parseInt(paramsObj[key] as string)
      }
    })
    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.patient p ${whereClause}`

    const totalCountResult: any = await pool.query(totalCountQuery)
    const totalCount = totalCountResult[0][0].count

    if (paramsObj['getall'] !== undefined) {
      itemsPerPage = totalCount
    }

    const offset = (currentPage - 1) * itemsPerPage

    const sql = `SELECT p.*, v.ville AS ville FROM patient p LEFT JOIN ville v ON p.id_ville = v.id ${whereClause} LIMIT
    ${itemsPerPage}
OFFSET
    ${offset}`

    console.log(sql)

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
      firstPageUrl: `/api/patient/compte-patient?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/patient/compte-patient?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/patient/compte-patient?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/patient/compte-patient?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
