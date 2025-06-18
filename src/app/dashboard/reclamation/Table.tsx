// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import Chip from '@mui/material/Chip'

import { Grid } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'

const Table = ({
  onRead,
  onDelete,
  update
}: {
  onDelete: (rec: any) => void
  onRead: (rec: any) => void
  update: string
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })

  const onPagination = (e: any) => {
    getRéclamationList(e)
  }

  async function getRéclamationList(page = 1) {
    try {
      const url = `${window.location.origin}/api/reclamation/liste?page=${page}`

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
    getRéclamationList()
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
                <th>Numéro téléphone</th>
                <th>Message</th>
                <th>Type de message</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowsData.map((row, index) => (
                <tr key={index}>
                  <td className='!plb-1'>
                    <Typography>{row.nom}</Typography>
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
                    <Typography>
                      <button
                        className='ri-message-2-fill text-yellow-500 text-xl hover:text-2xl'
                        onClick={() => onRead(row)}
                      ></button>
                    </Typography>
                  </td>
                  <td className='!pb-1'>
                    {(() => {
                      let label = ''
                      let color: 'primary' | 'warning' | 'info' | 'error' | 'secondary' = 'secondary'

                      switch (row.type) {
                        case 1:
                          label = 'Message concernant un rendez-vous'
                          color = 'primary'
                          break
                        case 2:
                          label = 'Message concernant un médecin'
                          color = 'warning'
                          break
                        case 3:
                          label = 'Message concernant un laboratoire'
                          color = 'info'
                          break
                        case 4:
                          label = 'Message concernant un problème technique'
                          color = 'error'
                          break
                        case 5:
                          label = 'Autres'
                          color = 'secondary'
                          break
                        default:
                          label = 'Inconnu'
                          color = 'secondary'
                      }

                      return <Chip className='capitalize' variant='tonal' color={color} label={label} size='small' />
                    })()}
                  </td>

                  <td className='flex justify-center gap-2'>
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
