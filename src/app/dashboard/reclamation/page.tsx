'use client'

import { useState } from 'react'

import { Card, CardContent, Grid } from '@mui/material'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'

import DeleteModal from '@/components/modals/deleteModal/deleteModal'
import ReclamationModal from '@/components/modals/reclamation'
import Table from './Table'

const Reclamation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>(new Date().toDateString())

  const handleOpenModal = (rec: any = null) => {
    setSelected(rec)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (rec: any = null) => {
    setSelected(rec)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/reclamation/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(new Date().toDateString())
        toast.success('La réclamation a été supprimée avec succès')
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
          <Arrow title='Dashboard' subTitle='Réclamation' />

          <Grid item xs={12}>
            <Table onRead={handleOpenModal} onDelete={handleOpenDeleteModal} update={update} />
          </Grid>
          <ReclamationModal
            isOpen={isModalOpen}
            recData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            label={`La réclamation du (de la) patient(e) ${selected?.nom}`}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Reclamation
