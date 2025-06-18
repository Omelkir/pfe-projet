// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import { Grid } from '@mui/material'

import { toast } from 'react-toastify'

import { FileText, Plus } from 'lucide-react'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'
import { getStorageData } from '@/utils/helpers'

const TableAnalyse = ({
  onEdit,
  onDelete,
  onAdd,
  update,
  selectedPatient
}: {
  onEdit: (analyse: any) => void
  onDelete: (analyse: any) => void
  onAdd: () => void
  update: string
  selectedPatient: any
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const userData = getStorageData('user')

  const onPagination = (e: any) => {
    getAnalyse(e)
  }

  async function getAnalyse(page = 1) {
    try {
      if (!selectedPatient) return
      const url = `${window.location.origin}/api/analyse/liste?id_patient=${selectedPatient}&id_el=${userData.id}&el=${userData.role}&page=${page}`

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
    getAnalyse()
  }, [selectedPatient, update])

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
                <th className='text-center'>
                  Action
                  <Plus className='text-blue-500 float-right' onClick={() => onAdd()} />
                </th>
              </tr>
            </thead>
            <tbody>
              {rowsData.length > 0 ? (
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
              ) : (
                <tr>
                  <td colSpan={4} className='px-4 py-4 text-center text-gray-500'>
                    Aucune analyse trouvée.
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

export default TableAnalyse
