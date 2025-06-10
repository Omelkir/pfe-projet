// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Vars
const series = [
  {
    name: 'New Patients',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 110, 120]
  },
  {
    name: 'Return Patients',
    data: [20, 30, 25, 40, 39, 50, 60, 81, 105, 90, 100, 110]
  }
]

const PatientChart = () => {
  const primaryColor = '#16b1ff'
  const secondaryColor = 'var(--mui-palette-secondary-main)'

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    colors: [primaryColor, secondaryColor],
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    markers: {
      size: 5
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: 'var(--mui-palette-text-secondary)'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--mui-palette-text-secondary)'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: 'var(--mui-palette-text-primary)'
      }
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)'
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom style={{ fontSize: 20, fontWeight: 'bold', color: '#16b1ff' }}>
          Patients
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          20% higher than last year.
        </Typography>
        <AppReactApexCharts type='line' height={350} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default PatientChart
