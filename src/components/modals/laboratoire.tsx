'use client'

import { useEffect, useState } from 'react'

import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'

export default function LaboratoireModal({
  isOpen,
  onClose,
  laboratoireData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  laboratoireData?: any
  setUpdate: any
}) {
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    email: '',
    id_ville: '',
    heurD: '',
    heurF: '',
    info: '',
    nom_ut: '',
    id_ser: ''
  })

  const [controls, setControls] = useState<any>({
    email: false,
    emailValid: false,
    nom_ut: false
  })

  const [villeListe, setVilleListe] = useState<any[]>([])
  const [serListe, setSerListe] = useState<any[]>([])

  async function getVilleList() {
    try {
      const url = `${window.location.origin}/api/ville/liste?getall`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setVilleListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getVilleList()
  }, [])

  async function getSerList() {
    try {
      const url = `${window.location.origin}/api/service/liste?getall`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setSerListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getSerList()
  }, [])

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]

    if (file) {
      setData((prev: any) => ({
        ...prev,
        imageSrc: URL.createObjectURL(file)
      }))

      const reader = new FileReader()

      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (laboratoireData) {
      setData({
        ...laboratoireData,
        imageSrc: laboratoireData.image ? `${laboratoireData.image}` : '/img/placeholder-image.jpg',
        id_ser: laboratoireData.id_ser ?? '',
        id_ville: laboratoireData.id_ville ?? ''
      })
    } else {
      setData({
        imageSrc: '/img/placeholder-image.jpg',
        image: '',
        email: '',
        id_ville: '',
        heurD: '',
        heurF: '',
        info: '',
        nom_ut: '',
        id_ser: ''
      })
    }
  }, [laboratoireData])

  const clearForm = () => {
    setData({
      imageSrc: '/img/placeholder-image.jpg',
      image: '',
      email: '',
      id_ville: '',
      heurD: '',
      heurF: '',
      info: '',
      nom_ut: '',
      id_ser: ''
    })
    setControls({
      email: false,
      emailValid: false,
      nom_ut: false
    })
  }

  const isAdd = !laboratoireData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/laboratoire/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        email: data.email.trim() === '',
        emailValid: mailCheck(data.email.trim()),
        nom_ut: data.nom_ut.trim() === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const formData = new FormData()

      clearForm()

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] instanceof File) {
            formData.append(key, data[key])
          } else {
            formData.append(key, data[key])
          }
        }
      }

      if (!data.image || !(data.image instanceof File)) {
        formData.append('currentImage', laboratoireData?.image || '')
      }

      const requestOptions = {
        method: 'POST',
        body: formData
      }

      await fetch(url, requestOptions).then((responseData: any) => {
        setUpdate(Date.now().toString())

        if (responseData.erreur) {
          toast.error('Erreur !')
        } else {
          if (isAdd) {
            toast.success('Le laboratoire a été ajouté avec succès')
          } else {
            toast.success('Le laboratoire a été modifié avec succès')
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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter laboratoire' : 'Modifier laboratoire'}</span>}
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
      <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
        <Grid container spacing={3}>
          <Grid item xs={2} md={2}>
            <Input
              type='file'
              id='image'
              onChange={(e: any) => {
                const file: any = e.target.files?.[0]

                if (file) {
                  setData((prev: any) => ({
                    ...prev,
                    image: file,
                    imageSrc: URL.createObjectURL(file)
                  }))
                  handleImageChange(e)
                }
              }}
              style={{ zoom: 0.8, display: 'none' }}
            />

            <InputLabel htmlFor='image'>
              <img
                src={data.imageSrc ? data.imageSrc : '/img/placeholder-image.jpg'}
                style={{ cursor: 'pointer', borderRadius: '8px' }}
                alt='Preview'
                width={60}
                height={60}
              />
            </InputLabel>
          </Grid>
          <Grid item xs={10} md={10}>
            <TextField
              fullWidth
              label='Nom utilisateur'
              value={data?.nom_ut ?? ''}
              className={`${controls?.nom_ut === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, nom_ut: true })
                  setData((prev: any) => ({
                    ...prev,
                    nom_ut: e.target.value
                  }))
                } else {
                  setControls({ ...controls, nom_ut: false })
                  setData((prev: any) => ({
                    ...prev,
                    nom_ut: e.target.value
                  }))
                }
              }}
              autoFocus
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
            {controls?.nom_ut === true ? <span className='errmsg'>Veuillez saisir le nom d’utilisateur !</span> : null}
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              label='Email'
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
              value={data?.email ?? ''}
              className={`${controls?.email === true || controls.emailValid === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, email: true })
                  setData((prev: any) => ({
                    ...prev,
                    email: e.target.value
                  }))
                } else {
                  setControls({ ...controls, email: false })
                  setControls({ ...controls, emailValid: mailCheck(e.target.value.trim()) })
                  setData((prev: any) => ({
                    ...prev,
                    email: e.target.value
                  }))
                }
              }}
            />
            {controls?.email === true ? (
              <span className='errmsg'>Veuillez saisir l’email !</span>
            ) : controls.emailValid === true ? (
              <span className='errmsg'>
                Email invalide : il doit contenir @ et se terminer par un domaine valide (ex: .com, .net)
              </span>
            ) : null}
          </Grid>

          <Grid item xs={6} md={6}>
            <FormControl fullWidth>
              <InputLabel>Service</InputLabel>
              <Select
                label='Service'
                value={data?.id_ser ?? ''}
                onChange={(e: any) => {
                  if (e === null) {
                    setData({ ...data, id_ser: e.target.value })
                  } else {
                    setData({ ...data, id_ser: e.target.value })
                  }
                }}
              >
                {serListe.map(item => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.ser}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              type='time'
              value={data?.heurD ?? ''}
              onChange={(e: any) => {
                setData((prev: any) => ({
                  ...prev,
                  heurD: e.target.value
                }))
              }}
              autoFocus
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
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              type='time'
              value={data?.heurF ?? ''}
              onChange={(e: any) => {
                setData((prev: any) => ({
                  ...prev,
                  heurF: e.target.value
                }))
              }}
              autoFocus
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
          </Grid>

          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <InputLabel>Ville</InputLabel>
              <Select
                label='Ville'
                value={data?.id_ville ?? ''}
                onChange={(e: any) => {
                  if (e === null) {
                    setData({ ...data, id_ville: e.target.value })
                  } else {
                    setData({ ...data, id_ville: e.target.value })
                  }
                }}
              >
                {villeListe.map(item => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.ville}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Informations complémentaires'
              multiline
              value={data?.info ?? ''}
              onChange={(e: any) => {
                setData((prev: any) => ({
                  ...prev,
                  info: e.target.value
                }))
              }}
              minRows={2}
              maxRows={3}
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
            />
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
