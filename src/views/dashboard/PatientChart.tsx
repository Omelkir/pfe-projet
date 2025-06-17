'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import type { ApexOptions } from 'apexcharts'

import { getStorageData } from '@/utils/helpers'

// Chart Component
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const PatientChart = () => {
  const [series, setSeries] = useState([{ name: 'Total Patients', data: Array(12).fill(0) }])
  const userData = getStorageData('user')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const url = `${window.location.origin}/api/patient/liste?id_el=${userData.id}&el=${userData.role}`
        const response = await fetch(url)
        const res = await response.json()

        console.log('res', res)

        if (!res.erreur && Array.isArray(res.data)) {
          const monthlyCount = Array(12).fill(0)

          res.data.forEach((patient: any) => {
            const month = new Date(patient.date).getMonth()

            monthlyCount[month] += 1
          })

          setSeries([{ name: 'Total Patients', data: monthlyCount }])
        }
      } catch (error) {
        console.error('Erreur chargement patients:', error)
      }
    }

    fetchPatients()
  }, [])

  const options: ApexOptions = {
    chart: { type: 'line', height: 350, toolbar: { show: false } },
    colors: ['#16b1ff'],
    stroke: { width: 3, curve: 'smooth' },
    markers: { size: 5 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: 'var(--mui-palette-text-secondary)' } }
    },
    yaxis: { labels: { style: { colors: 'var(--mui-palette-text-secondary)' } } },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: 'var(--mui-palette-text-primary)' }
    },
    grid: { borderColor: 'var(--mui-palette-divider)' }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom sx={{ fontSize: 20, fontWeight: 'bold', color: '#16b1ff' }}>
          Évolution des Patients
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Nombre total de patients par mois
        </Typography>
        <AppReactApexCharts type='line' height={350} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default PatientChart
