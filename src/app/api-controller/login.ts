import bcrypt from 'bcrypt'

import pool from '@/utils/connexion'

export const verifierUtilisateur = async (req: any) => {
  try {
    const { email, mdp } = req

    const sql = `
    SELECT id, nom, prenom, email, mdp, image,approuve, role,id_ville,tel,age, '' AS id_spe,  'patient' AS type
    FROM medi_connect.patient 
    WHERE email = '${email}' 
  
    UNION
  
    SELECT id, nom_ut AS nom, '' AS prenom, email, mdp, image,approuve, role, id_spe,id_ville, 'medecin' AS type ,'' AS tel,'' AS age
    FROM medi_connect.medecin 
    WHERE email = '${email}' 
  
    UNION
  
    SELECT id, nom_ut AS nom, '' AS prenom, email, mdp, image,approuve, role,id_ville, '' AS id_spe, 'laboratoire' AS type,'' AS tel,'' AS age 
    FROM medi_connect.laboratoire 
    WHERE email = '${email}' 
  
    UNION
  
    SELECT id, nom_ut AS nom, '' AS prenom, email, mdp, image,'1' AS approuve, role, '' AS id_spe, 'admin' AS type,'' AS id_ville,'' AS tel,'' AS age 
    FROM medi_connect.admin 
    WHERE email = '${email}' 
  
    LIMIT 1;
  `

    const [rows]: any = await pool.query(sql, [email])

    console.log(rows)

    if (rows.length === 0) {
      return { erreur: true, message: 'Identifiants incorrects' }
    }

    const user = rows[0]

    if (user.approuve === '0') {
      return { erreur: false, statusApprove: 'nonApprove' }
    }

    console.log(user.approuve)

    if (user.role === 1) {
      // Ne pas utiliser bcrypt pour les admins
      if (mdp !== user.mdp) {
        return { erreur: true, message: 'Identifiants incorrects' }
      }
    } else {
      // Utiliser bcrypt pour les autres (patients, médecins, labos)
      const match = await bcrypt.compare(mdp, user.mdp)

      if (!match) {
        return { erreur: true, message: 'Identifiants incorrects' }
      }
    }

    delete user.mdp

    return { erreur: false, role: user.role, user }
  } catch (error) {
    console.error(error)

    return { erreur: true, message: 'Erreur serveur' }
  }
}
