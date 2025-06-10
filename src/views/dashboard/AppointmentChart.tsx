'use client'

// Next Imports
import dynamic from 'next/dynamic'

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

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const AppointmentChart = () => {
  // Hooks
  const theme = useTheme()

  // Vars
  const divider = 'var(--mui-palette-divider)'
  const disabled = 'var(--mui-palette-text-disabled)'

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
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title={<span style={{ fontSize: 20, fontWeight: 'bold', color: '#ffb400' }}>Appointments</span>}
        action={<OptionsMenu iconClassName='text-textPrimary' options={['Refresh', 'Update', 'Delete']} />}
      />

      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }} style={{ paddingTop: 20 }}>
        <AppReactApexCharts
          type='bar'
          height={300}
          width='100%'
          series={[{ name: 'Appointments', data: [30, 40, 35, 50, 49, 60, 70, 80, 75, 90, 85, 95] }]}
          options={options}
        />
        <div className='flex items-center mbe-4 gap-4'>
          <Typography variant='h4'>33%</Typography>
          <Typography>Your appointments are 33% higher than last year</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppointmentChart
