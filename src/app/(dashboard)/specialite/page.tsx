'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Grid } from '@mui/material'

import { Plus } from 'lucide-react'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'
import Table from './Table'

import SpecialiteModal from '@/components/modals/specialite'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'

const Specialite = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>('')

  const handleOpenModal = (spe: any = null) => {
    setSelected(spe)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (spe: any = null) => {
    setSelected(spe)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/specialite/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success('Le ville a été supprimé avec succès')
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
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Spécialité' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenModal()}
          >
            <Plus className='mr-2' /> Ajouter
          </Button>

          <SpecialiteModal
            isOpen={isModalOpen}
            speData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            label={`le spécialité ${selected?.spe}`}
          />

          <Grid item xs={12}>
            <Table onEdit={handleOpenModal} onDelete={handleOpenDeleteModal} update={update} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Specialite
