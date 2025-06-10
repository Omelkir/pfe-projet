'use client'

// MUI Imports
import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'

import Award from '@views/dashboard/Award'
import Transactions from '@views/dashboard/Transactions'

import Table from '@views/dashboard/Table'

import PatientChart from '@/views/dashboard/PatientChart'
import AppointmentChart from '@/views/dashboard/AppointmentChart'
import { getStorageData } from '@/utils/helpers'

const DashboardAnalytics = () => {
  const typeOfLogger: any = getStorageData('typeOfLogger')
  const userData = getStorageData('user')
  const router = useRouter()

  if (userData === undefined) {
    router.push('/login')
  }

  return typeOfLogger === 3 ? (
    <Grid container spacing={6}>
      <Grid item xs={12} md={10} lg={8} sx={{ height: '300px' }}>
        <Transactions title='Good Morning' nom={`Laboratoire ${userData.nom}`} image='bg' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-user-line' number='3809' title='Patients' color='#0573b8' bg='#e3eefd' />
      </Grid>
      {/* <Grid item xs={12} md={2}>
        <Award icons='ri-lungs-line' number='906' title='Surgeries' color='#ff5a39' bg='#ffefec' />
      </Grid> */}
      <Grid item xs={12} md={2}>
        <Award icons='ri-money-dollar-circle-line' number='$986K' title='Earnings' color='#0ebb13' bg='#e9fdea' />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <PatientChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <AppointmentChart />
      </Grid>
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  ) : typeOfLogger === 2 ? (
    <Grid container spacing={6}>
      <Grid item xs={12} md={10} lg={8} sx={{ height: '300px' }}>
        <Transactions title='Good Morning' nom={`Dr. ${userData.nom}`} image='bg' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-user-line' number='3809' title='Patients' color='#0573b8' bg='#e3eefd' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-money-dollar-circle-line' number='$986K' title='Earnings' color='#0ebb13' bg='#e9fdea' />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <PatientChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <AppointmentChart />
      </Grid>
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  ) : typeOfLogger === 1 ? (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6} lg={6} sx={{ height: '300px' }}>
        <Transactions title='Good Morning' nom={`Dr. ${userData.nom}`} image='bgAdmin' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-user-line' number='3809' title='Patients' color='#ff5a39' bg='#ffefec' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-nurse-line' number='2120' title='Médecin' color='#0573b8' bg='#e3eefd' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-test-tube-fill' number='1365' title='Laboratoire' color='#0ebb13' bg='#e9fdea' />
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <PatientChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <AppointmentChart />
      </Grid>
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  ) : (
    <div></div>
  )

  // return (
  //   <Grid container spacing={6}>
  //     <Grid item xs={12} md={8} lg={6} sx={{ height: '300px' }}>
  //       <Transactions />
  //     </Grid>
  //     <Grid item xs={12} md={2}>
  //       <Award icons='ri-user-line' number='3809' title='Patients' color='#0573b8' bg='#e3eefd' />
  //     </Grid>
  //     <Grid item xs={12} md={2}>
  //       <Award icons='ri-lungs-line' number='906' title='Surgeries' color='#ff5a39' bg='#ffefec' />
  //     </Grid>
  //     <Grid item xs={12} md={2}>
  //       <Award icons='ri-money-dollar-circle-line' number='$986K' title='Earnings' color='#0ebb13' bg='#e9fdea' />
  //     </Grid>
  //     <Grid item xs={12} md={6} lg={6}>
  //       <PatientChart />
  //     </Grid>
  //     <Grid item xs={12} md={6} lg={6}>
  //       <AppointmentChart />
  //     </Grid>
  //     <Grid item xs={12}>
  //       <Table />
  //     </Grid>
  //   </Grid>
  // )
}

export default DashboardAnalytics
