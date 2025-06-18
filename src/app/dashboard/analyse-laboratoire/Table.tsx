// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

// Components Imports
import { Grid } from '@mui/material'

import { toast } from 'react-toastify'

import { FileText } from 'lucide-react'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'
import { getStorageData } from '@/utils/helpers'

const Table = ({
  onEdit,
  onDelete,
  update,
  patient
}: {
  onEdit: (analyse: any) => void
  onDelete: (analyse: any) => void
  update: string
  patient: any
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [isLoading, setIsLoading] = useState(false)

  const userData = getStorageData('user')

  const onPagination = (e: any) => {
    getAnalysesList(e)
  }

  async function getAnalysesList(page = 1) {
    if (!patient) return

    try {
      setIsLoading(true)

      const url = `${window.location.origin}/api/analyse/liste?id_patient=${patient.id}&id_el=${userData.id}&el=${userData.role}&page=${page}`

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
        setRowsData(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la récupération des données.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAnalysesList()
  }, [update, patient])

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Détail</th>
                <th>Analyse</th>

                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4}>
                    <div className='text-center p-4'>Chargement...</div>
                  </td>
                </tr>
              ) : (
                rowsData.map((row, index) => (
                  <tr key={index}>
                    <td className='!plb-1'>
                      <Typography>{row.titre}</Typography>
                    </td>
                    <td className='!plb-1'>
                      <Typography>{row.detail}</Typography>
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-700'>
                      <a href={row.analyse} target='_blank' rel='noopener noreferrer'>
                        <FileText size={14} /> Voir le PDF
                      </a>
                    </td>
                    <td className='flex justify-center gap-2'>
                      <button
                        className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl'
                        onClick={() => onEdit(row)}
                      ></button>
                      <button
                        onClick={() => onDelete(row)}
                        className='ri-delete-bin-line text-red-500 text-xl hover:text-2xl'
                      ></button>
                    </td>
                  </tr>
                ))
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

export default Table
