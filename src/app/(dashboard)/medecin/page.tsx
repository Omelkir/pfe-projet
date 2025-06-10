'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Grid } from '@mui/material'

import { Stethoscope } from 'lucide-react'

import { toast } from 'react-toastify'

import Table from '@/app/(dashboard)/medecin/Table'

import Arrow from '@/views/dashboard/Arrow'
import MedecinModal from '@/components/modals/medecin'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'

const Medecin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>('')

  const handleOpenModal = (med: any = null) => {
    setSelected(med)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (med: any = null) => {
    setSelected(med)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/medecin/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success('Le médecin a été supprimé avec succès')
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
          <Arrow title='Dashboard' subTitle='Médecin' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenModal()}
          >
            <Stethoscope className='mr-2' /> Ajouter
          </Button>
          <Grid item xs={12}>
            <Table onEdit={handleOpenModal} onDelete={handleOpenDeleteModal} update={update} />
          </Grid>

          <MedecinModal
            isOpen={isModalOpen}
            medecinData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            label={`le médecin ${selected?.nom_ut}`}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Medecin
