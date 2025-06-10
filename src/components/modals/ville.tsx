'use client'

import { useEffect, useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'

export default function VilleModal({
  isOpen,
  onClose,
  villeData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  villeData?: any
  setUpdate: any
}) {
  const [data, setData] = useState<any>({
    ville: ''
  })

  useEffect(() => {
    if (villeData) {
      setData(villeData)
    } else {
      setData({ ville: '' })
    }
  }, [villeData])

  const [controls, setControls] = useState<any>({
    ville: false
  })

  const clearForm = () => {
    setData({ ville: '' })
    setControls({ ville: false })
  }

  const isAdd = !villeData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/ville/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        ville: data.ville.trim() === ''
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
            toast.success('La ville a été ajouté avec succès')
          } else {
            toast.success('La ville a été modifié avec succès')
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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter ville' : 'Modifier ville'}</span>}
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
              label='Ville'
              value={data?.ville ?? ''}
              className={`${controls?.ville === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, ville: true })
                  setData((prev: any) => ({
                    ...prev,
                    ville: e.target.value
                  }))
                } else {
                  setControls({ ...controls, ville: false })
                  setData((prev: any) => ({
                    ...prev,
                    ville: e.target.value
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
            {controls?.ville === true ? <span className='errmsg'>Veuillez saisir la ville !</span> : null}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
