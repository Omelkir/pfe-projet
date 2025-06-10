'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Grid } from '@mui/material'

import { Plus } from 'lucide-react'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'
import Table from './Table'

import ServiceModal from '@/components/modals/service'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'

const Service = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>('')

  const handleOpenModal = (ser: any = null) => {
    setSelected(ser)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (ser: any = null) => {
    setSelected(ser)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/service/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success('Le service a été supprimé avec succès')
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
          <Arrow title='Dashboard' subTitle='Service' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenModal()}
          >
            <Plus className='mr-2' /> Ajouter
          </Button>

          <ServiceModal
            isOpen={isModalOpen}
            serData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            label={`le service ${selected?.ser}`}
          />

          <Grid item xs={12}>
            <Table onEdit={handleOpenModal} onDelete={handleOpenDeleteModal} update={update} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Service
