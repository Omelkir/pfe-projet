'use client'
import React, { useEffect, useState } from 'react'

import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { Mail, MapPin } from 'lucide-react'
import { FaCheckCircle, FaMap, FaMoneyBillAlt, FaRegClock } from 'react-icons/fa'

import Pagination from '@/components/ui/pagination'
import { SimpleSlideshow } from '@/components/auto-images/images'
import { StarRating } from '@/components/ui/star-rating'
import { getStorageData } from '@/utils/helpersFront'
import RendezVousModal from '@/components/modals/rendezVousFormModal'

const Medecin = () => {
  const userData = getStorageData('user')
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [update] = useState<string>(new Date().toDateString())

  const onPagination = (e: any) => {
    getMedecinList(e)
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

      if (responseData.erreur) {
        console.log(responseData.message)
      } else {
        setVilleListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      console.log('Une erreur est survenue lors de la récupération des données.')
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

      if (responseData.erreur) {
        console.log(responseData.message)
      } else {
        setSpeListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      console.log('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getSpeList()
  }, [])

  const images = [{ src: '/img/banner_doctors_img/banner8.jpg', alt: 'Sunset over mountains' }]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedecinId, setSelectedMedecinId] = useState<any>(null)
  const [data, setData] = useState<any>({ nom_ut: '', id_spe: '', id_ville: '' })
  const [medecins, setMedecins] = useState<any[]>([])

  async function getMedecinList(page = 1) {
    try {
      const url = `${window.location.origin}/api/liste-med-spe/liste?nom_ut=${data.nom_ut}&id_spe=${data.id_spe}&id_ville=${data.id_ville}&page=${page}`

      const requestOptions = { method: 'GET' }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        console.log(responseData.message)
      } else {
        setMedecins(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (err) {
      console.error('Erreur dans API:', err)

      return { erreur: true, message: 'Erreur interne' }
    }
  }

  useEffect(() => {
    getMedecinList()
  }, [update])

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  const handleRating = () => {
    setIsRatingModalOpen(true)

    const timer = setTimeout(() => {
      setIsRatingModalOpen(false)
    }, 4000)

    return () => clearTimeout(timer)
  }

  async function upValue(e: any, id: any, user: any) {
    try {
      const url = `${window.location.origin}/api/score/ajouter`
      const requestBody = JSON.stringify({ pr: e * 20, id_el: id, el: 2, user })

      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      await fetch(url, requestOptions)
    } catch (error) {}
  }

  return (
    <div className='bg-white pl-3 pr-3'>
      <SimpleSlideshow interval={5000} images={images} />
      <div className='pt-6'>
        <h1 className='text-center text-4xl font-semibold mb-12 items-center separator'>Médecins</h1>
      </div>

      <div className='flex justify-center gap-6'>
        <TextField
          className='w-1/5'
          placeholder='Nom'
          autoFocus
          value={data?.nom_ut || ''}
          onChange={e => setData((prev: any) => ({ ...prev, nom_ut: e.target.value }))}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='ri-user-3-line' />
              </InputAdornment>
            )
          }}
        />

        <FormControl className='w-1/5'>
          <InputLabel>Spécialité</InputLabel>
          <Select
            label='Spécialité'
            value={data?.id_spe || ''}
            onChange={e => setData((prev: any) => ({ ...prev, id_spe: Number(e.target.value) }))}
          >
            {speListe.map((item: any) => (
              <MenuItem value={item.id} key={item.id}>
                {item.spe}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className='w-1/5'>
          <InputLabel>Ville</InputLabel>
          <Select
            label='Ville'
            value={data?.id_ville || ''}
            onChange={e => setData((prev: any) => ({ ...prev, id_ville: Number(e.target.value) }))}
          >
            {villeListe.map((item: any) => (
              <MenuItem value={item.id} key={item.id}>
                {item.ville}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant='contained'
          onClick={() => {
            getMedecinList()
          }}
        >
          Rechercher
        </Button>
      </div>

      <Grid container spacing={6} className='py-12 px-6'>
        {medecins?.length > 0
          ? medecins.map((medecin, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className='shadow-lg rounded-2xl border border-gray-200 bg-white h-[370px]'>
                  <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center space-x-4'>
                      <img
                        className='w-20 h-20 rounded-full object-cover border-2 border-blue-500'
                        src={medecin.image ? medecin.image : '/img/placeholder-image.jpg'}
                        alt={medecin.nom_ut}
                      />
                      <div>
                        <h2 className='text-lg font-semibold text-gray-800'>{medecin.nom_ut}</h2>
                        <p className='text-sm text-gray-500'>
                          <span className={medecin.spe?.trim() ? '' : 'text-red-500'}>
                            {medecin.spe?.trim() ? medecin.spe?.trim() : 'Spécialité non définie'}
                          </span>
                        </p>
                        <div className='mt-2'>
                          <StarRating size='sm' initialRating={medecin?.sc ?? 0} readOnly />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={() => {
                          setSelectedMedecinId(medecin.id)
                          console.log('medecin:', medecin.id)

                          setIsModalOpen(true)
                        }}
                      >
                        Rendez-vous
                      </Button>
                    </div>
                  </div>
                  <hr className='my-4 border-t border-gray-300' />
                  <CardContent>
                    <p className='mb-4'>{medecin.info}</p>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <FaMap className='w-4 h-4 mr-2 text-blue-500' />

                      <span className={medecin.ville?.trim() ? '' : 'text-red-500'}>
                        {medecin.ville?.trim() ? medecin.ville?.trim() : 'Ville non définie'}
                      </span>

                      <Mail className='w-4 h-4 mr-2 text-blue-500 ml-12' />

                      <span className={medecin.email?.trim() ? '' : 'text-red-500'}>
                        {medecin.email?.trim() ? medecin.email?.trim() : 'Email non définie'}
                      </span>
                    </div>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <FaRegClock className='w-4 h-4 mr-2 text-blue-500' />

                      <span className={medecin.heurD && medecin.heurF ? '' : 'text-red-500'}>
                        {medecin.heurD && medecin.heurF
                          ? `${medecin.heurD.slice(0, 5)} - ${medecin.heurF.slice(0, 5)}`
                          : 'Horaires non définis'}
                      </span>

                      <FaMoneyBillAlt className='w-4 h-4 mr-2 text-blue-500 ml-12' />
                      <span className={medecin.tarif ? '' : 'text-red-500'}>
                        {medecin.tarif ? medecin.tarif : 'Tarif non défini'}
                      </span>
                    </div>
                    <div className='flex text-gray-600 text-sm mt-4'>
                      <MapPin className='w-5 h-5 mr-2 text-blue-500' />
                      <span className={medecin.adresse?.trim() ? '' : 'text-red-500'}>
                        {medecin.adresse?.trim() ? medecin.adresse?.trim() : 'Adresse non définie'}
                      </span>
                    </div>
                    <div className='flex justify-end mt-4'>
                      <StarRating
                        size='sm'
                        readOnly={!userData?.id}
                        onChange={async (e: any) => {
                          await upValue(e, medecin.id, userData.id)
                          handleRating()
                        }}
                      />
                    </div>
                    {isRatingModalOpen && (
                      <div className='fixed inset-0 z-50 flex items-center justify-center'>
                        <div className='absolute inset-0 bg-black/10 backdrop-blur-sm' />
                        <div className='relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md z-10 text-center'>
                          <FaCheckCircle className='text-green-500 text-6xl mb-4 mx-auto' />
                          <h3 className='text-xl font-semibold text-green-700 mb-2'>Merci pour votre avis !</h3>
                          <p className='text-gray-600'>Votre évaluation a été prise en compte avec succès.</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          : null}

        <RendezVousModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          medecinId={selectedMedecinId}
          laboId={null}
        />
      </Grid>
      <Grid item xs={12} className='mt-6 justify-items-end'>
        <Pagination
          total={paginatorInfo.total}
          current={paginatorInfo.currentPage}
          pageSize={paginatorInfo.perPage}
          onChange={onPagination}
        />
      </Grid>
    </div>
  )
}

export default Medecin
