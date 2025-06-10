'use client'

import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Autocomplete, Button, Card, CardContent, Grid, TextField } from '@mui/material'

import { FileText } from 'lucide-react'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'

import DeleteModal from '@/components/modals/deleteModal/deleteModal'
import Table from './Table'
import AnalyseModal from '@/components/modals/analyse'
import { getStorageData } from '@/utils/helpers'

const AnalyseLaboratoire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>('')
  const [patientListe, setPatientListe] = useState<any[]>([])
  const userData = getStorageData('user')
  const searchParams = useSearchParams()
  const idFiche = searchParams.get('id')
  const [selectedPatient, setSelectedPatient] = useState<any>(idFiche ? patientListe.find(p => p.id === idFiche) : null)

  const [data, setData] = useState<any>({
    id_med: userData.id
  })

  const handleOpenModal = (analyse: any = null) => {
    setSelected(analyse)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (analyse: any = null) => {
    setSelected(analyse)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (row: any) => {
    const id = row?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/analyse/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success("L'analyse a été supprimé avec succès")
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleConfirmDelete = async () => {
    await handleDelete(selected)
    setIsDeleteModalOpen(false)
  }

  async function getPatientListe() {
    const url = `${window.location.origin}/api/patient/liste?id_el=${userData.id}&el=${userData.role}`

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) throw new Error('Erreur lors de la requête')

    const responseData = await response.json()

    if (idFiche !== null) {
      setSelectedPatient(responseData?.data?.find((p: any) => p.id == idFiche))
    }

    console.log('API Response:', responseData)

    if (responseData.erreur) {
      alert(responseData.message)
    } else {
      setPatientListe(responseData.data)
    }
  }

  useEffect(() => {
    getPatientListe()
  }, [])
  console.log('selectedPatient', selectedPatient)

  return (
    <div>
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Analyse' />

          <div className='flex items-center gap-4 mt-12 mb-12'>
            {idFiche === null && (
              <div className='flex-1'>
                <Autocomplete
                  className='w-1/3'
                  options={patientListe}
                  getOptionLabel={(option: any) => `${option.nom} ${option.prenom}`}
                  value={patientListe.find(p => p.id === data?.patient) || null}
                  onChange={(event, newValue) => {
                    setData((prev: any) => ({
                      ...prev,
                      patient: newValue?.id || null
                    }))
                    setSelectedPatient(newValue || null)
                  }}
                  renderInput={params => <TextField {...params} label='Patient' variant='outlined' fullWidth />}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </div>
            )}
            <Button
              variant='contained'
              color='primary'
              className='h-14 min-w-[120px] mr-4'
              onClick={() => handleOpenModal()}
            >
              <FileText className='mr-2' /> Ajouter
            </Button>
          </div>

          <Grid item xs={12}>
            <Table
              onEdit={handleOpenModal}
              onDelete={handleOpenDeleteModal}
              update={update}
              patient={selectedPatient}
            />
          </Grid>

          <AnalyseModal
            isOpen={isModalOpen}
            analyseData={selected}
            patient={selectedPatient}
            id_el={userData.id}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            label={`l'analyse`}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyseLaboratoire
