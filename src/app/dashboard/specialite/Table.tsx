// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import { Grid } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'

const Table = ({
  onEdit,
  onDelete,
  update
}: {
  onEdit: (spe: any) => void
  onDelete: (spe: any) => void
  update: string
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })

  const onPagination = (e: any) => {
    getSpecialiteList(e)
  }

  async function getSpecialiteList(page = 1) {
    try {
      const url = `${window.location.origin}/api/specialite/liste?page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setRowsData(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  useEffect(() => {
    getSpecialiteList()
  }, [update])

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Spécialité</th>

                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowsData.map((row, index) => (
                <tr key={index}>
                  <td className='!plb-1'>
                    <Typography>{row.spe}</Typography>
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
              ))}
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
