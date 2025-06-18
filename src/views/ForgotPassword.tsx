'use client'

// Next Imports
import { useState } from 'react'

import Link from 'next/link'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Type Imports
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'

import DirectionalIcon from '@components/DirectionalIcon'

import Logo from '@components/layout/shared/Logo'

const ForgotPassword = () => {
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)

  const [data, setData] = useState<any>({
    email: '',
    message: '',
    role: 0
  })

  const [controls, setControls] = useState<any>({
    email: false,
    emailValid: false,
    role: false
  })

  const clearForm = () => {
    setData({ email: '', role: 0 })
    setControls({ email: false, emailValid: false, role: false })
  }

  const options = [
    { label: 'Administrateur', value: 1 },
    { label: 'Médecin', value: 2 },
    { label: 'Laboratoire', value: 3 },
    { label: 'Patient', value: 4 }
  ]

  async function handleSave() {
    try {
      const url = `${window.location.origin}/api/forgot-password/send-mail`

      const newControls = {
        email: data.email.trim() === '',
        emailValid: mailCheck(data.email.trim()),
        role: data.role === 0
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const requestBody = JSON.stringify({ to: data.email, role: data.role })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setData(responseData)

        clearForm()
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <div className='flex flex-col lg:flex-row min-h-screen w-full md:w-full items-center justify-center relative h-screen w-screen bg-white'>
      <div className='hidden lg:flex flex-1 justify-center items-center min-h-screen bg-gray-100'>
        <span className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </span>
        <img src='/images/pages/doc3.svg' className='max-w-[800px]' />
      </div>

      {/* Formulaire */}
      <div className='flex flex-col justify-center items-center w-full max-w-xl p-12 min-h-screen space-y-6'>
        <div className='mb-5'>
          <h3 className='text-3xl font-bold mb-3'>Mot de passe oublié 🔒</h3>
          <Typography className='mbs-1 text-lg'>
            Saisissez votre adresse e-mail et nous vous enverrons les instructions pour réinitialiser votre mot de passe
          </Typography>
        </div>
        <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
          <Grid item xs={10} md={10}>
            {' '}
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label='Role'
                className={`h-12 md:h-[60px] ${controls?.role === true ? 'isReq' : ''}`}
                value={data?.role || null}
                onChange={(e: any) => {
                  if (e === null) {
                    setControls({ ...controls, role: true })
                    setData((prev: any) => ({
                      ...prev,
                      role: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, role: false })
                    setData((prev: any) => ({
                      ...prev,
                      role: e.target.value
                    }))
                  }
                }}
              >
                {options.map(item => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {controls?.role === true ? <span className='errmsg'>Veuillez saisir le role !</span> : null}
          </Grid>
          <TextField
            value={data?.email ?? ''}
            fullWidth
            label='Email'
            InputLabelProps={{ sx: { fontSize: '1rem' } }}
            InputProps={{
              sx: { height: 60 }
            }}
            className={`${controls?.email === true ? 'isReq' : ''}`}
            onChange={(e: any) => {
              const value = e.target.value
              const isEmpty = value.trim() === ''
              const isInvalid = mailCheck(value.trim())

              setData((prev: any) => ({ ...prev, email: value }))
              setControls((prev: any) => ({
                ...prev,
                email: isEmpty,
                emailValid: !isEmpty && isInvalid
              }))
            }}
          />
          {controls?.email === true ? (
            <span className='errmsg'>Veuillez saisir l’email !</span>
          ) : controls.emailValid === true ? (
            <span className='errmsg'>
              Email invalide : il doit contenir @ et se terminer par un domaine valide (ex: .com, .net)
            </span>
          ) : null}
          <Button
            fullWidth
            variant='contained'
            type='button'
            sx={{
              height: 40,
              fontSize: '1rem'
            }}
            onClick={() => {
              handleSave()
            }}
          >
            Envoyer le lien de réinitialisation
          </Button>

          <Typography className='flex justify-center items-center mt-4' color='primary'>
            <Link href='/login' className='flex items-center'>
              <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
              <span>Retour à la connexion</span>
            </Link>
          </Typography>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
