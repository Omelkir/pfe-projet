// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

// Components Imports
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'

import { toast } from 'react-toastify'

import { IconAlertTriangle } from '@tabler/icons-react'

import { FaExclamationTriangle } from 'react-icons/fa'

import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'

const Table = ({ onEdit, setUpdate, update }: { onEdit: (labo: any) => void; setUpdate: any; update: string }) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLaboId, setSelectedLaboId] = useState<number | null>(null)

  const onPagination = (e: any) => {
    getLaboratoireList(e)
  }

  async function getLaboratoireList(page = 1) {
    setIsLoading(true)

    try {
      const url = `${window.location.origin}/api/laboratoire/liste?approuve=1&archive=0&page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        console.log(responseData.message)
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
    getLaboratoireList()
  }, [update])

  const handleChange = async (id: number) => {
    try {
      const response = await fetch(`${window.location.origin}/api/archive/desactive-labo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const result = await response.json()

      if (!response.ok || result.erreur) {
        toast.error('Erreur !')
        console.error('Erreur API:', result)
      } else {
        toast.success('Le laboratoire a été archivé avec succès')
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
                <th>Nom Utilisateur</th>
                <th>Email</th>
                <th>Ville</th>
                <th>Mode de prélèvement</th>
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
                      <Typography>
                        {row.mode_pre === 1
                          ? 'Prélèvement sur place au laboratoire'
                          : row.mode_pre === 0
                            ? 'Prélèvement à domicile'
                            : row.mode_pre === 2
                              ? 'Prélèvement sur place au laboratoire et à domicile'
                              : 'Prélèvement non défini'}
                      </Typography>
                    </td>
                    <td className='flex justify-center gap-2'>
                      <button
                        className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl'
                        onClick={() => onEdit(row)}
                      ></button>
                      <button
                        onClick={() => {
                          setSelectedLaboId(row.id)
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
            Êtes-vous sûr de vouloir <strong>archiver ce laboratoire</strong> ?
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
              if (selectedLaboId !== null) {
                await handleChange(selectedLaboId)
              }

              setConfirmOpen(false)
              setSelectedLaboId(null)
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
