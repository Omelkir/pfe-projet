'use client'

import React, { useEffect, useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'

import { FaCheckCircle } from 'react-icons/fa'

import { Modal } from '../ui/modal'
import { getStorageData as getStorageDataFront } from '@/utils/helpersFront'

export default function RendezVousModal({
  isOpen,
  onClose,
  medecinId,
  laboId
}: {
  isOpen: boolean
  onClose: () => void
  medecinId: any
  laboId: any
}) {
  const userDataFront = getStorageDataFront('user')
  const now = new Date()
  const maxDateTime = now.toISOString().slice(0, 16)
  const [success, setSuccess] = useState(false)

  console.log('medecinId:', medecinId)
  console.log('laboId:', laboId)

  const [data, setData] = useState<any>({
    id_patient: userDataFront?.id,
    date: '',
    id_el: medecinId ?? laboId ?? null,
    el: medecinId ? 2 : laboId ? 3 : null,
    duree: 30,
    isApproved: 0,
    description: ''
  })

  useEffect(() => {
    if (medecinId) {
      setData((prev: any) => ({ ...prev, id_el: medecinId, el: 2 }))
    } else if (laboId) {
      setData((prev: any) => ({ ...prev, id_el: laboId, el: 3 }))
    }
  }, [medecinId, laboId])
  const [controls, setControls] = useState<any>({ id_patient: false, date: false, duree: false, description: false })

  const clearForm = () => {
    setData({ id_patient: userDataFront.id, date: '', id_el: '', el: '', duree: 30, isApproved: 0, description: '' })
    setControls({ id_patient: false, date: false, duree: false, description: false })
  }

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/rendez-vous/ajouter`

      const newControls = {
        date: data.date.trim() === '',
        description: data.description.trim() === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }

      console.log('Data to send:', data)
      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setSuccess(true)
        clearForm()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [success])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={!success && <span className='block w-full text-center'>Prendre rendez-vous</span>}
      footer={
        <div className='flex justify-end gap-2'>
          {!success && (
            <>
              <Button
                variant='contained'
                style={{ backgroundColor: 'white', color: 'black' }}
                size='small'
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button variant='contained' color='primary' size='small' onClick={handleSave}>
                Envoyer
              </Button>{' '}
            </>
          )}
        </div>
      }
    >
      <form className='space-y-4'>
        {success ? (
          <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
            <FaCheckCircle className='text-green-500 text-6xl mb-4' />
            <h3 className='text-xl font-semibold text-green-700 mb-2'>Rendez-vous confirmé</h3>
            <p className='text-gray-600'>Votre rendez-vous a été pris avec succès. Merci de votre confiance !</p>
          </div>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                type='datetime-local'
                InputLabelProps={{ sx: { fontSize: '1rem' } }}
                className={controls.date ? 'isReq' : ''}
                value={data?.date || ''}
                inputProps={{
                  min: maxDateTime
                }}
                onChange={e => {
                  setControls({ ...controls, date: !e.target.value.trim() })
                  setData((prev: any) => ({ ...prev, date: e.target.value }))
                }}
              />
              {controls.date && <span className='errmsg'>Veuillez saisir la date !</span>}
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label='Description'
                multiline
                value={data?.description ?? ''}
                className={`${controls?.description === true ? 'isReqTextearea' : ''}`}
                onChange={(e: any) => {
                  if (e.target?.value.trim() === '') {
                    setControls({ ...controls, description: true })
                    setData((prev: any) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, description: false })
                    setData((prev: any) => ({
                      ...prev,
                      description: e.target.value
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
              {controls?.description === true ? (
                <span className='errmsg'>Veuillez saisir votre description !</span>
              ) : null}
            </Grid>
          </Grid>
        )}
      </form>
    </Modal>
  )
}
