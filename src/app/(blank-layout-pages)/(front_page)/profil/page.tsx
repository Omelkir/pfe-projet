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
import { Input } from '@mui/material'

import { getStorageData } from '@/utils/helpersFront'

const PatientProfil = () => {
  const router = useRouter()
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)

  // const passwordCheck = (password: any) =>
  //   !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/.test(password)

  // const [isPasswordShown, setIsPasswordShown] = useState(false)
  // const [isPasswordShown2, setIsPasswordShown2] = useState(false)
  // const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // const handleClickShowPassword2 = () => setIsPasswordShown2(show => !show)
  const userData = getStorageData('user')

  console.log('userData?:', userData)

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    email: '',

    // mdp: '',
    // conMdp: '',
    nom: '',
    prenom: '',
    id_ville: '',
    tel: '',
    age: ''
  })

  useEffect(() => {
    if (userData) {
      setData((prev: any) => ({
        ...prev,
        id: userData?.id,
        nom: userData?.nom,
        prenom: userData?.prenom,
        email: userData?.email,

        // mdp: userData?.mdp,
        tel: userData?.tel,
        id_ville: userData?.id_ville,
        age: userData?.age,
        imageSrc: userData?.image ? `${window.location.origin}/${userData?.image}` : '/img/placeholder-image.jpg'
      }))
    } else {
      router.push('/loginFront')
    }
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
    email: false,
    emailValid: false,
    mdp: false,
    conMdp: false,

    // mdpValid: false,
    // conMdpValid: false,
    nom: false,
    prenom: false
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

  const handleSave = async () => {
    // try {
    const url = `${window.location.origin}/api/patient/modifier`

    const newControls = {
      email: data.email.trim() === '',

      // mdp: data.mdp.trim() === '',
      emailValid: mailCheck(data.email.trim()),

      // mdpValid: passwordCheck(data.mdp.trim()),
      // conMdpValid: passwordCheck(data.conMdp.trim()),
      nom: data.nom.trim() === '',
      prenom: data.prenom.trim() === ''
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
      console.log('Le profil a été modifié avec succès')
    }

    // } catch (error) {
    //   console.log('Erreur:', error)
    // }
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
              {controls?.prenom === true ? <span className='errmsg'>Veuillez saisir le prénom !</span> : null}
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
            {/* <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                value={data?.mdp ?? ''}
                label='Mot de passe'
                type={isPasswordShown ? 'text' : 'password'}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.875rem',
                    '@media (min-width:768px)': {
                      fontSize: '1rem'
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
                    fontSize: '0.875rem',
                    '@media (min-width:768px)': {
                      fontSize: '1rem'
                    }
                  }
                }}
                className={`${controls?.conMdp === true ? 'isReq' : ''}`}
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
                        onClick={handleClickShowPassword2}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i
                          className={
                            isPasswordShown2 ? 'ri-eye-off-line text-xl md:text-2xl' : 'ri-eye-line text-xl md:text-2xl'
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
            </Grid> */}
            <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                label='Numéro téléphone'
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
              {controls?.tel === true ? <span className='errmsg'>Veuillez saisir le numéro de téléphone !</span> : null}
            </Grid>
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
              {controls?.age === true ? <span className='errmsg'>Veuillez saisir l’age !</span> : null}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default PatientProfil
