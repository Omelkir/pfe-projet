import pool from '@/utils/connexion'

export const desactivePatient = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.patient
      SET approuve = 0, archive = 1
      WHERE id = ?
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const activePatient = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.patient
      SET approuve = 1, archive = 0
      WHERE id = ?
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const desactiveMedecin = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.medecin
      SET approuve = 0, archive = 1
      WHERE id = ?
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}

export const activeMedecin = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.medecin
      SET approuve = 1, archive = 0
      WHERE id = ?
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}
