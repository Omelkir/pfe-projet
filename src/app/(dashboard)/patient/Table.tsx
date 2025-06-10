// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import { Grid } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'
import { getStorageData } from '@/utils/helpers'
import Pagination from '@/components/ui/pagination'
import CustomAvatar from '@/@core/components/mui/Avatar'

const Table = ({
  onEditPatient,
  onDeletePatient,
  update
}: {
  onEditPatient: (patient: any) => void
  onDeletePatient: (patient: any) => void
  update: string
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const userData = getStorageData('user')
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [isLoading, setIsLoading] = useState(false)

  const onPagination = (e: any) => {
    getPatientList(e)
  }

  async function getPatientList(page = 1) {
    try {
      setIsLoading(true)
      let url = `${window.location.origin}/api/patient/liste`

      if (userData.role === 2 || userData.role === 3) {
        url += `?id_el=${userData.id}&el=${userData.role}&page=${page}`
      } else {
        url += `?page=${page}&el=${userData.role}`
      }

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        console.error('Erreur')
      } else {
        setRowsData(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPatientList()
  }, [update])

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Fiche</th>
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
                      <div className='flex items-center gap-3'>
                        <CustomAvatar src={row.image} size={34} />
                        <div className='flex flex-col'>
                          <Typography color='text.primary' className='font-medium'>
                            {row.nom}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className='!plb-1'>
                      <Typography>{row.prenom}</Typography>
                    </td>
                    <td className='!plb-1'>
                      <Typography>{row.email}</Typography>
                    </td>
                    <td className='!plb-1'>
                      <Typography>{row.tel}</Typography>
                    </td>
                    <td className='!plb-1'>
                      {userData.role === 2 ? (
                        <button
                          className='ri-folder-line text-blue-500 text-xl hover:text-2xl'
                          onClick={() => window.open('/fiche-patient?id=' + row.id, '_blank', 'noopener,noreferrer')}
                        ></button>
                      ) : null}
                    </td>
                    <td className='flex justify-center gap-2'>
                      <button
                        className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl'
                        onClick={() => onEditPatient(row)}
                      ></button>
                      <button
                        onClick={() => onDeletePatient(row)}
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
