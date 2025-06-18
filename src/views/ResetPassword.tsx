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
import { Grid, IconButton, InputAdornment } from '@mui/material'

import DirectionalIcon from '@components/DirectionalIcon'

import Logo from '@components/layout/shared/Logo'

const ResetPassword = () => {
  const passwordCheck = (password: any) =>
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/.test(password)

  const [data, setData] = useState<any>({
    mdp: '',
    conMdp: ''
  })

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const to = searchParams.get('to')
  const role = searchParams.get('role')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordShown2, setIsPasswordShown2] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowPassword2 = () => setIsPasswordShown2(show => !show)

  const [controls, setControls] = useState<any>({
    mdp: false,
    conMdp: false,
    mdpValid: false,
    conMdpValid: false
  })

  const clearForm = () => {
    setData({ mdp: '', conMdp: '' })
    setControls({ mdp: false, conMdp: false, mdpValid: false, conMdpValid: false })
  }

  async function handleSave() {
    try {
      const url = `${window.location.origin}/api/forgot-password/reset`

      const newControls = {
        mdpValid: passwordCheck(data.mdp.trim()),
        conMdpValid: passwordCheck(data.conMdp.trim()),
        mdp: data.mdp.trim() === '',
        conMdp: data.conMdp.trim() === '',
        mismatch: data.mdp.trim() !== data.conMdp.trim()
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const requestBody = JSON.stringify({ to, token, mdp: data.mdp, role })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }

      const response = await fetch(url, requestOptions)

      await response.json()

      clearForm()
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
          <h3 className='text-3xl font-bold mb-3'>Réinitialiser le mot de passe 🔒</h3>
          <Typography className='mbs-1 text-lg'>
            Saisissez un nouveau mot de passe et confirmez-le pour réinitialiser votre mot de passe.
          </Typography>
        </div>
        <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
          <div>
            <Grid container spacing={6}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  value={data?.mdp ?? ''}
                  label='Mot de passe'
                  type={isPasswordShown ? 'text' : 'password'}
                  InputLabelProps={{
                    sx: {
                      fontSize: '1rem'
                    }
                  }}
                  className={`${controls?.mdp === true || controls.mdpValid === true ? 'isReq' : ''}`}
                  InputProps={{
                    sx: {
                      height: 60,
                      fontSize: '1rem',
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
                          <i className={isPasswordShown ? 'ri-eye-off-line text-2xl' : 'ri-eye-line text-2xl'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onChange={(e: any) => {
                    const value = e.target.value
                    const isEmpty = value.trim() === ''
                    const isInvalid = passwordCheck(value.trim())

                    setData((prev: any) => ({ ...prev, mdp: value }))
                    setControls((prev: any) => ({
                      ...prev,
                      mdp: isEmpty,
                      mdpValid: !isEmpty && isInvalid
                    }))
                  }}
                />
                {controls?.mdp === true ? (
                  <span className='errmsg'>Veuillez saisir le mot de passe !</span>
                ) : controls.mdpValid === true ? (
                  <span className='errmsg'>
                    Mot de passe invalide : il doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                    chiffre et un caractère spécial (ex: @, $, !).
                  </span>
                ) : null}
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  value={data?.conMdp ?? ''}
                  label='Confirmation'
                  type={isPasswordShown2 ? 'text' : 'password'}
                  InputLabelProps={{
                    sx: {
                      fontSize: '1rem'
                    }
                  }}
                  className={`${controls?.conMdp === true || controls.conMdpValid === true ? 'isReq' : ''}`}
                  InputProps={{
                    sx: {
                      height: 60,
                      fontSize: '1rem',
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
                          onClick={handleClickShowPassword2}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown2 ? 'ri-eye-off-line text-2xl' : 'ri-eye-line text-2xl'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onChange={(e: any) => {
                    const value = e.target.value
                    const isEmpty = value.trim() === ''
                    const isInvalid = passwordCheck(value.trim())

                    setData((prev: any) => ({ ...prev, conMdp: value }))
                    setControls((prev: any) => ({
                      ...prev,
                      conMdp: isEmpty,
                      conMdpValid: !isEmpty && isInvalid
                    }))
                  }}
                />
                {controls?.conMdp === true ? (
                  <span className='errmsg'>Confirmez le mot de passe !</span>
                ) : controls.conMdpValid === true ? (
                  <span className='errmsg'>
                    Mot de passe invalide : il doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                    chiffre et un caractère spécial (ex: @, $, !).
                  </span>
                ) : data.mdp !== data.conMdp && data.conMdp !== '' ? (
                  <span className='errmsg'>Les mots de passe ne correspondent pas.</span>
                ) : null}
              </Grid>
            </Grid>
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
            Réinitialiser le mot de passe
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
