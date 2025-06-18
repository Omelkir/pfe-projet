'use client'

// Next Imports
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// React & Hooks

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionsMenu from '@core/components/option-menu'
import { getStorageData } from '@/utils/helpers'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const AppointmentChart = () => {
  const theme = useTheme()
  const userData = getStorageData('user')
  const [series, setSeries] = useState([{ name: 'Appointments', data: Array(12).fill(0) }])

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const url = `${window.location.origin}/api/statistique-medecin/statistique?id_el=${userData?.id}&el=${userData?.role}`

        const response = await fetch(url)
        const res = await response.json()

        if (!res.erreur && res.statistiquesRendezvous?.rendezvousParMois) {
          setSeries([{ name: 'Appointments', data: res.statistiquesRendezvous.rendezvousParMois }])
        }
      } catch (error) {
        console.error('Erreur chargement rendez-vous:', error)
      }
    }

    fetchRendezVous()
  }, [userData?.role])

  const disabled = 'var(--mui-palette-text-disabled)'
  const divider = 'var(--mui-palette-divider)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        columnWidth: '40%'
      }
    },
    stroke: {
      width: 2,
      colors: ['var(--mui-palette-background-paper)']
    },
    legend: { show: false },
    grid: {
      xaxis: { lines: { show: false } },
      strokeDashArray: 7,
      padding: { left: -9, top: -20, bottom: 13 },
      borderColor: divider
    },
    dataLabels: { enabled: false },
    colors: ['#f9e79f', '#f9e79f', '#f9e79f', 'var(--mui-palette-warning-main)', '#f9e79f', '#f9e79f'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetY: 2,
        offsetX: -17,
        style: { colors: disabled, fontSize: theme.typography.body2.fontSize as string },
        formatter: value => Math.round(value).toString()
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title={<span style={{ fontSize: 20, fontWeight: 'bold', color: '#ffb400' }}>Rendez-vous</span>}
        action={<OptionsMenu iconClassName='text-textPrimary' options={['Refresh', 'Update', 'Delete']} />}
      />

      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }} style={{ paddingTop: 20 }}>
        <AppReactApexCharts type='bar' height={357} width='100%' series={series} options={options} />
        {/* <div className='flex items-center mbe-4 gap-4 mt-4'>
          <Typography variant='h4'>+33%</Typography>
          <Typography>Vos rendez-vous sont 33% plus élevés que l’année dernière</Typography>
        </div> */}
      </CardContent>
    </Card>
  )
}

export default AppointmentChart
