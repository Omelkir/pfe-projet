import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { Grid, IconButton, Collapse } from '@mui/material'
import { toast } from 'react-toastify'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'
import { getStorageData } from '@/utils/helpers'
import OrdonnancesModal from '@/components/modals/ordonnance'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'

const TableOrdonnance = ({ selectedPatient, consultations }: { selectedPatient: any; consultations: any }) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const userData = getStorageData('user')
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<any>(null)
  const [isOrdonnanceModalOpen, setIsOrdonnanceModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>(new Date().toDateString())
  const [isDeleteModalOpenOrd, setIsDeleteModalOpenOrd] = useState(false)

  const [selectedConst, setselectedConst] = useState<string>('')

  const handleOpenOrdModal = (ord: any = null) => {
    setSelected(ord)
    setIsOrdonnanceModalOpen(true)
  }

  const toggleRow = (date: string) => {
    setOpenRows(prev => ({ ...prev, [date]: !prev[date] }))
  }

  const onPagination = (e: any) => {
    getOrdonnance(e)
  }

  async function getOrdonnance(page = 1) {
    try {
      if (!selectedPatient) return
      const url = `${window.location.origin}/api/ordonnance/liste?id_patient=${selectedPatient}&id_el=${userData?.id}&el=${userData?.role}&page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        toast.error(responseData.message)
      } else {
        setRowsData(responseData.data || [])
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getOrdonnance()
  }, [selectedPatient, update])

  const ordonnancesByDate: Record<string, any[]> = {}

  consultations.forEach((cons: any) => {
    const date = new Date(cons.start).toISOString().split('T')[0]

    if (!ordonnancesByDate[date]) {
      ordonnancesByDate[date] = []
    }

    rowsData.forEach(ord => {
      const ordDate = new Date(ord.consultation_date).toISOString().split('T')[0]

      if (ordDate === date) {
        ordonnancesByDate[date].push(ord)
      }
    })
  })

  console.log('ordonnancesByDate', ordonnancesByDate)

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
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Date de consultation</th>
                <th colSpan={3}></th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ordonnancesByDate).length > 0 ? (
                Object.entries(ordonnancesByDate).map(([date, ords]) => (
                  <>
                    <tr key={date} className='bg-gray-100 hover:bg-gray-200'>
                      <td colSpan={4}>
                        <div className='flex items-center justify-between px-4 py-2'>
                          <div className='flex items-center gap-2'>
                            <IconButton onClick={() => toggleRow(date)}>
                              {openRows[date] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </IconButton>
                            <Typography variant='subtitle1'>{date}</Typography>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className='p-0'>
                        <Collapse in={openRows[date]}>
                          <table className={tableStyles.table}>
                            <thead>
                              <tr>
                                <th>Médicament</th>
                                <th>Dosage</th>
                                <th>Durée (jours)</th>
                                <th className='text-center'>
                                  Action
                                  <Plus
                                    className='text-blue-500 float-right cursor-pointer'
                                    onClick={() => {
                                      const consultationId = ords[0]?.consultation_id

                                      setselectedConst(consultationId)
                                      handleOpenOrdModal()
                                    }}
                                  />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {ords.map((ord, index) => (
                                <tr key={index}>
                                  <td>{ord.medi}</td>
                                  <td>{ord.dosage}</td>
                                  <td>{ord.duree}</td>
                                  <td className='flex justify-center gap-2'>
                                    <button
                                      className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl'
                                      onClick={() => {
                                        handleOpenOrdModal(ord)
                                      }}
                                    />
                                    <button
                                      className='ri-delete-bin-line text-red-500 text-xl hover:text-2xl'
                                      onClick={() => handleOpenDeleteModalOrd(ord)}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Collapse>
                      </td>
                    </tr>
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='text-center py-4 text-gray-500'>
                    Aucune ordonnance trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Grid item xs={12} className='mt-6 justify-items-end'>
        <Pagination
          total={paginatorInfo.total}
          current={paginatorInfo.currentPage}
          pageSize={paginatorInfo.perPage}
          onChange={onPagination}
        />
      </Grid>
      <OrdonnancesModal
        isOpen={isOrdonnanceModalOpen}
        ordananceData={selected}
        id_cons={selectedConst}
        patient={selectedPatient}
        onClose={() => setIsOrdonnanceModalOpen(false)}
        setUpdate={setUpdate}
      />
      <DeleteModal
        isOpen={isDeleteModalOpenOrd}
        onClose={() => setIsDeleteModalOpenOrd(false)}
        onConfirm={handleConfirmDeleteOrdonnance}
        label={`cette ordonnance`}
      />
    </>
  )
}

export default TableOrdonnance
