'use client'

import { useState } from 'react'

import { Card, CardContent, Grid } from '@mui/material'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'

import Table from './Table'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'

const DemandeRendezVous = () => {
  const [update, setUpdate] = useState<string>('')
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleOpenDeleteModal = (laboratoire: any = null) => {
    setSelected(laboratoire)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/consultation/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success('Le rendez-vous a été supprimé avec succès')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleConfirmDelete = async () => {
    await handleDelete(selected)
    setIsDeleteModalOpen(false)
  }

  return (
    <div>
      <Card className='h-screen'>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Demandes de rendez-vous' />

          <Grid item xs={12}>
            <Table onDelete={handleOpenDeleteModal} update={update} setUpdate={setUpdate} />
          </Grid>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        label={`ce rendez-vous`}
      />
    </div>
  )
}

export default DemandeRendezVous
