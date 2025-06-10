'use client'

import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'

import * as Tabs from '@radix-ui/react-tabs'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'

import { getStorageData } from '@/utils/helpers'

import AnalyseModal from '@/components/modals/analyse'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'
import Pagination from '@/components/ui/pagination'

import TableAnalyse from './TableAnalyse'
import TableOrdonnance from './TableOrdonnance'

const Patient = () => {
  const searchParams = useSearchParams()
  const idFiche = searchParams.get('id')
  const [activeTab, setActiveTab] = useState('informations-generales')
  const [patientListe, setPatientListe] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(idFiche ? patientListe.find(p => p.id === idFiche) : null)
  const userData = getStorageData('user')
  const [selected, setSelected] = useState<any>(null)
  const [update, setUpdate] = useState<string>(new Date().toDateString())
  const [isDeleteModalOpenAnalyse, setIsDeleteModalOpenAnalyse] = useState(false)
  const [isDeleteModalOpenOrd, setIsDeleteModalOpenOrd] = useState(false)
  const [isAnalyseModalOpen, setIsAnalyseModalOpen] = useState(false)

  const [paginatorInfoCons, setPaginatorInfoCons] = useState<any>({ total: 6 })

  const [data, setData] = useState<any>({
    patient: idFiche ?? '',
    id_med: userData.id
  })

  async function getConsultations(page = 1) {
    if (!selectedPatient) return
    const url = `${window.location.origin}/api/consultation/liste?id_patient=${selectedPatient.id}&consultation.id_el=${userData.id}&consultation.el=${userData.role}&page=${page}`

    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })

      if (!response.ok) throw new Error('Erreur lors de la requête')
      const responseData = await response.json()

      setConsultations(responseData.data || [])
      setPaginatorInfoCons(responseData?.paginatorInfo)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getConsultations()
  }, [selectedPatient, update])

  const onPaginationCons = (e: any) => {
    getConsultations(e)
  }

  const handleOpenModal = (analyse: any = null) => {
    setSelected(analyse)
    setIsAnalyseModalOpen(true)
  }

  async function getPatientListe() {
    const url = `${window.location.origin}/api/patient/liste?id_el=${userData?.id}&el=${userData?.role}`

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

  React.useEffect(() => {
    getPatientListe()
  }, [])

  const handleOpenDeleteModalAnalyse = (analyse: any = null) => {
    setSelected(analyse)
    setIsDeleteModalOpenAnalyse(true)
  }

  const handleDeleteAnalyse = async (analyse: any) => {
    const id = analyse?.id

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

  const handleConfirmDeleteAnalyse = async () => {
    await handleDeleteAnalyse(selected)
    setIsDeleteModalOpenAnalyse(false)
  }

  const handleOpenDeleteModalOrd = (analyse: any = null) => {
    setSelected(analyse)
    setIsDeleteModalOpenOrd(true)
  }

  const handleDeleteOrdonnance = async (ordonnance: any) => {
    const id = ordonnance?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/ordonnance/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success("L'ordonnance a été supprimé avec succès")
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleConfirmDeleteOrdonnance = async () => {
    await handleDeleteOrdonnance(selected)
    setIsDeleteModalOpenOrd(false)
  }

  return (
    <div>
      <Card className='min-h-screen'>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Fiche Patient ' />

          {idFiche === null && (
            <Grid item xs={12} md={12} className='mt-12'>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  label='Patient'
                  className='w-1/3'
                  value={data?.patient || null}
                  onChange={(e: any) => {
                    setData((prev: any) => ({
                      ...prev,
                      patient: e.target.value
                    }))
                    const patient = patientListe.find(p => p.id === e.target.value)

                    setSelectedPatient(patient || null)
                  }}
                >
                  {patientListe.map((item: any, i: number) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.nom + ' ' + item.prenom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <div className='w-full rounded-lg mt-12'>
            {/* Onglets */}
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List className='flex border-b-2 border-gray-200 mb-4'>
                <Tabs.Trigger
                  value='informations-generales'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'informations-generales'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Informations générales
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='consultation'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'consultation'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Consultation
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='analyse'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'analyse'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Liste des analyses
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='ordonnance'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'ordonnance'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Ordonnances
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value='informations-generales' className='mt-4'>
                {selectedPatient ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6'>
                    {[
                      { label: 'Nom', value: selectedPatient.nom, icon: 'user' },
                      { label: 'Prénom', value: selectedPatient.prenom, icon: 'user-circle' },
                      { label: 'Âge', value: selectedPatient.age, icon: 'calendar' },
                      { label: 'Ville', value: selectedPatient.ville, icon: 'map-pin' },
                      { label: 'Email', value: selectedPatient.email, icon: 'mail' },
                      { label: 'Téléphone', value: selectedPatient.tel, icon: 'phone' }
                    ].map((item, index) => (
                      <div key={index} className='flex items-center bg-white border rounded-xl p-6 shadow-sm space-x-4'>
                        <div className='text-blue-500'>
                          <i className={`ri-${item.icon}-line text-2xl`} />
                        </div>
                        <div>
                          <p className='text-sm text-gray-500'>{item.label}</p>
                          <p className='text-lg font-semibold text-gray-700'>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-center'>Sélectionnez un patient pour afficher les informations.</p>
                )}
              </Tabs.Content>

              <Tabs.Content value='consultation' className='mt-4'>
                {selectedPatient ? (
                  consultations.length > 0 ? (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                        <thead>
                          <tr>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Date</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Heure</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Durée</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consultations.map((consultation, index) => {
                            return (
                              <tr key={index} className='bg-gray-100'>
                                <td className='!plb-1'>{new Date(consultation.start).toLocaleDateString('fr-FR')}</td>
                                <td className='!plb-1'>
                                  {new Date(consultation.start).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{consultation.duree}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      <Grid item xs={12} className='mt-6 justify-items-end'>
                        <Pagination
                          total={paginatorInfoCons.total}
                          current={paginatorInfoCons.currentPage}
                          pageSize={paginatorInfoCons.perPage}
                          onChange={onPaginationCons}
                        />
                      </Grid>
                    </div>
                  ) : (
                    <p className='text-gray-500 text-center'>Aucune consultation trouvée.</p>
                  )
                ) : (
                  <p className='text-gray-500 text-center'>Sélectionnez un patient pour afficher les consultations.</p>
                )}
              </Tabs.Content>
              <Tabs.Content value='analyse' className='mt-4'>
                {selectedPatient ? (
                  <TableAnalyse
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModalAnalyse}
                    onAdd={handleOpenModal}
                    update={update}
                    selectedPatient={selectedPatient?.id}
                  />
                ) : (
                  <p className='text-gray-500'>Sélectionnez un patient pour afficher les analyses.</p>
                )}
              </Tabs.Content>
              <Tabs.Content value='ordonnance' className='mt-4'>
                {selectedPatient ? (
                  <TableOrdonnance selectedPatient={selectedPatient?.id} consultations={consultations} />
                ) : (
                  <p className='text-gray-500'>Sélectionnez un patient pour afficher les Ordonnances.</p>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </CardContent>
        <AnalyseModal
          isOpen={isAnalyseModalOpen}
          id_el={''}
          analyseData={selected}
          patient={selectedPatient?.id}
          onClose={() => setIsAnalyseModalOpen(false)}
          setUpdate={setUpdate}
        />
        <DeleteModal
          isOpen={isDeleteModalOpenAnalyse}
          onClose={() => setIsDeleteModalOpenAnalyse(false)}
          onConfirm={handleConfirmDeleteAnalyse}
          label={`cette analyse`}
        />
        <DeleteModal
          isOpen={isDeleteModalOpenOrd}
          onClose={() => setIsDeleteModalOpenOrd(false)}
          onConfirm={handleConfirmDeleteOrdonnance}
          label={`cette ordonnance`}
        />
      </Card>
    </div>
  )
}

export default Patient
