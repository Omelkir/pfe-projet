'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import type { ApexOptions } from 'apexcharts'

import { getStorageData } from '@/utils/helpers'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const MedecinChart = () => {
  const [series, setSeries] = useState([{ name: 'Total Médecins', data: Array(12).fill(0) }])
  const userData = getStorageData('user')

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const url = `${window.location.origin}/api/statistique-admin/statistique`
        const response = await fetch(url)
        const res = await response.json()

        if (!res.erreur && res.statistiquesMedecin?.medecinsParMois) {
          setSeries([{ name: 'Total Médecins', data: res.statistiquesMedecin.medecinsParMois }])
        }
      } catch (error) {
        console.error('Erreur chargement Médecins:', error)
      }
    }

    fetchMedecins()
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
          Évolution des médecins
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Nombre total de médecins par mois
        </Typography>
        <AppReactApexCharts type='line' height={350} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default MedecinChart
