'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Card, CardContent, Grid, Link } from '@mui/material'

import { Stethoscope } from 'lucide-react'

import Table from '@/app/dashboard/medecin/Table'

import Arrow from '@/views/dashboard/Arrow'
import MedecinModal from '@/components/modals/medecin'

const Medecin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [update, setUpdate] = useState<string>('')
  const router = useRouter()

  const handleOpenModal = (med: any = null) => {
    setSelected(med)
    setIsModalOpen(true)
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Médecin' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenModal()}
          >
            <Stethoscope className='mr-2' /> Ajouter
          </Button>
          <div className='flex justify-end mb-3'>
            <Link
              className='underline cursor-pointer'
              onClick={() => {
                router.push('/dashboard/archive-medecin')
              }}
            >
              Liste des médecins archivés
            </Link>
          </div>
          <Grid item xs={12}>
            <Table onEdit={handleOpenModal} update={update} setUpdate={setUpdate} />
          </Grid>

          <MedecinModal
            isOpen={isModalOpen}
            medecinData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Medecin
