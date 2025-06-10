'use client'

import { useEffect, useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'

export default function ServiceModal({
  isOpen,
  onClose,
  serData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  serData?: any
  setUpdate: any
}) {
  const [data, setData] = useState<any>({
    ser: ''
  })

  useEffect(() => {
    if (serData) {
      setData(serData)
    } else {
      setData({ ser: '' })
    }
  }, [serData])

  const [controls, setControls] = useState<any>({
    ser: false
  })

  const clearForm = () => {
    setData({ ser: '' })
    setControls({ ser: false })
  }

  const isAdd = !serData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/service/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        ser: data.ser.trim() === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      setData({ data })
      const requestBody = JSON.stringify(data)
      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      
      await fetch(url, requestOptions).then((responseData: any) => {
        setUpdate(Date.now().toString())

        if (responseData.erreur) {
          alert(responseData.message)
          toast.error('Erreur !')
        } else {
          if (isAdd) {
            toast.success('Le service a été ajouté avec succès')
          } else {
            toast.success('Le service a été modifié avec succès')
          }

          onClose()
        }
      })
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter service' : 'Modifier service'}</span>}
      footer={
        <div className='flex justify-end gap-2'>
          <Button
            variant='contained'
            style={{ backgroundColor: 'white', color: 'black' }}
            size='small'
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={() => {
              handleSave()
            }}
          >
            {isAdd ? 'Ajouter' : 'Modifier'}
          </Button>
        </div>
      }
    >
      <form className='space-y-4'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Service'
              value={data?.ser ?? ''}
              className={`${controls?.ser === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, ser: true })
                  setData((prev: any) => ({
                    ...prev,
                    ser: e.target.value
                  }))
                } else {
                  setControls({ ...controls, ser: false })
                  setData((prev: any) => ({
                    ...prev,
                    ser: e.target.value
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
                  }
                }
              }}
            />
            {controls?.ser === true ? <span className='errmsg'>Veuillez saisir le service !</span> : null}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
