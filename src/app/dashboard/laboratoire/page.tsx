'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Card, CardContent, Grid, Link } from '@mui/material'

import { FlaskConical } from 'lucide-react'

import Table from '@/app/dashboard/laboratoire/Table'
import Arrow from '@/views/dashboard/Arrow'
import LaboratoireModal from '@/components/modals/laboratoire'

const Laboratoire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [update, setUpdate] = useState<string>('')
  const router = useRouter()

  const handleOpenModal = (labo: any = null) => {
    setSelected(labo)
    setIsModalOpen(true)
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Laboratire' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenModal()}
          >
            <FlaskConical className='mr-2' /> Ajouter
          </Button>
          <div className='flex justify-end mb-3'>
            <Link
              className='underline cursor-pointer'
              onClick={() => {
                router.push('/dashboard/archive-laboratoire')
              }}
            >
              Liste des laboratoires archivés
            </Link>
          </div>
          <Grid item xs={12}>
            <Table onEdit={handleOpenModal} update={update} setUpdate={setUpdate} />
          </Grid>

          <LaboratoireModal
            isOpen={isModalOpen}
            laboratoireData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Laboratoire
