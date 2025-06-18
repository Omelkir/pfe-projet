'use client'
import React, { useState } from 'react'

import { motion } from 'framer-motion'
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogActions
} from '@mui/material'

import { FaCheckCircle, FaEnvelope } from 'react-icons/fa'

import { getStorageData } from '@/utils/helpersFront'
import ConnModal from '@/components/modals/conOblig'

const ConnectezNous = () => {
  const [authError] = useState(false)

  const userDataFront = getStorageData('user')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const [data, setData] = useState<any>({
    message: '',
    type: '',
    id_patient: ''
  })

  const [controls, setControls] = useState<any>({
    message: false,
    type: false
  })

  const clearForm = () => {
    setData({
      message: '',
      type: '',
      id_patient: ''
    })
    setControls({
      message: false,
      type: false
    })
  }

  const options = [
    { label: 'Un rendez-vous', value: 1 },
    { label: 'Un médecin', value: 2 },
    { label: 'Un laboratoire', value: 3 },
    { label: 'Un problème technique', value: 4 },
    { label: 'Autres', value: 5 }
  ]

  const handleSave = async () => {
    try {
      if (!userDataFront || !userDataFront.id) {
        handleOpenModal()

        return
      }

      const url = `${window.location.origin}/api/reclamation/ajouter`

      const newControls = {
        message: data.message.trim() === '',
        type: data.type === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const requestBody = JSON.stringify({ ...data, id_patient: userDataFront?.id ?? '' })

      const requestOptions = {
        method: 'POST',
        body: requestBody
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        console.log(responseData.message)
      } else {
        setData(responseData)
        clearForm()
        setOpen(true)
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className='py-12 px-12 bg5 min-h-screen flex justify-start items-center'
    >
      <Card className='flex flex-col w-[600px] max-w-2xl'>
        <CardContent className='p-6 sm:!p-12'>
          <Typography variant='h3' className='mb-12 text-center'>
            Nous contacter
          </Typography>

          <div className='flex flex-col gap-5'>
            <form className='flex flex-col gap-5'>
              <Grid container spacing={6}>
                <Grid item xs={12} md={12}>
                  {' '}
                  <FormControl fullWidth>
                    <InputLabel>Votre message concerne...</InputLabel>
                    <Select
                      label='Votre message concerne...'
                      className={`h-12 md:h-[60px] ${controls?.type === true ? 'isReq' : ''}`}
                      value={data?.type ?? ''}
                      onChange={(e: any) => {
                        if (e === null) {
                          setControls({ ...controls, type: true })
                          setData((prev: any) => ({
                            ...prev,
                            type: e.target.value
                          }))
                        } else {
                          setControls({ ...controls, type: false })
                          setData((prev: any) => ({
                            ...prev,
                            type: e.target.value
                          }))
                        }
                      }}
                    >
                      {options.map((item: any) => (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {controls?.type === true ? <span className='errmsg'>Veuillez saisir le type !</span> : null}
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label='Message'
                    multiline
                    value={data?.message ?? ''}
                    className={`${controls?.message === true ? 'isReqTextearea' : ''}`}
                    onChange={(e: any) => {
                      if (e.target?.value.trim() === '') {
                        setControls({ ...controls, message: true })
                        setData((prev: any) => ({
                          ...prev,
                          message: e.target.value
                        }))
                      } else {
                        setControls({ ...controls, message: false })
                        setData((prev: any) => ({
                          ...prev,
                          message: e.target.value
                        }))
                      }
                    }}
                    minRows={2}
                    maxRows={3}
                    InputLabelProps={{
                      sx: {
                        fontSize: '0.875rem',
                        '@media (min-width:768px)': {
                          fontSize: '1rem'
                        }
                      }
                    }}
                  />
                  {controls?.message === true ? <span className='errmsg'>Veuillez saisir votre message !</span> : null}
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant='contained'
                type='button'
                sx={{
                  height: 30,
                  fontSize: '0.875rem',
                  '@media (min-width:768px)': {
                    height: 40,
                    fontSize: '1rem'
                  }
                }}
                onClick={() => {
                  handleSave()
                }}
              >
                Envoyer
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      <ConnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={1}>
           
            <h1 className='block w-full text-center'>
             <FaCheckCircle className='text-green-500 text-6xl' />
            </h1>
          </Box>
        </DialogTitle>
       

        <DialogContent dividers className='mb-3 text-center'>
          <div className='text-center px-4 space-y-2'>
            <h3 className='text-lg font-semibold text-green-700'>
              Votre réclamation a été <strong>envoyée avec succès</strong>
            </h3>
            <p className='text-sm text-gray-700 leading-6'>
              Veuillez attendre sa <strong>réponse par un administrateur</strong>.
            </p>
            <div className='flex items-center justify-center gap-2 text-sm text-gray-700'>
              <FaEnvelope className='text-lg text-green-600' />
              <span>Un e-mail de réponse vous sera envoyé.</span>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button style={{ backgroundColor: 'white', color: 'black' }} size='small' onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  )
}

export default ConnectezNous
