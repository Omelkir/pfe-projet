import pool from '@/utils/connexion'

export const updateApprovalMedecin = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.medecin
      SET isApproved =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const updateApprovalLaboratoire = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.laboratoire
      SET isApproved =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const updateApprovalPatient = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.patient
      SET isApproved =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const updateApprovalConsultation = async (body: any) => {
  try {
    const { id_el, el, id, id_patient } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sqlVerif = `
      Select * from  medi_connect.relation_patient
      WHERE id_el = '${id_el}' and el = '${el}' and id_patient = '${id_patient}'
    `

    const [rows]: any = await pool.query(sqlVerif)

    if (rows?.length === 0) {
      await pool.query(
        `INSERT INTO medi_connect.relation_patient (el, id_el, id_patient) VALUES ('${el}','${id_el}','${id_patient}')`
      )
    }

    

    const sql = `
      UPDATE medi_connect.consultation
      SET isApproved =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}
