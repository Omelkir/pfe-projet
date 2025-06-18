'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Card, CardContent, Grid, Link } from '@mui/material'
import { IconUserPlus } from '@tabler/icons-react'

import Arrow from '@/views/dashboard/Arrow'
import PatientModal from '@/components/modals/patient'
import Table from './Table'

const Patient = ({}: any) => {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [update, setUpdate] = useState<string>('')
  const router = useRouter()

  const handleOpenPatientModal = (patient: any = null) => {
    setSelected(patient)
    setIsPatientModalOpen(true)
  }

  return (
    <div>
      <Card className='min-h-screen'>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Patient' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenPatientModal()}
          >
            <IconUserPlus className='mr-2' /> Ajouter
          </Button>
          <div className='flex justify-end mb-3'>
            <Link
              className='underline cursor-pointer'
              onClick={() => {
                router.push('/dashboard/archive-patient')
              }}
            >
              Liste des patients archivés
            </Link>
          </div>

          <PatientModal
            isOpen={isPatientModalOpen}
            onClose={() => setIsPatientModalOpen(false)}
            patientData={selected}
            setUpdate={setUpdate}
          />

          <Grid item xs={12}>
            <Table onEditPatient={handleOpenPatientModal} update={update} setUpdate={setUpdate} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Patient
