'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
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
import { IconButton, Input, InputAdornment } from '@mui/material'

import { toast } from 'react-toastify'

import { getStorageData } from '@/utils/helpers'

const AccountDetails = () => {
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)

  const tarifCheck = (tarif: any) => {
    const num = Number(tarif)

    return isNaN(num) || num <= 0
  }

  const addressCheck = (address: string) => !/^[\wÀ-ÿ0-9\s,.'\-]{5,100}$/.test(address.trim())

  const passwordCheck = (password: any) =>
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/.test(password)

  const userData = getStorageData('user')

  console.log('userData:', userData)

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordShown2, setIsPasswordShown2] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowPassword2 = () => setIsPasswordShown2(show => !show)

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
    id_spe: 0,
    mode_pre: 0
  })

  const [controls, setControls] = useState<any>({
    adresse: false,
    addressValid: false,
    email: false,
    mdp: false,
    conMdp: false,
    mdpValid: false,
    conMdpValid: false,
    emailValid: false,
    nom_ut: false,
    mode_pre: false,
    spe: false,
    id_ville: false,
    id_spe: false,
    heurD: false,
    heurF: false,
    tarif: false,
    tarifValid: false
  })

  const [compte, setCompte] = useState<any[]>([])

  async function getCompte() {
    try {
      let url = ''

      if (userData?.role == 1) {
        url = `${window.location.origin}/api/admin/liste?id=${userData?.id}`
      } else if (userData?.role == 2) {
        url = `${window.location.origin}/api/medecin/liste?m.id=${userData?.id}`
      } else if (userData?.role == 3) {
        url = `${window.location.origin}/api/laboratoire/liste?id=${userData?.id}`
      }

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        toast.error('Erreur !')
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
        nom_ut: c.nom_ut,
        email: c.email,
        tarif: c.tarif,
        adresse: c.adresse,
        id_ville: c.id_ville,
        heurD: c.heurD,
        heurF: c.heurF,
        info: c.info,
        id_spe: c.id_spe,
        mdp: '', //c.mdp,
        conMdp: '', //: c.mdp,
        imageSrc: c.image ? `${window.location.origin}/${c.image}` : '/img/placeholder-image.jpg'
      }))
    }
  }, [compte])
  console.log('compte', compte)

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

  const handleSave = async () => {
    try {
      let url = ''

      if (userData?.role == 1) {
        url = `${window.location.origin}/api/admin/modifier?id=${userData?.id}`
      } else if (userData?.role == 2) {
        url = `${window.location.origin}/api/medecin/modifier?m.id=${userData?.id}`
      } else if (userData?.role == 3) {
        url = `${window.location.origin}/api/laboratoire/modifier?id=${userData?.id}`
      }

      const newControls = {
        email: data.email.trim() === '',
        emailValid: mailCheck(data.email.trim()),

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
        mismatch: data.mdp.trim() !== data.conMdp.trim(),
        ...(userData?.role === 2 && {
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
        ...(userData?.role === 3 && {
          nom_ut: data.nom_ut.trim() === '',
          mode_pre: data.mode_pre === 0,
          id_ville: data.id_ville === 0,
          adresse: data.adresse.trim() === '',
          addressCheck: addressCheck(data.adresse.trim()),
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
        toast.error('Erreur !')
      } else {
        toast.success('Le profil a été modifié avec succès')
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <Card className='w-full m-auto min-h-screen'>
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

            {userData?.role === 2 ? (
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
                {controls?.id_spe === true ? (
                  <span className='errmsg'>Veuillez sélectionner la spéciallité !</span>
                ) : null}
              </Grid>
            ) : null}
            {userData?.role === 2 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Tarif'
                  value={data?.tarif ?? ''}
                  className={`${controls?.tarif === true || controls.tarifValid === true ? 'isReq' : ''}`}
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
                />
                {controls?.tarif === true ? (
                  <span className='errmsg'>Veuillez saisir le tarif !</span>
                ) : controls.tarifValid === true ? (
                  <span className='errmsg'>Le tarif est invalide : il doit être un nombre.</span>
                ) : null}
              </Grid>
            ) : null}
            {userData?.role === 2 || userData?.role === 3 ? (
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
                    {villeListe.map(item => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.ville}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {controls?.id_ville === true ? <span className='errmsg'>Veuillez sélectionner la ville!</span> : null}
              </Grid>
            ) : null}
            {userData?.role === 2 || userData?.role === 3 ? (
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
            {userData?.role === 2 || userData?.role === 3 ? (
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
            {userData?.role === 2 || userData?.role === 3 ? (
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
                  const isEmpty = compte[0]?.id !== 0 ? false : value.trim() === ''
                  const isInvalid = passwordCheck(value.trim())

                  setData((prev: any) => ({ ...prev, mdp: value }))
                  setControls((prev: any) => ({
                    ...prev,
                    mdp: isEmpty,
                    mdpValid: compte[0]?.id !== 0 ? isInvalid : !isEmpty && isInvalid
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
            {userData?.role === 2 || userData?.role === 3 ? (
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
            ) : null}
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
