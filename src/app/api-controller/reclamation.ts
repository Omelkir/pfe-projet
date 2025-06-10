import nodemailer from 'nodemailer'

import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json = await req.json()

    const sql = `
    INSERT INTO medi_connect.reclamation (
      id_patient, type, message
    ) VALUES (
      '${json.id_patient}',
      '${json.type}',
      '${json.message}'
    
    )
  `

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

    // Convertir les paramètres en un objet JSON
    const paramsObj = Object.fromEntries(urlParams.entries())
    let whereClause = ''
    let currentPage = 1
    let itemsPerPage = 6

    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['page', 'limit'].indexOf(key) === -1) {
        // Ajoute la condition WHERE
        if (index === 0) {
          whereClause += ` WHERE ${key} = ${paramsObj[key]}`
        } else {
          whereClause += ` AND ${key} = ${paramsObj[key]}`
        }
      }

      if (key === 'page') {
        currentPage = parseInt(paramsObj[key] as string)
      }

      if (key === 'limit') {
        itemsPerPage = parseInt(paramsObj[key] as string)
      }
    })
    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.reclamation ${whereClause}`

    const totalCountResult: any = await pool.query(totalCountQuery)

    const totalCount = totalCountResult[0][0].count

    const offset = (currentPage - 1) * itemsPerPage

    const sql = `SELECT c.*, p.nom AS nom, p.prenom AS prenom ,p.email as email,p.tel as tel
    FROM reclamation c 
    LEFT JOIN patient p ON c.id_patient = p.id ${whereClause} LIMIT
        ${itemsPerPage}
    OFFSET
        ${offset}
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
      firstPageUrl: `/api/reclamation/liste?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/reclamation/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/reclamation/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/reclamation/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur lors de la récupération des reclamations:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const reponse = async (req: any) => {
  try {
    const json: any = req
    const { email, reponse, nom, prenom } = json

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'viau pxiq ietj gmoj'
      }
    })

    const mailOptions = {
      from: '"MediConnect" <mediconnect048@gmail.com>',
      to: email,
      subject: 'Bienvenue sur MediConnect',
      html: `
            <p>Bonjour <strong>${prenom + ' '}${nom}</strong>,</p>
            
           <p>Nous avons bien reçu votre réclamation et voici notre réponse :</p>
  
  <p><em>${reponse}</em></p>
  
  <p>Nous restons à votre disposition pour toute information complémentaire.</p>
  <br/>
  <p>Cordialement,<br>L'équipe MediConnect</p>
          `
    }

    await transporter.sendMail(mailOptions)

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

    const sql = `DELETE FROM medi_connect.reclamation WHERE id='${id}'`
    const result: any = await pool.query(sql, [id])

    if (result.affectedRows === 0) {
      return { erreur: true, message: 'réclamation non trouvé' }
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Error deleting:', error)

    return { erreur: true, message: 'Erreur lors de la suppression' }
  }
}
