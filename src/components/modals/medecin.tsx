'use client'
import { useEffect, useState } from 'react'

import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'

export default function MedecinModal({
  isOpen,
  onClose,
  medecinData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  medecinData?: any
  setUpdate: any
}) {
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)

  const tarifCheck = (tarif: any) => {
    const num = Number(tarif)

    return isNaN(num) || num <= 0
  }

  const addressCheck = (address: string) => !/^[\wÀ-ÿ0-9\s,.'\-]{5,100}$/.test(address.trim())

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    email: '',
    id_ville: 0,
    heurD: '',
    heurF: '',
    info: '',
    nom_ut: '',
    id_spe: 0,
    tarif: '',
    adresse: ''
  })

  const [controls, setControls] = useState<any>({
    nom_ut: false,
    email: false,
    emailValid: false,
    id_spe: false,
    tarif: false,
    tarifValid: false,
    id_ville: false,
    heurD: false,
    heurF: false,
    adresse: false,
    addressValid: false
  })

  const [villeListe, setVilleListe] = useState<any[]>([])
  const [speListe, setSpeListe] = useState<any[]>([])

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
        toast.error(responseData.message)
      } else {
        setVilleListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getVilleList()
  }, [])

  async function getSpeList() {
    try {
      const url = `${window.location.origin}/api/specialite/liste?getall`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        toast.error(responseData.message)
      } else {
        setSpeListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getSpeList()
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
    if (medecinData) {
      setData({
        ...medecinData,
        imageSrc: medecinData.image ? `${medecinData.image}` : '/img/placeholder-image.jpg',
        id_spe: medecinData.id_spe ?? '',
        id_ville: medecinData.id_ville ?? ''
      })
    } else {
      setData({
        imageSrc: '/img/placeholder-image.jpg',
        image: '',
        email: '',
        tarif: '',
        id_ville: 0,
        heurD: '',
        heurF: '',
        info: '',
        nom_ut: '',
        id_spe: 0,
        adresse: ''
      })
    }
  }, [medecinData])

  const clearForm = () => {
    setData({
      imageSrc: '/img/placeholder-image.jpg',
      image: '',
      email: '',
      tarif: '',
      id_ville: 0,
      heurD: '',
      heurF: '',
      info: '',
      nom_ut: '',
      id_spe: 0,
      adresse: ''
    })
    setControls({
      nom_ut: false,
      email: false,
      emailValid: false,
      id_spe: false,
      tarif: false,
      tarifValid: false,
      id_ville: false,
      heurD: false,
      heurF: false,
      adresse: false,
      addressValid: false
    })
  }

  const isAdd = !medecinData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/medecin/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        nom_ut: data.nom_ut.trim() === '',
        email: data.email.trim() === '',
        emailValid: mailCheck(data.email.trim()),
        id_spe: data.id_spe === 0,
        tarif: data.tarif.trim() === '',
        tarifValid: tarifCheck(data.tarif.trim()),
        id_ville: data.id_ville === 0,
        heurD: data.heurD.trim() === '',
        heurF: data.heurF.trim() === '',
        adresse: data.adresse.trim() === '',
        addressValid: addressCheck(data.adresse.trim())
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
        formData.append('currentImage', medecinData?.image || '')
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
            toast.success('Le médecin a été ajouté avec succès')
          } else {
            toast.success('Le médecin a été modifié avec succès')
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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter Médecin' : 'Modifier Médecin'}</span>}
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
              value={data?.email ?? ''}
              className={`${controls?.email === true || controls.emailValid === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                const value = e.target.value
                const isEmpty = value.trim() === ''
                const isInvalid = mailCheck(value.trim())

                setData((prev: any) => ({ ...prev, email: value }))
                setControls((prev: any) => ({
                  ...prev,
                  email: isEmpty,
                  emailValid: !isEmpty && isInvalid
                }))
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
              <InputLabel>Spéciallité</InputLabel>
              <Select
                label='Spéciallité'
                value={data?.id_spe || null}
                className={`${controls?.id_spe === true ? 'isReq' : ''}`}
                onChange={(e: any) => {
                  if (e === null) {
                    setControls({ ...controls, id_spe: true })
                    setData((prev: any) => ({
                      ...prev,
                      id_spe: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, id_spe: false })
                    setData((prev: any) => ({
                      ...prev,
                      id_spe: e.target.value
                    }))
                  }
                }}
              >
                {speListe.map(item => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.spe}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {controls?.id_spe === true ? <span className='errmsg'>Veuillez sélectionner la spéciallité !</span> : null}
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              label='Tarif'
              value={data?.tarif ?? ''}
              className={`${controls?.tarif === true || controls.tarifValid === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                const value = e.target.value
                const isEmpty = value.trim() === ''
                const isInvalid = tarifCheck(value.trim())

                setData((prev: any) => ({ ...prev, tarif: value }))
                setControls((prev: any) => ({
                  ...prev,
                  tarif: isEmpty,
                  tarifValid: isInvalid
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
            {controls?.tarif === true ? (
              <span className='errmsg'>Veuillez saisir le tarif !</span>
            ) : controls.tarifValid === true ? (
              <span className='errmsg'>Le tarif est invalide : il doit être un nombre.</span>
            ) : null}
          </Grid>
          <Grid item xs={6} md={6}>
            <FormControl fullWidth>
              <InputLabel>Ville</InputLabel>
              <Select
                label='Ville'
                className={`${controls?.id_ville === true ? 'isReq' : ''}`}
                value={data?.id_ville || null}
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
                {villeListe.map((item: any) => (
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
              type='time'
              className={`${controls?.heurD === true ? 'isReq' : ''}`}
              value={data?.heurD ?? ''}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, heurD: true })
                  setData((prev: any) => ({
                    ...prev,
                    heurD: e.target.value
                  }))
                } else {
                  setControls({ ...controls, heurD: false })
                  setData((prev: any) => ({
                    ...prev,
                    heurD: e.target.value
                  }))
                }
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
            {controls?.heurD === true ? (
              <span className='errmsg'>Veuillez sélectionner l’heure de début de travail !</span>
            ) : null}
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              type='time'
              className={`${controls?.heurF === true ? 'isReq' : ''}`}
              value={data?.heurF ?? ''}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, heurF: true })
                  setData((prev: any) => ({
                    ...prev,
                    heurF: e.target.value
                  }))
                } else {
                  setControls({ ...controls, heurF: false })
                  setData((prev: any) => ({
                    ...prev,
                    heurF: e.target.value
                  }))
                }
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
            {controls?.heurF === true ? (
              <span className='errmsg'>Veuillez sélectionner l’heure de fin de travail !</span>
            ) : null}
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Adresse'
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
              value={data?.adresse ?? ''}
              className={`${controls?.adresse === true || controls.addressValid === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                const value = e.target.value
                const isEmpty = value.trim() === ''
                const isInvalid = addressCheck(value.trim())

                setData((prev: any) => ({ ...prev, adresse: value }))
                setControls((prev: any) => ({
                  ...prev,
                  adresse: isEmpty,
                  addressValid: !isEmpty && isInvalid
                }))
              }}
            />
            {controls?.adresse === true ? (
              <span className='errmsg'>Veuillez saisir l’adresse !</span>
            ) : controls.addressValid === true ? (
              <span className='errmsg'>
                <span className='errmsg'>
                  Adresse invalide : elle doit contenir au moins 5 caractères et ne pas inclure de symboles spéciaux non
                  autorisés.
                </span>
              </span>
            ) : null}
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
              maxRows={2}
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
