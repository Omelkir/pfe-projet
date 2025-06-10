'use client'

// React Imports
import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { FormControl, Input, InputLabel, MenuItem, Select, Grid } from '@mui/material'

import Logo from '@components/layout/shared/Logo'

const Register = () => {
  // States
  // Fonction de validation de l'email
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)

  const passwordCheck = (password: any) =>
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/.test(password)

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordShown2, setIsPasswordShown2] = useState(false)

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    email: '',
    mdp: '',
    conMdp: '',
    role: 0,
    tarif: '',
    id_ville: 0,
    heurD: '',
    heurF: '',
    info: '',
    nom_ut: '',
    nom: '',
    prenom: '',
    age: '',
    tel: '',
    id_spe: 0,
    ser: 0
  })

  const [villeListe, setVilleListe] = useState<any[]>([])
  const [speListe, setSpeListe] = useState<any[]>([])
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
        alert(responseData.message)
      } else {
        setSpeListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getSpeList()
  }, [])

  async function getSerList() {
    try {
      const url = `${window.location.origin}/api/service/liste`

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

      // Lire le fichier en Base64
      const reader = new FileReader()

      reader.readAsDataURL(file) // Convertir le fichier en Base64
    }
  }

  const [controls, setControls] = useState<any>({
    email: false,
    mdp: false,
    conMdp: false,
    emailValid: false,
    role: false,
    nom: false,
    prenom: false,
    nom_ut: false
  })

  const options = [
    { label: 'Patient', value: 4 },
    { label: 'Médecin', value: 2 },
    { label: 'Laboratoire', value: 3 }
  ]

  const clearForm = () => {
    setData({
      imageSrc: '/img/placeholder-image.jpg',
      image: '',
      email: '',
      mdp: '',
      conMdp: '',
      role: 0,
      tarif: '',
      id_ville: 0,
      heurD: '',
      heurF: '',
      info: '',
      nom_ut: '',
      nom: '',
      prenom: '',
      age: '',
      tel: '',
      id_spe: 0,
      ser: 0
    })
    setControls({
      email: false,
      mdp: false,
      conMdp: false,
      role: false,
      nom_ut: false,
      nom: false,
      prenom: false
    })
  }

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/register/ajouter`

      const newControls = {
        email: data.email.trim() === '',
        emailValid: mailCheck(data.email.trim()),
        mdpValid: passwordCheck(data.mdp.trim()),
        conMdpValid: passwordCheck(data.conMdp.trim()),
        mdp: data.mdp.trim() === '',
        conMdp: data.conMdp.trim() === '',

        role: data.role === 0,
        ...(data.role === 4 && {
          nom: data.nom.trim() === '',
          prenom: data.prenom.trim() === ''
        }),
        ...((data.role === 2 || data.role === 3) && {
          nom_ut: data.nom_ut.trim() === ''
        })
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const formData = new FormData()

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          console.log(key)

          if (data[key] instanceof File) {
            formData.append(key, data[key])
          } else {
            formData.append(key, data[key])
          }
        }
      }

      const requestOptions = {
        method: 'POST',
        body: formData
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setData(responseData)

        clearForm()
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  const router = useRouter()
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowPassword2 = () => setIsPasswordShown2(show => !show)

  return (
    <div className='flex flex-col w-full md:w-full lg:flex-row min-h-screen items-center justify-center relative h-screen bg-white'>
      <div className='hidden lg:flex flex-1 justify-center items-center min-h-screen bg-gray-100'>
        <span className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </span>

        <img src='/images/pages/doc1.svg' className='max-w-[800px] w-full' />
      </div>

      {/* Formulaire */}
      <div className='flex flex-col justify-center items-center w-full max-w-xl p-12 min-h-screen space-y-6'>
        <div className='mb-3'>
          <h3 className='text-2xl font-bold md:text-3xl'>S’inscrire </h3>
        </div>
        <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
          <Grid container spacing={3}>
            <Grid item xs={10} md={10}>
              {' '}
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  label='Type'
                  className={`h-12 md:h-[60px] ${controls?.role === true ? 'isReq' : ''}`}
                  value={data?.role || null}
                  onChange={(e: any) => {
                    if (e === null) {
                      setControls({ ...controls, role: true })
                      setData((prev: any) => ({
                        ...prev,
                        role: e.target.value
                      }))
                    } else {
                      setControls({ ...controls, role: false })
                      setData((prev: any) => ({
                        ...prev,
                        role: e.target.value
                      }))
                    }
                  }}
                >
                  {options.map(item => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {controls?.role === true ? <span className='errmsg'>Veuillez saisir le type !</span> : null}
            </Grid>
            <Grid item xs={2} md={2}>
              <Input
                type='file'
                id='image'
                onChange={(e: any) => {
                  setData((prev: any) => ({
                    ...prev,
                    image: e.target.files[0] // Corrected here
                  }))

                  handleImageChange(e)
                }}
                style={{ zoom: 0.8, display: 'none' }}
              />
              <InputLabel htmlFor='image'>
                <img
                  src={data.imageSrc}
                  style={{ cursor: 'pointer' }}
                  alt=''
                  className='w-[40.5px] h-[40.5px] md:w-[60px] md:h-[60px]'
                  width={60}
                  height={60}
                />
              </InputLabel>
            </Grid>
            {data?.role === 2 || data?.role === 3 ? (
              <Grid
                item
                xs={data.role == 2 || data.role === 3 ? 6 : 12}
                md={data.role == 2 || data.role === 3 ? 6 : 12}
              >
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
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
                      '&.Mui-focused': {
                        '& + .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }
                    }
                  }}
                />
                {controls?.nom_ut === true ? (
                  <span className='errmsg'>Veuillez saisir le nom d’utilisateur !</span>
                ) : null}
              </Grid>
            ) : null}
            {data?.role === 4 ? (
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
                  autoFocus
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
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
            ) : null}
            {data?.role === 4 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Prénom'
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
                  autoFocus
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
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
            ) : null}
            {data?.role === 4 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Âge'
                  value={data?.age ?? ''}
                  className={`${controls?.age === true ? 'isReq' : ''}`}
                  onChange={(e: any) => {
                    if (e.target?.value.trim() === '') {
                      setControls({ ...controls, age: true })
                      setData((prev: any) => ({
                        ...prev,
                        age: e.target.value
                      }))
                    } else {
                      setControls({ ...controls, age: false })
                      setData((prev: any) => ({
                        ...prev,
                        age: e.target.value
                      }))
                    }
                  }}
                  autoFocus
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
                      '&.Mui-focused': {
                        '& + .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }
                    }
                  }}
                />
                {controls?.age === true ? <span className='errmsg'>Veuillez saisir l’age !</span> : null}
              </Grid>
            ) : null}
            {data?.role === 4 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Numéro de téléphone'
                  value={data?.tel ?? ''}
                  className={`${controls?.tel === true ? 'isReq' : ''}`}
                  onChange={(e: any) => {
                    if (e.target?.value.trim() === '') {
                      setControls({ ...controls, tel: true })
                      setData((prev: any) => ({
                        ...prev,
                        tel: e.target.value
                      }))
                    } else {
                      setControls({ ...controls, tel: false })
                      setData((prev: any) => ({
                        ...prev,
                        tel: e.target.value
                      }))
                    }
                  }}
                  autoFocus
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
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
                ) : null}
              </Grid>
            ) : null}
            <Grid
              item
              xs={data.role == 2 || data.role === 3 || data.role === 4 ? 6 : 12}
              md={data.role == 2 || data.role === 3 || data.role === 4 ? 6 : 12}
            >
              <TextField
                fullWidth
                label='Email'
                InputLabelProps={{
                  sx: {
                    fontSize: '0.875rem', // mobile: 12px
                    '@media (min-width:768px)': {
                      fontSize: '1rem' // md+: 16px
                    }
                  }
                }}
                InputProps={{
                  sx: {
                    height: 48, // mobile default
                    fontSize: '0.875rem', // 14px
                    '@media (min-width:768px)': {
                      height: 60, // md and up
                      fontSize: '1rem' // 16px
                    },
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
            {data?.role === 2 ? (
              <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Spéciallité</InputLabel>
                  <Select
                    label='Spéciallité'
                    className='h-12 md:h-[60px]'
                    value={data?.id_spe || null}
                    onChange={(e: any) => {
                      if (e === null) {
                        setData({ ...data, iid_spe: e.target.value })
                      } else {
                        setData({ ...data, id_spe: e.target.value })
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
              </Grid>
            ) : null}
            {data?.role === 2 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Tarif'
                  value={data?.tarif ?? ''}
                  onChange={(e: any) => {
                    setData((prev: any) => ({
                      ...prev,
                      tarif: e.target.value
                    }))
                  }}
                  autoFocus
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
                      '&.Mui-focused': {
                        '& + .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }
                    }
                  }}
                />
              </Grid>
            ) : null}
            {data?.role === 3 ? (
              <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Service</InputLabel>
                  <Select
                    label='Service'
                    className='h-12 md:h-[60px]'
                    value={data?.ser || null}
                    onChange={(e: any) => {
                      if (e === null) {
                        setData({ ...data, ser: e.target.value })
                      } else {
                        setData({ ...data, ser: e.target.value })
                      }
                    }}
                  >
                    {serListe.map((item: any) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.ser}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}

            <Grid item xs={data.role == 3 || data.role == 4 ? 6 : 12} md={data.role == 3 || data.role == 4 ? 6 : 12}>
              <FormControl fullWidth>
                <InputLabel>Ville</InputLabel>
                <Select
                  label='Ville'
                  className='h-12 md:h-[60px]'
                  value={data?.id_ville || null}
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

            {data?.role === 2 || data?.role === 3 ? (
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
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
                      '&.Mui-focused': {
                        '& + .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }
                    }
                  }}
                />
              </Grid>
            ) : null}
            {data?.role === 2 || data?.role === 3 ? (
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
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 48, // mobile default
                      fontSize: '0.875rem', // 14px
                      '@media (min-width:768px)': {
                        height: 60, // md and up
                        fontSize: '1rem' // 16px
                      },
                      '&.Mui-focused': {
                        '& + .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }
                    }
                  }}
                />
              </Grid>
            ) : null}

            <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                value={data?.mdp ?? ''}
                label='Mot de passe'
                type={isPasswordShown ? 'text' : 'password'}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.875rem', // mobile: 12px
                    '@media (min-width:768px)': {
                      fontSize: '1rem' // md+: 16px
                    }
                  }
                }}
                className={`${controls?.mdp === true ? 'isReq' : ''}`}
                InputProps={{
                  sx: {
                    height: 48,
                    fontSize: '0.875rem',
                    '@media (min-width:768px)': {
                      height: 60,
                      fontSize: '1rem'
                    },
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
                        <i
                          className={
                            isPasswordShown ? 'ri-eye-off-line text-xl md:text-2xl' : 'ri-eye-line text-xl md:text-2xl'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={(e: any) => {
                  if (e.target?.value.trim() === '') {
                    setControls({ ...controls, mdp: true })
                    setData((prev: any) => ({
                      ...prev,
                      mdp: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, mdp: false })
                    setControls({ ...controls, mdpValid: passwordCheck(e.target.value.trim()) })
                    setData((prev: any) => ({
                      ...prev,
                      mdp: e.target.value
                    }))
                  }
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
            <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                value={data?.conMdp ?? ''}
                label='Confirmation'
                type={isPasswordShown2 ? 'text' : 'password'}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.875rem', // mobile: 12px
                    '@media (min-width:768px)': {
                      fontSize: '1rem' // md+: 16px
                    }
                  }
                }}
                className={`${controls?.conMdp === true ? 'isReq' : ''}`}
                InputProps={{
                  sx: {
                    height: 48, // mobile default
                    fontSize: '0.875rem', // 14px
                    '@media (min-width:768px)': {
                      height: 60, // md and up
                      fontSize: '1rem' // 16px
                    },
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
                        <i
                          className={
                            isPasswordShown ? 'ri-eye-off-line text-xl md:text-2xl' : 'ri-eye-line text-xl md:text-2xl'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={(e: any) => {
                  if (e.target?.value.trim() === '') {
                    setControls({ ...controls, conMdp: true })
                    setData((prev: any) => ({
                      ...prev,
                      conMdp: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, conMdp: false })
                    setControls({ ...controls, conMdpValid: passwordCheck(e.target.value.trim()) })
                    setData((prev: any) => ({
                      ...prev,
                      conMdp: e.target.value
                    }))
                  }
                }}
              />
              {controls?.conMdp === true ? (
                <span className='errmsg'>Confirmez le mot de passe !</span>
              ) : controls.conMdpValid === true ? (
                <span className='errmsg'>
                  Mot de passe invalide : il doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                  chiffre et un caractère spécial (ex: @, $, !).
                </span>
              ) : null}
            </Grid>
            {data?.role === 2 || data?.role === 3 ? (
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
                    sx: {
                      fontSize: '0.875rem', // mobile: 12px
                      '@media (min-width:768px)': {
                        fontSize: '1rem' // md+: 16px
                      }
                    }
                  }}
                />
              </Grid>
            ) : null}
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
            S’inscrire
          </Button>
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography>Vous avez déjà un compte ?</Typography>
            <Typography component={Link} href='/login' color='primary'>
              Connectez-vous à la place
            </Typography>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
