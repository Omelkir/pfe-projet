import pool from '@/utils/connexion'

export const statistiqueMedecin = async (req: any) => {
  try {
    const json: any = req
    const urlParams = new URLSearchParams(new URL(json.url).search)

    const paramsObj = Object.fromEntries(urlParams.entries())
    let whereClause = ''

    Object.keys(paramsObj).forEach((key, index) => {
      if (paramsObj[key] && ['getall', 'page', 'limit'].indexOf(key) === -1) {
        if (index === 0) {
          whereClause += ` WHERE ${key} = ${paramsObj[key]}`
        } else {
          whereClause += ` AND ${key} = ${paramsObj[key]}`
        }
      }
    })

    const sqlPatient = `SELECT * FROM relation_patient ${whereClause}`
    const [rowsPatient] = await pool.query(sqlPatient)
    const dataPatient: any = rowsPatient

    const patientsParMois = Array(12).fill(0)

    dataPatient.forEach((patient: any) => {
      if (patient.date) {
        const mois = new Date(patient.date).getMonth()

        patientsParMois[mois] += 1
      }
    })
    const sqlRendezvous = `SELECT * FROM consultation ${whereClause}`
    const [rowsRendezvous] = await pool.query(sqlRendezvous)
    const dataRendezvous: any = rowsRendezvous

    const rendezvousParMois = Array(12).fill(0)

    dataRendezvous.forEach((rendezVous: any) => {
      if (rendezVous.date_creation) {
        const mois = new Date(rendezVous.date_creation).getMonth()

        rendezvousParMois[mois] += 1
      }
    })

    return {
      erreur: false,
      dataPatient,
      statistiquesPatient: {
        patientsParMois,
        total: dataPatient.length
      },
      dataRendezvous,
      statistiquesRendezvous: {
        rendezvousParMois,
        total: dataRendezvous.length
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
