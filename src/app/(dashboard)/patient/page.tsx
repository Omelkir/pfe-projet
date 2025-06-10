'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Grid } from '@mui/material'
import { IconUserPlus } from '@tabler/icons-react'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'
import PatientModal from '@/components/modals/patient'
import Table from './Table'

import DeleteModal from '@/components/modals/deleteModal/deleteModal'

const Patient = ({}: any) => {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [update, setUpdate] = useState<string>('')

  const handleOpenPatientModal = (patient: any = null) => {
    setSelected(patient)
    setIsPatientModalOpen(true)
  }

  const handleOpenDeleteModal = (patient: any = null) => {
    setSelected(patient)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/patient/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())
        toast.success('Le compte a été supprimé avec succès')
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
          <Arrow title='Dashboard' subTitle='Patient' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenPatientModal()}
          >
            <IconUserPlus className='mr-2' /> Ajouter
          </Button>

          <PatientModal
            isOpen={isPatientModalOpen}
            onClose={() => setIsPatientModalOpen(false)}
            patientData={selected}
            setUpdate={setUpdate}
          />

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            label={`le patient ${selected?.prenom + ' '}  ${selected?.nom}`}
          />

          <Grid item xs={12}>
            <Table onEditPatient={handleOpenPatientModal} onDeletePatient={handleOpenDeleteModal} update={update} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Patient
