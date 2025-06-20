import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import fs from 'fs'

import { v4 as uuidv4 } from 'uuid'

import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const formData = await req.formData()
    const file = formData.get('analyse') as File

    req.checkUrl = ''

    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public', 'pdf')

      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const filename = `${uuidv4()}_${file.name}`
      const filepath = path.join(uploadDir, filename)

      req.checkUrl = '/pdf/' + filename
      await writeFile(filepath, buffer)
    }

    const json: Record<string, any> = {}

    formData.forEach((value: any, key: any) => {
      json[key] = value
    })

    const sql = `INSERT INTO medi_connect.analyse (id_patient, titre, detail,id_el,el,analyse) 
                       VALUES ('${json.id_patient}', '${json.titre}', '${json.detail}','${json.id_el}','${json.el}','${req.checkUrl}')`

    await pool.query(sql)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const modifier = async (req: any) => {
  try {
    const formData = await req.formData()
    const file = formData.get('analyse') as File
    let checkUrl = formData.get('currentAnalyse') || ''
    let ann = ''

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')

      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const filename = `${uuidv4()}_${file.name}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)
      checkUrl = '/uploads/' + filename
      ann = ` ,analyse='${checkUrl}' `
    }

    const json: Record<string, any> = {}

    formData.forEach((value: any, key: any) => {
      json[key] = value
    })

    const id = json.id
    const sql = `UPDATE medi_connect.analyse SET titre ='${json.titre}',detail ='${json.detail}' ${ann} where id='${id}'`

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
      if (paramsObj[key] && ['getall', 'page', 'limit'].indexOf(key) === -1) {
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
    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.analyse ${whereClause}`

    const totalCountResult: any = await pool.query(totalCountQuery)
    const totalCount = totalCountResult[0][0].count

    if (paramsObj['getall'] !== undefined) {
      itemsPerPage = totalCount
    }

    const offset = (currentPage - 1) * itemsPerPage

    const sql = `SELECT * FROM analyse ${whereClause} LIMIT
    ${itemsPerPage}
OFFSET
    ${offset}`

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
      firstPageUrl: `/api/analyse/liste?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/analyse/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/analyse/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/analyse/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur lors de la récupération des analyses:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const supprimer = async (req: any) => {
  try {
    const id = req.params.id

    if (!id) {
      return { erreur: true, message: 'ID is required' }
    }

    const sql = `DELETE FROM medi_connect.analyse WHERE id='${id}'`
    const result: any = await pool.query(sql, [id])

    if (result.affectedRows === 0) {
      return { erreur: true, message: 'analyse non trouvé' }
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Error deleting:', error)

    return { erreur: true, message: 'Erreur lors de la suppression' }
  }
}
