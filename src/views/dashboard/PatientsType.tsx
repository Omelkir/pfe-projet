'use client'

// React Imports
import React from 'react'

import dynamic from 'next/dynamic'

// Import dynamique pour éviter les erreurs SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// Labels pour le graphique
const labels = ['Male', 'Female', 'Kids']

const PatientsTypeChart = () => {
  // Options du graphique
  const chartOptions = {
    chart: {
      type: 'pie',
      toolbar: { show: false }
    },
    labels, // Utilisation de la constante labels
    colors: ['#3f51b5', '#e91e63', '#4caf50'], // Couleurs personnalisées
    legend: {
      position: 'bottom',
      labels: { colors: '#000' }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '14px', colors: ['#fff'] },
      dropShadow: { enabled: false },
      offsetY: 0,
      formatter: function (val: number, { seriesIndex }: { seriesIndex: number }) {
        return [`${val}%`, labels[seriesIndex]].join('\n')
      }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -30,
          minAngleToShowLabel: 10
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        option: {
          chart: { width: '100%' },
          legend: { position: 'bottom' }
        }
      }
    ]
  }

  // Données du graphique
  const chartSeries = [25, 30, 70]

  return (
    <Card>
      <CardHeader title={<span style={{ fontSize: 20, fontWeight: 'bold', color: '#e91e63' }}>Patients Type</span>} />
      <CardContent>
        {/* Graphique Pie Chart */}
        <ReactApexChart option={chartOptions} series={chartSeries} type='pie' height={300} />
      </CardContent>
    </Card>
  )
}

export default PatientsTypeChart
