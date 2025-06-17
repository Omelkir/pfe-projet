// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import { Box, Grid } from '@mui/material'

import { toast } from 'react-toastify'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import { FaExclamationTriangle } from 'react-icons/fa'

import { IconAlertTriangle } from '@tabler/icons-react'

import CustomAvatar from '@/@core/components/mui/Avatar'
import Pagination from '@/components/ui/pagination'
import { getStorageData } from '@/utils/helpers'
import tableStyles from '@core/styles/table.module.css'

const Table = ({
  onEditPatient,
  update,
  setUpdate
}: {
  onEditPatient: (patient: any) => void
  update: string
  setUpdate: any
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const userData = getStorageData('user')
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [isLoading, setIsLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)

  const onPagination = (e: any) => {
    getPatientList(e)
  }

  async function getPatientList(page = 1) {
    try {
      setIsLoading(true)
      let url = ''

      if (userData?.role === 1) {
        url = `${window.location.origin}/api/patient/compte-patient?approuve=1&archive=0&page=${page}`
      } else {
        url = `${window.location.origin}/api/patient/liste?id_el=${userData.id}&el=${userData.role}&page=${page}`
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

  const handleChange = async (id: number) => {
    try {
      const endpoint = userData?.role === 1 ? '/api/archive/desactive-patient' : '/api/archive/archived'

      const response = await fetch(`${window.location.origin}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const result = await response.json()

      if (!response.ok || result.erreur) {
        toast.error('Erreur !')
        console.error('Erreur API:', result)
      } else {
        toast.success('Le patient a été archivé avec succès')
        setUpdate(Date.now().toString())
      }
    } catch (err) {
      console.error('Erreur fetch:', err)
      toast.error('Erreur !')
    }
  }

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
                        onClick={() => {
                          setSelectedPatientId(row.id)
                          setConfirmOpen(true)
                        }}
                        className='ri-inbox-archive-fill text-red-500 text-xl hover:text-2xl'
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
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={1}>
            <IconAlertTriangle color='error' />
            <h1 className='block w-full text-center'>
              <FaExclamationTriangle className='text-5xl text-red-500 mr-2' />
            </h1>
          </Box>
        </DialogTitle>

        <DialogContent dividers className='mb-3 text-center'>
          <Typography color='text.secondary'>
            Êtes-vous sûr de vouloir <strong>archiver ce patient</strong> ?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button
            style={{ backgroundColor: 'white', color: 'black' }}
            size='small'
            onClick={() => setConfirmOpen(false)}
          >
            Annuler
          </Button>
          <Button
            variant='contained'
            size='small'
            color='error'
            onClick={async () => {
              if (selectedPatientId !== null) {
                await handleChange(selectedPatientId)
              }

              setConfirmOpen(false)
              setSelectedPatientId(null)
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Table
