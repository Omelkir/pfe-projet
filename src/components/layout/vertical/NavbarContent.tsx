'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import IconButton from '@mui/material/IconButton'
import classnames from 'classnames'

import { Badge, Divider, Paper, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import { AnimatePresence, motion } from 'framer-motion'

import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import { getStorageData } from '@/utils/helpers'

import CustomAvatar from '@/@core/components/mui/Avatar'

const NotificationDropdown = ({ notifications = [] }: { notifications: any[] }) => {
  return (
    <Paper elevation={4} className='absolute top-12 right-0 w-[22rem] z-50 rounded-lg'>
      <Typography variant='h6' className='text-center p-3 border-b font-semibold'>
        Notifications
      </Typography>
      <Divider />
      <Table size='small'>
        <TableBody>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <TableRow key={notification.id} hover>
                <TableCell>
                  <div className='flex gap-3 items-start'>
                    <CustomAvatar src={notification.image} size={34} />
                    <div>
                      <Typography variant='subtitle2' color='text.primary' className='font-bold'>
                        {notification.prenom} {notification.nom}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        dangerouslySetInnerHTML={{ __html: notification.message }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>
                <Typography variant='body2' className='text-center'>
                  Aucune notification pour le moment.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}

const NavbarContent = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [notification, setNotification] = useState<any>({})
  const userData = getStorageData('user')
  const toggleDropdown = () => setDropdownOpen(prev => !prev)

  async function getNotification(id: any) {
    try {
      const url = `${window.location.origin}/api/notification/get-notification?id_recepteur=${id}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      setNotification(responseData)
      console.log(responseData)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la récupération des données.')
    }
  }

  const notificationVu = async (id: any) => {
    try {
      const response = await fetch(`${window.location.origin}/api/notification/vu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id
        })
      })

      const result = await response.json()

      if (!response.ok || result.erreur) {
        toast.error('Erreur !')
      }
    } catch (err) {
      toast.error('Erreur !')
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await getNotification(userData?.id)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
      style={{ backgroundColor: 'rgb(17, 106, 239)', padding: '20px', borderRadius: '10px' }}
    >
      <div className='flex items-center gap-2 sm:gap-4'>
        <NavToggle />
        <NavSearch />
      </div>
      <div className='flex items-center'>
        <ModeDropdown />

        <IconButton
          onClick={() => {
            toggleDropdown()
            notificationVu(userData?.id)
          }}
        >
          <Badge badgeContent={`${notification?.vuno > 0 ? notification?.vuno : '0'}`} color='error'>
            <i className='ri-notification-2-line' style={{ color: 'white', fontSize: '25px' }} />
          </Badge>
        </IconButton>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div className='absolute top-10 right-20'>
              <NotificationDropdown notifications={notification?.data || []} />
            </motion.div>
          )}
        </AnimatePresence>

        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
