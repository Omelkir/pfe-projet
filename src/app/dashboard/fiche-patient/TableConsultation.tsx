// MUI Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'

import { Grid } from '@mui/material'

import { toast } from 'react-toastify'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'
import { getStorageData } from '@/utils/helpers'

const TableConsultation = ({ update, selectedPatient }: { update: string; selectedPatient: any }) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const userData = getStorageData('user')

  const onPagination = (e: any) => {
    consultation(e)
  }

  async function consultation(page = 1) {
    try {
      if (!selectedPatient) return
      const url = `${window.location.origin}/api/consultation/liste?id_patient=${selectedPatient}&consultation.id_el=${userData.id}&consultation.el=${userData.role}&page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

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
    consultation()
  }, [selectedPatient, update])

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              {rowsData.length > 0 ? (
                rowsData.map((row, index) => (
                  <tr key={index}>
                    <td className='!plb-1'>{new Date(row.start).toLocaleDateString('fr-FR')}</td>
                    <td className='!plb-1'>
                      {new Date(row.start).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-700'>{row.duree}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='px-4 py-4 text-center text-gray-500'>
                    Aucune consultation trouvée.
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
    </>
  )
}

export default TableConsultation
