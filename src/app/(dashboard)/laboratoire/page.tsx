'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Grid } from '@mui/material'

import { FlaskConical } from 'lucide-react'

import { toast } from 'react-toastify'

import Table from '@/app/(dashboard)/laboratoire/Table'
import Arrow from '@/views/dashboard/Arrow'
import LaboratoireModal from '@/components/modals/laboratoire'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'

const Laboratoire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>('')

  const handleOpenModal = (labo: any = null) => {
    setSelected(labo)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (labo: any = null) => {
    setSelected(labo)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/laboratoire/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success('Le laboratoire a été supprimé avec succès')
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
          <Arrow title='Dashboard' subTitle='Laboratire' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenModal()}
          >
            <FlaskConical className='mr-2' /> Ajouter
          </Button>
          <Grid item xs={12}>
            <Table onEdit={handleOpenModal} onDelete={handleOpenDeleteModal} update={update} />
          </Grid>

          <LaboratoireModal
            isOpen={isModalOpen}
            laboratoireData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            label={`l'aboratoire ${selected?.nom_ut}`}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Laboratoire
