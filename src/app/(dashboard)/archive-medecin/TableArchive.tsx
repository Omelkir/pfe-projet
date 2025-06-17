import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import { toast } from 'react-toastify'

import { IconAlertTriangle } from '@tabler/icons-react'

import { Box } from '@mui/material'

import { FaExclamationTriangle } from 'react-icons/fa'

import tableStyles from '@core/styles/table.module.css'
import { getStorageData } from '@/utils/helpers'
import Pagination from '@/components/ui/pagination'
import CustomAvatar from '@/@core/components/mui/Avatar'

const TableArchive = ({
  update,
  setUpdate
}: {
  update: string
  setUpdate: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const userData = getStorageData('user')
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [isLoading, setIsLoading] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedMedecinId, setSelectedMedecinId] = useState<number | null>(null)

  const onPagination = (e: any) => {
    getMedecinArchiveList(e)
  }

  async function getMedecinArchiveList(page = 1) {
    try {
      setIsLoading(true)
      const url = `${window.location.origin}/api/medecin/liste?approuve=0&archive=1&page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

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
    getMedecinArchiveList()
  }, [update])

  const handleChange = async (id: number) => {
    try {
      const response = await fetch(`${window.location.origin}/api/archive/active-medecin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const result = await response.json()

      if (!response.ok || result.erreur) {
        toast.error('Erreur !')
      } else {
        toast.success('Le médecin a été désarchivé avec succès')
        setUpdate(Date.now().toString())
      }
    } catch (err) {
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
                <th>Spéciallité</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
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
                      <Typography>{row.spe}</Typography>
                    </td>
                    <td className='flex justify-center gap-2'>
                      <button
                        onClick={() => {
                          setSelectedMedecinId(row.id)
                          setConfirmOpen(true)
                        }}
                        className='ri-inbox-unarchive-fill text-yellow-500 text-xl hover:text-2xl'
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

      {/* Modal de confirmation */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={1}>
            <IconAlertTriangle color='warning' />
            <h1 className='block w-full text-center'>
              <FaExclamationTriangle className='text-5xl text-yellow-500 mr-2' />
            </h1>
          </Box>
        </DialogTitle>

        <DialogContent dividers className='mb-3 text-center'>
          <Typography color='text.secondary'>
            Êtes-vous sûr de vouloir <strong>désarchiver ce médecin</strong> ?
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
            color='warning'
            onClick={async () => {
              if (selectedMedecinId !== null) {
                await handleChange(selectedMedecinId)
              }

              setConfirmOpen(false)
              setSelectedMedecinId(null)
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TableArchive
