'use client'

import { useEffect, useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'
import { getStorageData } from '@/utils/helpers'

export default function SpecialiteModal({
  isOpen,
  onClose,
  speData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  speData?: any
  setUpdate: any
}) {
  const [data, setData] = useState<any>({
    spe: ''
  })

  useEffect(() => {
    if (speData) {
      setData(speData)
    } else {
      setData({ spe: '' })
    }
  }, [speData])

  const [controls, setControls] = useState<any>({
    spe: false
  })

  const clearForm = () => {
    setData({ spe: '' })
    setControls({ spe: false })
  }

  const isAdd = !speData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/specialite/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        spe: data.spe.trim() === ''
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
            toast.success('Le spécialité a été ajouté avec succès')
          } else {
            toast.success('Le spécialité a été modifié avec succès')
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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter spécialité' : 'Modifier spécialité'}</span>}
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
              label='Spécialité'
              value={data?.spe ?? ''}
              className={`${controls?.spe === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, spe: true })
                  setData((prev: any) => ({
                    ...prev,
                    spe: e.target.value
                  }))
                } else {
                  setControls({ ...controls, spe: false })
                  setData((prev: any) => ({
                    ...prev,
                    spe: e.target.value
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
            {controls?.spe === true ? <span className='errmsg'>Veuillez saisir le spécialité !</span> : null}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
