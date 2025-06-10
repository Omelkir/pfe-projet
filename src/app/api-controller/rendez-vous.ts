import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    await pool.query(`INSERT INTO medi_connect.consultation (id_el,el,date,id_patient, isApproved, duree,description) 
                          VALUES ('${json.id_el}','${json.el}','${json.date}', '${json.id_patient}',0, '${json.duree}', '${json.description}')`)

    const [result]: any = await pool.query(`SELECT nom, prenom FROM patient WHERE id = ${json.id_patient}`)
    const { nom, prenom } = result[0] || {}

    const [datePart, timePart] = json.date.split('T')

    const message = `<strong>${prenom} ${nom}</strong> a demandé un rendez-vous pour le <strong>${datePart}</strong> à <strong>${timePart}</strong> via MediConnect.`

    await pool.query(`INSERT INTO medi_connect.notification (date,id_recepteur,el,vu, titre, message) 
                          VALUES (NOW(),'${json.id_el}','${json.el}', 0,'Rendez-vous','${message}')`)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
