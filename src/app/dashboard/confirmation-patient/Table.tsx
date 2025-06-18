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

const Table = ({
  update,
  onDelete,
  setUpdate
}: {
  update: string
  onDelete: (patient: any) => void
  setUpdate: any
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })

  const onPagination = (e: any) => {
    getPatientsList(e)
  }

  async function getPatientsList(page = 1) {
    try {
      const url = `${window.location.origin}/api/patient/compte-patient?approuve=0&archive=0&page=${page}`

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

  const handleChange = async (row: any) => {
    try {
      const response = await fetch(`${window.location.origin}/api/approve-patient/modifier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: row.id,
          email: row.email,
          nom: row.nom,
          prenom: row.prenom
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
    getPatientsList()
  }, [update])

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Ville</th>
                <th>Téléphone</th>
                <th className='text-center'>Action</th>
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
                    <Typography>{row.ville}</Typography>
                  </td>
                  <td className='!plb-1'>
                    <Typography>{row.tel}</Typography>
                  </td>
                  <td className='flex justify-center gap-2'>
                    <Check
                      className='text-green-600 text-xl font-bold cursor-pointer hover:text-2xl'
                      strokeWidth={3}
                      onClick={async () => {
                        await handleChange(row)
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
