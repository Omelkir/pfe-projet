'use client'

import { useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'

export default function ReclamationModal({
  isOpen,
  onClose,
  recData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  recData?: any
  setUpdate: any
}) {
  const [reponse, setReponse] = useState<string>('') // Déclare le type explicitement comme string

  const [controls, setControls] = useState<{ reponse: boolean }>({
    reponse: false
  })

  const handleSave = async () => {
    try {
      // Valider que la réponse n'est pas vide
      const newControls = {
        reponse: reponse.trim() === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      // Corps de la requête
      const requestBody = JSON.stringify({
        reponse,
        email: recData?.email,
        nom: recData?.nom,
        prenom: recData?.prenom
      })

      const url = `${window.location.origin}/api/reclamation/reponse`

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }

      // Effectuer la requête
      const response = await fetch(url, requestOptions)

      const responseData = await response.json()

      // Mise à jour de l'état après la réponse
      setUpdate(Date.now().toString())

      if (responseData.erreur) {
        toast.error('Erreur !')
      } else {
        toast.success('La réponse a été envoyée avec succès')
        onClose() // Fermer le modal après envoi
      }
    } catch (error) {
      console.log('Erreur:', error)
      toast.error("Une erreur est survenue lors de l'envoi de la réponse.")
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className='block w-full text-center'>Réclamation</span>}
      footer={
        <div className='flex justify-end gap-2'>
          <Button
            variant='contained'
            style={{ backgroundColor: 'white', color: 'black' }}
            size='small'
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button variant='contained' color='primary' size='small' onClick={handleSave}>
            Envoyer
          </Button>
        </div>
      }
    >
      <form noValidate autoComplete='off' className='w-full space-y-6'>
        <Grid container spacing={3}>
          <span className='block w-full text-center p-3'>{recData?.message}</span>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Réponse'
              multiline
              className={`${controls.reponse ? 'isReq' : ''}`}
              value={reponse}
              onChange={e => setReponse(e.target.value)}
              minRows={2}
              maxRows={3}
              InputLabelProps={{
                sx: {
                  fontSize: '0.875rem', // mobile: 12px
                  '@media (min-width:768px)': {
                    fontSize: '1rem' // md+: 16px
                  }
                }
              }}
            />
            {controls.reponse ? <span className='errmsg'>Veuillez entrer une réponse.</span> : null}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
