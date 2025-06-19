'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Card, CardContent, Grid, Link } from '@mui/material'

import Arrow from '@/views/dashboard/Arrow'

import TableArchive from './TableArchive'

const ArchiveLaboratoire = ({}: any) => {
  const [update, setUpdate] = useState<string>('')
  const router = useRouter()

  return (
    <div>
      <Card className='min-h-screen'>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Liste des laboratoires archivés' />
          <div className='flex justify-end mb-3'>
            <Link
              className='underline cursor-pointer'
              onClick={() => {
                router.push('/dashboard/laboratoire')
              }}
            >
              Liste des laboratoires
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

export default ArchiveLaboratoire
