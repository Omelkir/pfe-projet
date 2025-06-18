import pool from '@/utils/connexion'

export const statistiqueAdmin = async (req: any) => {
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

    const sqlPatient = `SELECT * FROM patient ${whereClause}`
    const [rowsPatient] = await pool.query(sqlPatient)
    const dataPatient: any = rowsPatient

    const patientsParMois = Array(12).fill(0)

    dataPatient.forEach((patient: any) => {
      if (patient.date) {
        const mois = new Date(patient.date).getMonth()

        patientsParMois[mois] += 1
      }
    })
    const sqlMedecin = `SELECT * FROM medecin ${whereClause}`
    const [rowsMedecin] = await pool.query(sqlMedecin)
    const dataMedecin: any = rowsMedecin

    const medecinsParMois = Array(12).fill(0)

    dataMedecin.forEach((medecin: any) => {
      if (medecin.date) {
        const mois = new Date(medecin.date).getMonth()

        medecinsParMois[mois] += 1
      }
    })
    const sqlLabo = `SELECT * FROM laboratoire ${whereClause}`
    const [rowsLabo] = await pool.query(sqlLabo)
    const dataLabo: any = rowsLabo

    const labosParMois = Array(12).fill(0)

    dataLabo.forEach((labo: any) => {
      if (labo.date) {
        const mois = new Date(labo.date).getMonth()

        labosParMois[mois] += 1
      }
    })

    return {
      erreur: false,
      dataPatient,
      statistiquesPatient: {
        patientsParMois,
        total: dataPatient.length
      },
      dataMedecin,
      statistiquesMedecin: {
        medecinsParMois,
        total: dataMedecin.length
      },
      dataLabo,
      statistiquesLabo: {
        labosParMois,
        total: dataLabo.length
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
