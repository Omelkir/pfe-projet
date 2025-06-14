'use client'

// React Imports
import { useEffect, useState } from 'react'

import Link from 'next/link'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { FormControl, Input, InputLabel, MenuItem, Select, Grid } from '@mui/material'

import Logo from '@components/layout/shared/Logo'
import SuccesModal from '@/components/modals/succes'

const Register = () => {
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)
  const phoneCheck = (tel: any) => !/^[259]\d{7}$/.test(tel)

  const ageCheck = (age: any) => {
    const num = Number(age)

    return !isNaN(num) && num >= 18 && num <= 60
  }

  const tarifCheck = (tarif: any) => {
    const num = Number(tarif)

    return !isNaN(tarif)
  }

  const addressCheck = (address: string) => /^[\wÀ-ÿ0-9\s,.'\-]{5,100}$/.test(address.trim())

  const passwordCheck = (password: any) =>
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/.test(password)

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordShown2, setIsPasswordShown2] = useState(false)

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    adresse: '',
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
    mode_pre: 0
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

  const [controls, setControls] = useState<any>({
    adresse: false,
    email: false,
    mdp: false,
    conMdp: false,
    emailValid: false,
    tel: false,
    telValid: false,
    role: false,
    nom: false,
    prenom: false,
    nom_ut: false,
    mode_pre: false,
    spe: false,
    id_ville: false,
    age: false,
    ageValid: false,
    id_spe: false,
    heurD: false,
    heurF: false,
    tarif: false,
    tarifValid: false
  })

  const options = [
    { label: 'Patient', value: 4 },
    { label: 'Médecin', value: 2 },
    { label: 'Laboratoire', value: 3 }
  ]

  const [openSuccessModal, setOpenSuccessModal] = useState(false)

  const clearForm = () => {
    setData({
      imageSrc: '/img/placeholder-image.jpg',
      adresse: '',
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
      mode_pre: 0
    })
    setControls({
      adresse: false,
      email: false,
      mdp: false,
      conMdp: false,
      emailValid: false,
      tel: false,
      telValid: false,
      role: false,
      nom: false,
      prenom: false,
      nom_ut: false,
      mode_pre: false,
      spe: false,
      id_ville: false,
      age: false,
      ageValid: false,
      id_spe: false,
      heurD: false,
      heurF: false,
      tarif: false,
      tarifValid: false
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
          age: data.age.trim() === '',
          ageValid: ageCheck(data.age.trim()),
          nom: data.nom.trim() === '',
          tel: data.tel.trim() === '',
          telValid: phoneCheck(data.tel.trim()),
          prenom: data.prenom.trim() === '',
          id_ville: data.id_ville === 0
        }),
        ...(data.role === 2 && {
          nom_ut: data.nom_ut.trim() === '',
          id_spe: data.id_spe === 0,
          id_ville: data.id_ville === 0,
          adresse: data.adresse.trim() === '',
          addressValid: addressCheck(data.adresse.trim()),
          heurD: data.heurD.trim() === '',
          heurF: data.heurF.trim() === '',
          tarif: data.tarif.trim() === '',
          tarifValid: tarifCheck(data.tarif.trim())
        }),
        ...(data.role === 3 && {
          nom_ut: data.nom_ut.trim() === '',
          mode_pre: data.mode_pre === 0,
          id_ville: data.id_ville === 0,
          adresse: data.adresse.trim() === '',
          addressCheck: phoneCheck(data.adresse.trim()),
          heurD: data.heurD.trim() === '',
          heurF: data.heurF.trim() === ''
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
        setOpenSuccessModal(true)
        clearForm()
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  const prelevListe = [
    { label: 'Prélèvement à domicile', value: 1 },
    { label: 'Prélèvement sur place au laboratoire', value: 2 },
    { label: 'Prélèvement sur place au laboratoire et à domicile', value: 3 }
  ]

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowPassword2 = () => setIsPasswordShown2(show => !show)

  return (
    <div className='flex flex-col w-full md:w-full lg:flex-row items-start justify-start min-h-screen bg-white'>
      <div className='hidden lg:flex flex-1 justify-center items-center  h-auto bg-gray-100'>
        <span className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </span>

        <img src='/images/pages/doc1.svg' className='max-w-[800px] w-full' />
      </div>

      <div className='flex flex-col justify-center items-center w-full max-w-xl px-12  h-auto space-y-6'>
        <div className='mb-3 mt-8'>
          <h3 className='text-2xl font-bold md:text-3xl'>S’inscrire </h3>
        </div>
        <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
          <Grid container spacing={3}>
            <Grid item xs={10} md={10}>
              {' '}
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label='Role'
                  className={`${controls?.role === true ? 'isReq' : ''}`}
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
                  className='w-[60px] h-[60px]'
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
                  InputLabelProps={{
                    sx: {
                      fontSize: '1rem'
                    }
                  }}
                  InputProps={{
                    sx: {
                      height: 60, // md and up
                      fontSize: '1rem', // 16px
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
                {controls?.prenom === true ? <span className='errmsg'>Veuillez saisir le prenom !</span> : null}
              </Grid>
            ) : null}
            {data?.role === 4 ? (
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
            ) : null}
            {data?.role === 4 ? (
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
            {data?.role === 2 ? (
              <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Spéciallité</InputLabel>
                  <Select
                    label='Spéciallité'
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
                {controls?.id_spe === true ? (
                  <span className='errmsg'>Veuillez sélectionner la spéciallité !</span>
                ) : null}
              </Grid>
            ) : null}
            {data?.role === 2 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Tarif'
                  value={data?.tarif ?? ''}
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
                  className={`${controls?.tarif === true || controls.tarifValid === true ? 'isReq' : ''}`}
                  onChange={(e: any) => {
                    const value = e.target.value
                    const isEmpty = value.trim() === ''
                    const isInvalid = tarifCheck(value.trim())

                    setData((prev: any) => ({ ...prev, tarif: value }))
                    setControls((prev: any) => ({
                      ...prev,
                      tarif: isEmpty,
                      tarifValid: !isEmpty && !isInvalid
                    }))
                  }}
                />
                {controls?.tarif === true ? (
                  <span className='errmsg'>Veuillez saisir le tarif !</span>
                ) : controls.tarifValid === true ? (
                  <span className='errmsg'>Le tarif est invalide : il doit être un nombre.</span>
                ) : null}
              </Grid>
            ) : null}
            <Grid
              item
              xs={data.role == 2 || data.role == 3 || data.role == 4 ? 6 : 12}
              md={data.role == 2 || data.role == 3 || data.role == 4 ? 6 : 12}
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
            {data?.role === 3 ? (
              <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Mode de prélèvement</InputLabel>
                  <Select
                    label='Mode de prélèvement'
                    className={`${controls?.mode_pre === true ? 'isReq' : ''}`}
                    value={data?.mode_pre || null}
                    onChange={(e: any) => {
                      if (e === null) {
                        setControls({ ...controls, mode_pre: true })
                        setData((prev: any) => ({
                          ...prev,
                          mode_pre: e.target.value
                        }))
                      } else {
                        setControls({ ...controls, mode_pre: false })
                        setData((prev: any) => ({
                          ...prev,
                          mode_pre: e.target.value
                        }))
                      }
                    }}
                  >
                    {prelevListe.map((item: any) => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {controls?.mode_pre === true ? (
                  <span className='errmsg'>Veuillez sélectionner le mode de prélèvement!</span>
                ) : null}
              </Grid>
            ) : null}
            {data?.role === 2 || data?.role === 3 ? (
              <Grid item xs={data.role == 2 ? 6 : 12} md={data.role == 2 ? 6 : 12}>
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
                      Adresse invalide : elle doit contenir au moins 5 caractères et ne pas inclure de symboles spéciaux
                      non autorisés.
                    </span>
                  </span>
                ) : null}
              </Grid>
            ) : null}

            {data?.role === 2 || data?.role === 3 ? (
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
            ) : null}
            {data?.role === 2 || data?.role === 3 ? (
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
            ) : null}

            <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                value={data?.mdp ?? ''}
                label='Mot de passe'
                type={isPasswordShown ? 'text' : 'password'}
                InputLabelProps={{
                  sx: {
                    fontSize: '1rem'
                  }
                }}
                className={`${controls?.mdp === true || controls.mdpValid === true ? 'isReq' : ''}`}
                InputProps={{
                  sx: {
                    height: 60,
                    fontSize: '1rem',
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
                        <i className={isPasswordShown ? 'ri-eye-off-line text-2xl' : 'ri-eye-line text-2xl'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={(e: any) => {
                  const value = e.target.value
                  const isEmpty = value.trim() === ''
                  const isInvalid = passwordCheck(value.trim())

                  setData((prev: any) => ({ ...prev, mdp: value }))
                  setControls((prev: any) => ({
                    ...prev,
                    mdp: isEmpty,
                    mdpValid: !isEmpty && isInvalid
                  }))
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
                    fontSize: '1rem'
                  }
                }}
                className={`${controls?.conMdp === true || controls.conMdpValid === true ? 'isReq' : ''}`}
                InputProps={{
                  sx: {
                    height: 60,
                    fontSize: '1rem',
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
                        onClick={handleClickShowPassword2}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown2 ? 'ri-eye-off-line text-2xl' : 'ri-eye-line text-2xl'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={(e: any) => {
                  const value = e.target.value
                  const isEmpty = value.trim() === ''
                  const isInvalid = passwordCheck(value.trim())

                  setData((prev: any) => ({ ...prev, conMdp: value }))
                  setControls((prev: any) => ({
                    ...prev,
                    conMdp: isEmpty,
                    conMdpValid: !isEmpty && isInvalid
                  }))
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
      <SuccesModal isOpen={openSuccessModal} onClose={() => setOpenSuccessModal(false)} />
    </div>
  )
}

export default Register
