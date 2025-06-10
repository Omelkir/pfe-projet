// MUI Imports
import React, { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { Grid } from '@mui/material'
import { Check } from 'lucide-react'
import { toast } from 'react-toastify'

import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'

const Table = ({ update, onDelete, setUpdate }: { update: string; onDelete: (admin: any) => void; setUpdate: any }) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })

  const onPagination = (e: any) => {
    getMedecinsList(e)
  }

  async function getMedecinsList(page = 1) {
    try {
      const url = `${window.location.origin}/api/medecin/liste?isApproved=0&page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        toast.error('Erreur !')
      } else {
        setRowsData(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  const handleChange = async (id: number) => {
    try {
      const response = await fetch(`${window.location.origin}/api/approve-medecin/modifier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id
        })
      })

      const result = await response.json()

      if (!response.ok || result.erreur) {
        toast.error('Erreur !')
      } else {
        toast.success('Le compte a été approuvé avec succès')
        setUpdate(Date.now().toString())
      }
    } catch (err) {
      toast.error('Erreur !')
    }
  }

  useEffect(() => {
    getMedecinsList()
  }, [update])

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Nom Utilisateur</th>
                <th>Email</th>
                <th>Ville</th>
                <th>Spéciallité</th>
                <th className='text-center'>Approuvé</th>
              </tr>
            </thead>
            <tbody>
              {rowsData.map((row, index) => (
                <tr key={index}>
                  <td className='!plb-1'>
                    <div className='flex items-center gap-3'>
                      <CustomAvatar src={row.image} size={34} />
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='font-medium'>
                          {row.nom_ut}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className='!plb-1'>
                    <Typography>{row.email}</Typography>
                  </td>
                  <td className='!plb-1'>
                    <Typography>{row.ville}</Typography>
                  </td>
                  <td className='!plb-1'>
                    <Typography>{row.spe}</Typography>
                  </td>
                  <td className='flex justify-center gap-2'>
                    <Check
                      className='text-green-600 text-xl font-bold cursor-pointer hover:text-2xl'
                      strokeWidth={3}
                      onClick={async () => {
                        await handleChange(row.id)
                      }}
                    />

                    <i
                      className='ri-delete-bin-line text-red-500 text-xl hover:text-2xl cursor-pointer'
                      onClick={() => onDelete(row)}
                    ></i>
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
