'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'

import Award from '@views/dashboard/Award'
import Transactions from '@views/dashboard/Transactions'


import PatientChart from '@/views/dashboard/PatientChart'
import AppointmentChart from '@/views/dashboard/AppointmentChart'
import { getStorageData } from '@/utils/helpers'
import MedecinChart from '@/views/dashboard/medecinChart'
import LaboratoiresChart from '@/views/dashboard/laboratoireChart'

const DashboardAnalytics = () => {
  const typeOfLogger: any = getStorageData('typeOfLogger')
  const userData = getStorageData('user')
  const router = useRouter()

  if (userData === undefined) {
    router.push('/login')
  }

  const [totalPatients, setTotalPatients] = useState(0)
  const [totalMedecins, setTotalMedecins] = useState(0)
  const [totalLabs, setTotalLabs] = useState(0)

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

        if (!res.erreur && res.statistiquesPatient) {
          setTotalPatients(res.statistiquesPatient.total)
        }
      } catch (error) {
        console.error('Erreur chargement patients:', error)
      }
    }

    fetchPatients()
  }, [])
  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const url = `${window.location.origin}/api/statistique-admin/statistique`
        const response = await fetch(url)
        const res = await response.json()

        if (!res.erreur && res.statistiquesMedecin) {
          setTotalMedecins(res.statistiquesMedecin.total)
        }
      } catch (error) {
        console.error('Erreur chargement Médecins:', error)
      }
    }

    fetchMedecins()
  }, [])
  useEffect(() => {
    const fetchLaboratoires = async () => {
      try {
        const url = `${window.location.origin}/api/statistique-admin/statistique`
        const response = await fetch(url)
        const res = await response.json()

        if (!res.erreur && res.statistiquesLabo) {
          setTotalLabs(res.statistiquesLabo.total)
        }
      } catch (error) {
        console.error('Erreur chargement laboratoires:', error)
      }
    }

    fetchLaboratoires()
  }, [])

  return typeOfLogger === 3 ? (
    <Grid container spacing={6}>
      <Grid item xs={12} md={10} lg={8} sx={{ height: '300px' }}>
        <Transactions title='Good Morning' nom={`Laboratoire ${userData.nom}`} image='bg' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award
          icons='ri-user-line'
          number={totalPatients.toLocaleString('fr-FR')}
          title='Patients'
          color='#0573b8'
          bg='#e3eefd'
        />
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
      {/* <Grid item xs={12}>
        <Table />
      </Grid> */}
    </Grid>
  ) : typeOfLogger === 2 ? (
    <Grid container spacing={6}>
      <Grid item xs={12} md={10} lg={8} sx={{ height: '300px' }}>
        <Transactions title='Bonjour' nom={`Dr. ${userData.nom}`} image='bg' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award
          icons='ri-user-line'
          number={totalPatients.toLocaleString('fr-FR')}
          title='Patients'
          color='#0573b8'
          bg='#e3eefd'
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-money-dollar-circle-line' number='$986K' title='Gains' color='#0ebb13' bg='#e9fdea' />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <PatientChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <AppointmentChart />
      </Grid>
      {/* <Grid item xs={12}>
        <Table />
      </Grid> */}
    </Grid>
  ) : typeOfLogger === 1 ? (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6} lg={6} sx={{ height: '300px' }}>
        <Transactions title='Bonjour' nom={`${userData.nom}`} image='bgAdmin' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award
          icons='ri-user-line'
          number={totalPatients.toLocaleString('fr-FR')}
          title='Patients'
          color='#ff5a39'
          bg='#ffefec'
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award
          icons='ri-nurse-line'
          number={totalMedecins.toLocaleString('fr-FR')}
          title='Médecins'
          color='#0573b8'
          bg='#e3eefd'
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award
          icons='ri-test-tube-fill'
          number={totalLabs.toLocaleString('fr-FR')}
          title='Laboratoires'
          color='#0ebb13'
          bg='#e9fdea'
        />
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <PatientChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <MedecinChart />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <LaboratoiresChart />
      </Grid>
      {/* <Grid item xs={12}>
        <Table />
      </Grid> */}
    </Grid>
  ) : (
    <div></div>
  )
}

export default DashboardAnalytics
