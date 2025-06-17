'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Card, CardContent, Grid, Link } from '@mui/material'

import Arrow from '@/views/dashboard/Arrow'

import TableArchive from './TableArchive'

const ArchivePatient = ({}: any) => {
  const [update, setUpdate] = useState<string>('')
  const router = useRouter()

  return (
    <div>
      <Card className='min-h-screen'>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Liste des patients archivés' />
          <div className='flex justify-end mb-3'>
            <Link
              className='underline cursor-pointer'
              onClick={() => {
                router.push('/patient')
              }}
            >
              Liste des patients
            </Link>
          </div>
          <Grid item xs={12}>
            <TableArchive update={update} setUpdate={setUpdate} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default ArchivePatient
