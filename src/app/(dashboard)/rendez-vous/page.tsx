/* eslint-disable import/no-unresolved */
'use client'

import React, { useRef, useState } from 'react'

import interactionPlugin from '@fullcalendar/interaction'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import frLocale from '@fullcalendar/core/locales/fr'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, Card, CardContent, Typography } from '@mui/material'

import { CalendarCheck } from 'lucide-react'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import Swal from 'sweetalert2/dist/sweetalert2.js'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'
import ConsultationModal from '@/components/modals/consultation'
import 'sweetalert2/src/sweetalert2.scss'
import tableStyles from '@core/styles/table.module.css'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getStorageData } from '@/utils/helpers'

import DeleteModal from '@/components/modals/deleteModal/deleteModal'

interface Evenement {
  title: string
  start: Date
  end: Date
}

const CalendrierRendezvous = () => {
  const calendarRef = useRef<FullCalendar | null>(null)

  const localizer = momentLocalizer(moment)
  const MySwal = withReactContent(Swal)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [update, setUpdate] = useState<string>('')
  const userData = getStorageData('user')
  const [dataUp, setDataUp] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)

  const handleOpenModal = (data: any = {}) => {
    setDataUp(data)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (rendezVous: any = null) => {
    setSelected(rendezVous)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (rendezVous: any) => {
    const id = rendezVous?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/consultation/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success('Le rendez-vous a été supprimé avec succès')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleConfirmDelete = async () => {
    await handleDelete(selected)
    setIsDeleteModalOpen(false)
  }

  async function refrech_envent() {
    try {
      setIsLoading(true)
      const url = `${window.location.origin}/api/consultation/liste?consultation.isApproved=1&consultation.id_el=${userData.id}&getall`

      const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        setIsLoading(false)

        throw new Error('Erreur lors de la requête')
      }

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        setIsLoading(false)

        alert(responseData.message)
      } else {
        setIsLoading(false)

        setEvenements(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      console.log('Une erreur est survenue lors de la récupération des données.')
    }
  }

  React.useEffect(() => {
    refrech_envent()
  }, [update])

  function generateSummaryEvents(events: any) {
    const countMap: any = {}

    events.forEach((event: any) => {
      const date: any = new Date(event.start).toISOString().split('T')[0]

      countMap[date] = (countMap[date] || 0) + 1
    })

    return Object.entries(countMap).map(([date, count]: any) => ({
      id: `summary-${date}`,
      start: date,
      allDay: true,
      title: `(${count}) Rendez-vous ${count > 1 ? '(s)' : ''}`,
      isSummary: true
    }))
  }

  const MessageAlertEvent = ({
    data,
    onEdit,
    onDelete,
    onClose
  }: {
    data: any
    onEdit: (rend: any) => void
    onDelete: (rend: any) => void
    onClose?: () => void
  }) => {
    return (
      <div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Durée</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((row: any, index: any) => (
                <tr key={index}>
                  <td className='!plb-1'>
                    <div className='flex items-center gap-3'>
                      <CustomAvatar src={row.image} size={34} />
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='font-medium'>
                          {row.nom}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className='!plb-1'>
                    <Typography color='text.primary' className='font-medium'>
                      {row.prenom}
                    </Typography>
                  </td>
                  <td className='!plb-1'>
                    <Typography color='text.primary' className='font-medium'>
                      {row.email}
                    </Typography>
                  </td>
                  <td className='!plb-1'>
                    <Typography color='text.primary' className='font-medium'>
                      {row.tel}
                    </Typography>
                  </td>
                  <td className='!plb-1'>
                    <Typography color='text.primary' className='font-medium'>
                      {row.duree + ' (m)'}
                    </Typography>
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-700  gap-2'>
                    <button
                      className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl mr-3'
                      onClick={() => {
                        onEdit(row)
                        onClose?.()
                      }}
                    ></button>
                    <button
                      onClick={() => {
                        onDelete(row)
                        onClose?.()
                      }}
                      className='ri-delete-bin-line text-red-500 text-xl hover:text-2xl'
                    ></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const now = new Date()

  return (
    <Card>
      <CardContent>
        <Arrow title='Dashboard' subTitle={`Rendez-vous (${evenements?.length ?? '--'})`} />
        <div className='p-4'>
          <div className='flex justify-end items-center mb-4'>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              className='h-12 w-1/4 mb-12'
              onClick={() => handleOpenModal()}
            >
              <CalendarCheck className='mr-2' /> Ajouter rendez-vous
            </Button>
          </div>
          {isLoading ? (
            <div> Chargement ....</div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              validRange={{
                start: now.toISOString()
              }}
              locale={frLocale}
              eventClick={info => {
                const isSummary = info.event.extendedProps.isSummary

                if (isSummary) {
                  const date = info.event.startStr

                  const eventsOfDay = evenements.filter(ev => new Date(ev.start).toISOString().startsWith(date))

                  // // 🟦 Afficher liste des événements du jour dans un modal par ex
                  // setDayEvents(eventsOfDay)
                  // setShowEventListModal(true)

                  MySwal.fire({
                    html: (
                      <MessageAlertEvent
                        data={eventsOfDay}
                        onEdit={handleOpenModal}
                        onClose={MySwal.close}
                        onDelete={handleOpenDeleteModal}
                      />
                    ),

                    showConfirmButton: false,
                    customClass: {
                      title: 'custom-title',
                      popup: 'custom-popup'
                    },
                    didOpen: () => {}
                  })
                } else {
                  setIsModalOpen(true)
                  setDataUp({
                    el: 2,
                    end: info.event.end?.toISOString(),
                    start: info.event.start?.toISOString(),
                    ...info.event._def.extendedProps
                  })
                }
              }}
              dateClick={(info: any) => {
                setIsModalOpen(true)
                const isoDateTime = info.date.toISOString()

                setDataUp({
                  start: isoDateTime,
                  end: isoDateTime,
                  el: 2
                })
              }}
              events={generateSummaryEvents(evenements)}
              eventContent={arg => {
                if (arg.event.extendedProps.isSummary) {
                  return {
                    html: `<div style="font-weight:bold;color:white;font-size:0.8rem">${arg.event.title}</div>`
                  }
                }

                return null
              }}
              height='auto'
            />
          )}
        </div>
        <ConsultationModal
          dataUp={dataUp}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setUpdate={setUpdate}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          label={`ce rendez-vous`}
        />
      </CardContent>
    </Card>
  )
}

export default CalendrierRendezvous
