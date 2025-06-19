'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {
  IconButton,
  Input,
  InputAdornment,
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogActions
} from '@mui/material'

import { FaCheckCircle } from 'react-icons/fa'

import { getStorageData } from '@/utils/helpersFront'

const PatientProfil = () => {
  const router = useRouter()
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)
  const phoneCheck = (tel: any) => !/^[259]\d{7}$/.test(tel)

  const ageCheck = (age: any) => {
    const num = Number(age)

    return isNaN(num) || num <= 12
  }

  const [open, setOpen] = useState(false)

  const passwordCheck = (password: any) =>
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/.test(password)

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordShown2, setIsPasswordShown2] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowPassword2 = () => setIsPasswordShown2(show => !show)
  const userData = getStorageData('user')

  console.log('userData?:', userData)

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    nom: '',
    prenom: '',
    image: '',
    email: '',
    mdp: '',
    conMdp: '',
    age: '',
    tel: ''
  })

  const [controls, setControls] = useState<any>({
    prenom: false,
    nom_ut: false,
    email: false,
    mdp: false,
    conMdp: false,
    mdpValid: false,
    conMdpValid: false,
    emailValid: false,
    age: false,
    ageValid: false,
    tel: false,
    telValid: false
  })

  const [compte, setCompte] = useState<any[]>([])

  async function getCompte() {
    try {
      const url = `${window.location.origin}/api/patient/compte-patient?id=${userData?.id}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        console.error('Erreur !')
      } else {
        setCompte(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getCompte()
  }, [])
  useEffect(() => {
    if (compte.length > 0) {
      const c = compte[0]

      setData((prev: any) => ({
        id: c?.id,
        ...prev,
        nom: c.nom,
        prenom: c.prenom,
        email: c.email,
        id_ville: c.id_ville,
        age: c.age,
        tel: c.tel,
        mdp: '', //c.mdp,
        conMdp: '', //: c.mdp,
        imageSrc: c.image ? `${window.location.origin}/${c.image}` : '/img/placeholder-image.jpg'
      }))
    }
  }, [compte])

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

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/patient/modifier?id=${userData?.id}`

      const newControls = {
        email: data.email.trim() === '',
        emailValid: mailCheck(data.email.trim()),
        age: data.age.trim() === '',
        ageValid: ageCheck(data.age.trim()),
        nom: data.nom.trim() === '',
        tel: data.tel.trim() === '',
        telValid: phoneCheck(data.tel.trim()),
        prenom: data.prenom.trim() === '',
        id_ville: data.id_ville === 0,
        mdpValid:
          compte[0]?.id !== 0
            ? data.mdp.trim()?.length > 1 && passwordCheck(data.mdp.trim())
            : passwordCheck(data.mdp.trim()),
        conMdpValid:
          compte[0]?.id !== 0
            ? data.conMdp.trim()?.length > 1 && passwordCheck(data.conMdp.trim())
            : passwordCheck(data.conMdp.trim()),
        mdp: compte[0]?.id !== 0 ? data.mdp.trim()?.length > 1 && data.mdp.trim() === '' : data.mdp.trim() === '',
        conMdp:
          compte[0]?.id !== 0 ? data.conMdp.trim()?.length > 1 && data.conMdp.trim() === '' : data.conMdp.trim() === '',
        mismatch: data.mdp.trim() !== data.conMdp.trim()
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const formData = new FormData()

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
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
        console.log('Erreur !')
      } else {
        setOpen(true)
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <Card className='w-auto m-auto'>
      <CardContent className='mbe-5'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
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
                width={100}
                height={100}
              />
            </InputLabel>
          </div>
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                component='label'
                size='small'
                variant='contained'
                onClick={() => {
                  console.log('bonjour')

                  handleSave()
                }}
              >
                Enregistrer les modifications
              </Button>
              <Button size='small' variant='outlined' color='error'>
                Réinitialiser
              </Button>
            </div>
            <Typography>JPG, GIF ou PNG autorisés. Taille maximale de 800 Ko</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form noValidate autoComplete='off' className='w-full space-y-6'>
          <Grid container spacing={3}>
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

            <Grid item xs={6} md={6}>
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
                    ageValid: isInvalid
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
                <span className='errmsg'>Âge invalide : il doit être un nombre supérieur à 12 ans</span>
              ) : null}
            </Grid>
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
              ) : data.mdp !== data.conMdp && data.conMdp !== '' ? (
                <span className='errmsg'>Les mots de passe ne correspondent pas.</span>
              ) : null}
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={1}>
            <h1 className='block w-full text-center'>
              <FaCheckCircle className='text-green-500 text-6xl' />
            </h1>
          </Box>
        </DialogTitle>

        <DialogContent dividers className='mb-3 text-center'>
          <div className='text-center px-4 space-y-2'>
            <h3 className='text-lg font-semibold text-green-700'>
              Votre profil a été <strong>modifié avec succès</strong>
            </h3>
          </div>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button style={{ backgroundColor: 'white', color: 'black' }} size='small' onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default PatientProfil
