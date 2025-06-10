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
import { FaMap, FaRegClock } from 'react-icons/fa'

import Pagination from '@/components/ui/pagination'
import { SimpleSlideshow } from '@/components/auto-images/images'
import { StarRating } from '@/components/ui/star-rating'
import { getStorageData } from '@/utils/helpersFront'
import RendezVousModal from '@/components/modals/rendezVousFormModal'

const Laboratoire = () => {
  const userData = getStorageData('user')
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [update] = useState<string>(new Date().toDateString())

  const onPagination = (e: any) => {
    getLaboratoireList(e)
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

  const images = [
    {
      src: 'https://img.freepik.com/premium-photo/low-angle-view-cross-against-clear-blue-sky_1048944-10728740.jpg?w=1380',
      alt: 'banner1'
    }
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLaboId, setSelectedLaboId] = useState<any>(null)
  const [data, setData] = useState<any>({ nom_ut: '', mode_pre: '', id_ville: '' })
  const [laboratoires, setLaboratoires] = useState<any[]>([])

  async function getLaboratoireList(page = 1) {
    try {
      const url = `${window.location.origin}/api/liste-labo-ser/liste?nom_ut=${data.nom_ut}&mode_pre=${data.mode_pre}&id_ville=${data.id_ville}&page=${page}`

      const requestOptions = { method: 'GET' }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        console.log(responseData.message)
      } else {
        setLaboratoires(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  useEffect(() => {
    getLaboratoireList()
  }, [update])

  async function upValue(e: any, id: any, user: any) {
    try {
      const url = `${window.location.origin}/api/score/ajouter`
      const requestBody = JSON.stringify({ pr: e * 20, id_el: id, el: 3, user })

      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      await fetch(url, requestOptions)
    } catch (error) {}
  }

  console.log(laboratoires)

  const options = [
    { label: 'Prélèvement à domicile', value: 0 },
    { label: 'Prélèvement sur place au laboratoire', value: 1 },
    { label: 'Prélèvement sur place au laboratoire et à domicile', value: 2 }
  ]

  return (
    <div className='bg-white pl-3 pr-3'>
      <SimpleSlideshow interval={5000} images={images} />
      <div className='pt-6'>
        <h1 className='text-center text-4xl font-semibold mb-12 items-center separator'>Laboratoires</h1>
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
          <InputLabel>Mode de prélèvement</InputLabel>
          <Select
            label='Mode de prélèvement'
            value={data?.mode_pre ?? ''}
            onChange={e => setData((prev: any) => ({ ...prev, mode_pre: Number(e.target.value) }))}
          >
            {options.map((item: any) => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className='w-1/5'>
          <InputLabel>Ville</InputLabel>
          <Select
            label='Ville'
            value={data?.id_ville ?? ''}
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
            getLaboratoireList()
          }}
        >
          Rechercher
        </Button>
      </div>

      <Grid container spacing={6} className='py-12 px-6'>
        {laboratoires?.length > 0
          ? laboratoires.map((laboratoire, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className='shadow-lg rounded-2xl border border-gray-200 bg-white h-[330px]'>
                  <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center space-x-4'>
                      <img
                        className='w-20 h-20 rounded-full object-cover border-2 border-blue-500'
                        src={laboratoire.image ? laboratoire.image : '/img/placeholder-image.jpg'}
                        alt={laboratoire.nom_ut}
                      />
                      <div>
                        <h2 className='text-lg font-semibold text-gray-800'>{laboratoire.nom_ut}</h2>
                        <p className='text-sm text-gray-500'>
                          <span
                            className={
                              laboratoire.mode_pre === undefined || laboratoire.mode_pre === null ? 'text-red-500' : ''
                            }
                          >
                            {laboratoire.mode_pre === 1
                              ? 'Prélèvement sur place au laboratoire'
                              : laboratoire.mode_pre === 0
                                ? 'Prélèvement à domicile'
                                : laboratoire.mode_pre === 2
                                  ? 'Prélèvement sur place au laboratoire et à domicile'
                                  : 'Prélèvement non défini'}
                          </span>
                        </p>
                        <div className='mt-2'>
                          <StarRating size='sm' initialRating={laboratoire?.sc ?? 0} readOnly />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={() => {
                          setSelectedLaboId(laboratoire.id)
                          console.log('laboratoire:', laboratoire.id)
                          setIsModalOpen(true)
                        }}
                      >
                        Rendez-vous
                      </Button>
                    </div>
                  </div>
                  <hr className='border-t border-gray-300' />
                  <CardContent>
                    <p className='mb-4'>{laboratoire.info}</p>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <FaMap className='w-4 h-4 mr-2 text-blue-500' />

                      <span className={laboratoire.ville?.trim() ? '' : 'text-red-500'}>
                        {laboratoire.ville?.trim() ? laboratoire.ville?.trim() : 'Ville non définie'}
                      </span>

                      <Mail className='w-4 h-4 mr-2 text-blue-500 ml-12' />

                      <span>{laboratoire.email}</span>
                    </div>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <FaRegClock className='w-4 h-4 mr-2 text-blue-500' />

                      <span className={laboratoire.heurD && laboratoire.heurF ? '' : 'text-red-500'}>
                        {laboratoire.heurD && laboratoire.heurF
                          ? `${laboratoire.heurD.slice(0, 5)} - ${laboratoire.heurF.slice(0, 5)}`
                          : 'Horaires non définis'}
                      </span>

                      <MapPin className='w-5 h-5 mr-2 text-blue-500' />
                      <span className={laboratoire.adresse?.trim() ? '' : 'text-red-500'}>
                        {laboratoire.adresse?.trim() ? laboratoire.adresse?.trim() : 'Adresse non définie'}
                      </span>
                    </div>

                    <div className='flex justify-end mt-4'>
                      <StarRating
                        size='sm'
                        onChange={async (e: any) => {
                          console.log(e)
                          await upValue(e, laboratoire.id, userData.id)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : null}

        <RendezVousModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          laboId={selectedLaboId}
          medecinId={null}
        />
      </Grid>
      <Grid item xs={12} className='mt-6 pb-6 justify-items-end'>
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

export default Laboratoire
