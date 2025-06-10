'use client'

// Next Imports
import { useState } from 'react'

import Link from 'next/link'

// MUI Imports
import { useSearchParams } from 'next/navigation'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Type Imports
import { IconButton, InputAdornment } from '@mui/material'

import DirectionalIcon from '@components/DirectionalIcon'

import Logo from '@components/layout/shared/Logo'

const ResetPassword = () => {
  const [data, setData] = useState<any>({
    email: '',
    mdp: ''
  })

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const to = searchParams.get('to')
  const role = searchParams.get('role')

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const [controls, setControls] = useState<any>({
    email: false
  })

  const clearForm = () => {
    setData({ email: '', mdp: '' })
    setControls(false)
  }

  async function handleSave() {
    try {
      const url = `${window.location.origin}/api/forgot-password/reset`

      const requestBody = JSON.stringify({ to, token, mdp: data.mdp, role })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  console.log({ token })

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
          <h3 className='text-3xl font-bold mb-3'>Reset Password 🔒</h3>
          <Typography className='mbs-1 text-lg'>
            Enter your email and we&#39;ll send you instructions to reset your password
          </Typography>
        </div>
        <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
          <div>
            <TextField
              fullWidth
              value={data.mdp}
              className={`${controls?.mdp === true ? 'isReq' : ''}`}
              label='Password'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, mdp: true })
                  setData((prev: any) => ({
                    ...prev,
                    mdp: e.target.value
                  }))
                } else {
                  setControls({ ...controls, mdp: false })
                  setData((prev: any) => ({
                    ...prev,
                    mdp: e.target.value
                  }))
                }
              }}
              InputProps={{
                sx: {
                  height: 60,
                  '&.Mui-focused': {
                    '& + .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  },
                  paddingRight: 5
                },
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      size='large'
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
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
            Send reset link
          </Button>

          <Typography className='flex justify-center items-center mt-4' color='primary'>
            <Link href='/login' className='flex items-center'>
              <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
              <span>Back to Login</span>
            </Link>
          </Typography>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
