'use client'

import { useEffect, useState } from 'react'

import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'
import { getStorageData } from '@/utils/helpers'

export default function PatientModal({
  isOpen,
  onClose,
  patientData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  patientData?: any
  setUpdate: any
}) {
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)
  const userData = getStorageData('user')
  const phoneCheck = (tel: any) => !/^[259]\d{7}$/.test(tel)

  const ageCheck = (age: any) => {
    const num = Number(age)

    return !isNaN(num) && num >= 18 && num <= 60
  }

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    nom: '',
    prenom: '',
    mdp: '',
    email: '',
    tel: '',
    age: '',
    id_ville: '',
    id_el: userData?.id ?? 0,
    el: userData?.role ?? 0
  })

  const [controls, setControls] = useState<any>({
    nom: false,
    prenom: false,
    mdp: false,
    email: false,
    tel: false,
    telValid: false,
    age: false,
    ageValid: false,
    id_ville: false,
    emailValid: false
  })

  const [villeListe, setVilleListe] = useState<any[]>([])

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
    if (patientData) {
      setData({
        ...patientData,
        imageSrc: patientData.image ? `${patientData.image}` : '/img/placeholder-image.jpg',
        id_ville: patientData.id_ville ?? ''
      })
    } else {
      setData({
        imageSrc: '/img/placeholder-image.jpg',
        image: '',
        nom: '',
        prenom: '',
        mdp: '',
        email: '',
        tel: '',
        age: '',
        id_ville: '',
        id_el: userData?.id,
        el: userData?.role
      })
    }
  }, [patientData, userData?.id])

  const clearForm = () => {
    setData({
      imageSrc: '/img/placeholder-image.jpg',
      nom: '',
      prenom: '',
      image: '',
      mdp: '',
      email: '',
      tel: '',
      age: '',
      id_ville: '',
      id_el: userData?.id,
      el: userData?.role
    })
    setControls({
      nom: false,
      prenom: false,
      mdp: false,
      email: false,
      tel: false,
      telValid: false,
      age: false,
      ageValid: false,
      id_ville: false,
      emailValid: false
    })
  }

  const isAdd = !patientData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/patient/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        nom: data.nom.trim() === '',
        prenom: data.prenom.trim() === '',
        email: data.email.trim() === '',

        id_ville: data.id_ville.toString().trim() === '',
        emailValid: mailCheck(data.email.trim()),

        age: data.age.trim() === '',

        // ageValid: ageCheck(data.age.trim()),

        tel: data.tel.trim() === '',
        telValid: phoneCheck(data.tel.trim())
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
        formData.append('currentImage', patientData?.image || '')
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
            toast.success('Le patient a été ajouté avec succès')
          } else {
            toast.success('Le patient a été modifié avec succès')
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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter Patient' : 'Modifier Patient'}</span>}
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
      <form noValidate autoComplete='off' className='w-full space-y-6'>
        <Grid container spacing={3}>
          {userData?.role === 1 ? (
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
          ) : null}

          <Grid
            item
            xs={userData?.role === 2 || userData?.role === 3 ? 12 : 10}
            md={userData?.role === 2 || userData?.role === 3 ? 12 : 10}
          >
            <FormControl fullWidth>
              <InputLabel>Ville</InputLabel>
              <Select
                label='Ville'
                className={`${controls?.id_ville === true ? 'isReq' : ''}`}
                value={data?.id_ville ?? ''}
                onChange={(e: any) => {
                  if (e === null) {
                    setControls({ ...controls, id_ville: true })
                    setData((prev: any) => ({
                      ...prev,
                      id_ville: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, id_ville: false })
                    setData((prev: any) => ({
                      ...prev,
                      id_ville: e.target.value
                    }))
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
            {controls?.id_ville === true ? <span className='errmsg'>Veuillez sélectionner la ville!</span> : null}
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              label='Nom'
              value={data?.nom ?? ''}
              className={`${controls?.nom === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, nom: true })
                  setData((prev: any) => ({
                    ...prev,
                    nom: e.target.value
                  }))
                } else {
                  setControls({ ...controls, nom: false })
                  setData((prev: any) => ({
                    ...prev,
                    nom: e.target.value
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
            {controls?.nom === true ? <span className='errmsg'>Veuillez saisir le nom !</span> : null}
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              label='Prenom'
              value={data?.prenom ?? ''}
              className={`${controls?.prenom === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, prenom: true })
                  setData((prev: any) => ({
                    ...prev,
                    prenom: e.target.value
                  }))
                } else {
                  setControls({ ...controls, prenom: false })
                  setData((prev: any) => ({
                    ...prev,
                    prenom: e.target.value
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
            {controls?.prenom === true ? <span className='errmsg'>Veuillez saisir le prenom !</span> : null}
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              label='Numéro de téléphone'
              value={data?.tel ?? ''}
              className={`${controls?.tel === true || controls.telValid === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                const value = e.target.value
                const isEmpty = value.trim() === ''
                const isInvalid = phoneCheck(value.trim())

                setData((prev: any) => ({ ...prev, tel: value }))
                setControls((prev: any) => ({
                  ...prev,
                  tel: isEmpty,
                  telValid: !isEmpty && isInvalid
                }))
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '1rem'
                }
              }}
              InputProps={{
                sx: {
                  height: 60, // md and up
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    '& + .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }
                }
              }}
            />

            {controls?.tel === true ? (
              <span className='errmsg'>Veuillez saisir le numéro de téléphone !</span>
            ) : controls.telValid === true ? (
              <span className='errmsg'>
                Numéro de téléphone invalide : il doit contenir 8 chiffres et commencer par 2, 5 ou 9
              </span>
            ) : null}
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              label='Âge'
              value={data?.age ?? ''}
              className={`${controls?.age === true || controls.ageValid === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                const value = e.target.value
                const isEmpty = value.trim() === ''
                const isInvalid = ageCheck(value.trim())

                setData((prev: any) => ({ ...prev, age: value }))
                setControls((prev: any) => ({
                  ...prev,
                  age: isEmpty,
                  ageValid: !isEmpty && !isInvalid
                }))
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '1rem'
                }
              }}
              InputProps={{
                sx: {
                  height: 60,
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    '& + .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }
                }
              }}
            />
            {controls?.age === true ? (
              <span className='errmsg'>Veuillez saisir l’age !</span>
            ) : controls.ageValid === true ? (
              <span className='errmsg'>Âge invalide : il doit être un nombre entre 18 et 60 ans</span>
            ) : null}
          </Grid>
          <Grid item xs={12} md={12}>
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
        </Grid>
      </form>
    </Modal>
  )
}
