import pool from '@/utils/connexion'

export const liste = async (req: any) => {
  try {
    function toLocalISOString(date: Date): string {
      const pad = (n: number) => n.toString().padStart(2, '0')

      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }

    const json: any = req
    const urlParams = new URLSearchParams(new URL(json.url).search)

    const paramsObj = Object.fromEntries(urlParams.entries())

    const today = new Date().toISOString().split('T')[0] // format YYYY-MM-DD
    let whereClause = `WHERE date >= '${today}' `
    let currentPage = 1
    let itemsPerPage = 6

    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['getall', 'page', 'limit'].indexOf(key) === -1) {
        whereClause += ` AND ${key} = ${paramsObj[key]}`
      }

      if (key === 'page') {
        currentPage = parseInt(paramsObj[key] as string)
      }

      if (key === 'limit') {
        itemsPerPage = parseInt(paramsObj[key] as string)
      }
    })
    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.consultation ${whereClause}`

    const totalCountResult: any = await pool.query(totalCountQuery)

    const totalCount = totalCountResult[0][0].count

    if (paramsObj['getall'] !== undefined) {
      itemsPerPage = totalCount
    }

    const offset = (currentPage - 1) * itemsPerPage

    const sql = `SELECT consultation.*,consultation.id as idd,p.nom as nom ,p.prenom as prenom, p.email as email,p.tel as tel,p.image as image FROM consultation  LEFT JOIN patient p ON consultation.id_patient = p.id ${whereClause} LIMIT ${itemsPerPage} OFFSET ${offset}`

    const [rows]: any = await pool.query(sql)

    const data = rows?.map((row: any) => {
      const appointmentDate = new Date(row.date)

      delete row.date

      return {
        ...row,
        title: `${row.id} Rendez-vous`,
        start: toLocalISOString(new Date(appointmentDate)),
        end: toLocalISOString(new Date(appointmentDate.getTime() + row.duree * 60000))
      }
    })

    const pi: any = {
      total: totalCount,
      currentPage: currentPage,
      count: data.length,
      lastPage: Math.ceil(totalCount / itemsPerPage),
      firstItem: offset + 1,
      lastItem: offset + data.length,
      perPage: itemsPerPage.toString(),
      firstPageUrl: `/api/consultation/liste?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/consultation/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/consultation/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/consultation/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur lors de la récupération des consultations:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    await pool.query(`INSERT INTO medi_connect.consultation (id_el,el,date,id_patient, isApproved, duree) 
                       VALUES ('${json.id_el}','${json.el}','${json.date}', '${json.id_patient}', 1, '${json.duree}')`)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const modifier = async (req: any) => {
  try {
    const json: any = req
    const id = json.id
    const sql = `UPDATE medi_connect.consultation SET date ='${json.date}',id_patient ='${json.id_patient}',duree ='${json.duree}' where id='${id}'`

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

    const sql = `DELETE FROM medi_connect.consultation WHERE id='${id}'`
    const result: any = await pool.query(sql, [id])

    if (result.affectedRows === 0) {
      return { erreur: true, message: 'consultation non trouvé' }
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Error deleting:', error)

    return { erreur: true, message: 'Erreur lors de la suppression' }
  }
}
