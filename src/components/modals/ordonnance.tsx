'use client'

import { useEffect, useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'
import { getStorageData } from '@/utils/helpers'

export default function OrdonnancesModal({
  isOpen,
  onClose,
  ordananceData,
  setUpdate,
  patient,
  id_cons
}: {
  isOpen: boolean
  onClose: () => void
  ordananceData?: any
  setUpdate: any
  patient: any
  id_cons: any
}) {
  const userData = getStorageData('user')

  const [data, setData] = useState<any>({
    medi: '',
    duree: '',
    dosage: '',
    id_cons: id_cons,
    id_patient: patient,
    id_el: userData?.id,
    el: 2
  })

  console.log('id_cons', id_cons)

  const [controls, setControls] = useState<any>({ medi: false, duree: false, dosage: false })

  useEffect(() => {
    if (ordananceData) {
      setData(ordananceData)
    } else {
      setData({ medi: '', duree: '', dosage: '' })
    }
  }, [ordananceData])
  useEffect(() => {
    setData((prevData: any) => ({
      ...prevData,
      id_cons: id_cons || null,
      id_patient: patient || null,
      id_el: userData?.id || null,
      el: 2
    }))
  }, [patient, userData?.id, id_cons])
  const isAdd = !ordananceData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/ordonnance/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        medi: data.medi.trim() === '',
        dosage: data.dosage.trim() === '',
        duree: data.duree.trim() === ''
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
            toast.success("L'ordonance a été ajouté avec succès")
          } else {
            toast.success("L'ordonance a été modifié avec succès")
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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter ordonnance' : 'Modifier ordonnance'}</span>}
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
              label='Médicament'
              value={data?.medi ?? ''}
              className={`${controls?.medi === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, medi: true })
                  setData((prev: any) => ({
                    ...prev,
                    medi: e.target.value
                  }))
                } else {
                  setControls({ ...controls, medi: false })
                  setData((prev: any) => ({
                    ...prev,
                    medi: e.target.value
                  }))
                }
              }}
              InputLabelProps={{
                sx: { fontSize: '1rem' }
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
            {controls?.medi === true ? <span className='errmsg'>Veuillez saisir le médicament !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Dosage'
              value={data?.dosage ?? ''}
              className={`${controls?.dosage === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, dosage: true })
                  setData((prev: any) => ({
                    ...prev,
                    dosage: e.target.value
                  }))
                } else {
                  setControls({ ...controls, dosage: false })
                  setData((prev: any) => ({
                    ...prev,
                    dosage: e.target.value
                  }))
                }
              }}
              InputLabelProps={{
                sx: { fontSize: '1rem' }
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
            {controls?.dosage === true ? <span className='errmsg'>Veuillez saisir le dosage !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Durée'
              value={data?.duree ?? ''}
              className={`${controls?.duree === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, duree: true })
                  setData((prev: any) => ({
                    ...prev,
                    duree: e.target.value
                  }))
                } else {
                  setControls({ ...controls, duree: false })
                  setData((prev: any) => ({
                    ...prev,
                    duree: e.target.value
                  }))
                }
              }}
              InputLabelProps={{
                sx: { fontSize: '1rem' }
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
            {controls?.duree === true ? <span className='errmsg'>Veuillez saisir le durée !</span> : null}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
