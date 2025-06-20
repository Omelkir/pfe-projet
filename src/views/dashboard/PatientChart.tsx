'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import type { ApexOptions } from 'apexcharts'

import { getStorageData } from '@/utils/helpers'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const PatientChart = () => {
  const [series, setSeries] = useState([{ name: 'Total Patients', data: Array(12).fill(0) }])
  const userData = getStorageData('user')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let url = ''

        if (userData?.role === 1) {
          url = `${window.location.origin}/api/statistique-admin/statistique`
        } else if (userData?.role === 2 || userData?.role === 3) {
          url = `${window.location.origin}/api/statistique-medecin/statistique?id_el=${userData?.id}&el=${userData?.role}`
        } else {
          return
        }

        const response = await fetch(url)
        const res = await response.json()

        if (!res.erreur && res.statistiquesPatient?.patientsParMois) {
          setSeries([{ name: 'Total Patients', data: res.statistiquesPatient.patientsParMois }])
        }
      } catch (error) {
        console.error('Erreur chargement patients:', error)
      }
    }

    fetchPatients()
  }, [userData?.role])

  const options: ApexOptions = {
    chart: { type: 'line', height: 350, toolbar: { show: false } },
    colors: ['#ff5a39'],
    stroke: { width: 3, curve: 'smooth' },
    markers: { size: 5 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: 'var(--mui-palette-text-secondary)' } }
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--mui-palette-text-secondary)' },
        formatter: value => Math.round(value).toString()
      }
    },
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
        <Typography variant='h6' gutterBottom sx={{ fontSize: 20, fontWeight: 'bold', color: '#ff5a39' }}>
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
