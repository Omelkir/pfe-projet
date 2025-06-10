'use client'

import React, { useRef, useState } from 'react'

import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import { motion } from 'framer-motion'
import { IoMdMenu } from 'react-icons/io'

// MUI Imports

import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { ChevronDown } from 'lucide-react'

import { getStorageData, deleteStorageData } from '@/utils/helpersFront'
import Logo from '@/components/layout/shared/Logo'

const NavbarMenu = [
  {
    id: 1,
    title: 'Acceuil',
    path: '/front_page'
  },
  {
    id: 2,
    title: 'À propos de nous',
    path: '/front_page/a-propos-de-nous'
  },
  {
    id: 3,
    title: 'Médecin',
    path: '/front_page/med'
  },
  {
    id: 4,
    title: 'Laboratoire',
    path: '/front_page/labo'
  },
  {
    id: 5,
    title: 'Contactez-nous',
    path: '/front_page/contactez-nous'
  }
]

const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const DropdownLogin = () => {
  const [open, setOpen] = useState(false)

  const toggleDropdown = () => setOpen(prev => !prev)

  return (
    <div className='relative'>
      <div
        onClick={toggleDropdown}
        className='inline-flex items-center py-2 px-3 cursor-pointer navigation select-none'
      >
        Se connecter
        <ChevronDown className={`ml-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} size={18} />
      </div>

      {open && (
        <ul className='absolute bg-white shadow-md mt-1 rounded-md z-50 list-none p-0 m-0 w-30'>
          {[
            { label: 'Comme patient', path: '/loginFront' },
            { label: 'Autres', path: '/login' }
          ].map((item, index) => (
            <li key={index}>
              <a href={item.path} className='block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700'>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const Navbar = () => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const userData = getStorageData('user')

  console.log('user:', userData)
  const menuItems = [...NavbarMenu]

  if (userData?.id === undefined) {
    menuItems.push({
      id: 6,
      title: 'Se connecter',
      path: ''
    })
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    deleteStorageData()

    router.push('/loginFront')

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  return (
    <nav className='relative z-20'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className='py-2 pr-5 bg-white flex justify-between font-poppins items-center'

        // style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}
      >
        {/* Logo section */}
        <div className='pl-20'>
          <Logo />
        </div>
        {/* Menu section */}
        <div className='hidden lg:block'>
          <ul className='flex items-center gap-3' style={{ listStyle: 'none' }}>
            {menuItems.map(menu => (
              <li key={menu.id} className='relative group'>
                {menu.id === 6 ? (
                  <DropdownLogin />
                ) : (
                  <a href={menu.path} className='inline-block py-2 px-3 navigation relative group'>
                    <div className='w-2 h-2 absolute mt-4 left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden'></div>
                    {menu.title}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className='lg:hidden'>
          <IoMdMenu className='text-4xl' />
        </div>
        {userData !== undefined ? (
          <div>
            <Badge
              ref={anchorRef}
              overlap='circular'
              badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              className='mis-2'
            >
              <Avatar
                ref={anchorRef}
                alt='John Doe'
                src={userData?.image ?? '/images/avatars/1.png'}
                onClick={handleDropdownOpen}
                className='cursor-pointer bs-[38px] is-[38px]'
              />
            </Badge>
            <Popper
              open={open}
              transition
              disablePortal
              placement='bottom-end'
              anchorEl={anchorRef.current}
              className='min-is-[240px] !mbs-4 z-[1]'
            >
              {({ TransitionProps, placement }) => (
                <Fade
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
                  }}
                >
                  <Paper className='shadow-lg'>
                    <ClickAwayListener onClickAway={() => {}}>
                      <MenuList>
                        <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                          <Avatar alt='John Doe' src={userData?.image ?? '/images/avatars/1.png'} />
                          <div className='flex items-start flex-col'>
                            <Typography className='font-medium' color='text.primary'>
                              {(userData?.nom ?? '') + ' ' + (userData?.prenom ?? '')}
                            </Typography>
                            <Typography variant='caption'>Patient</Typography>
                          </div>
                        </div>
                        <Divider className='mlb-1' />
                        <MenuItem className='gap-3' onClick={() => router.push('/front_page/profil')}>
                          <i className='ri-user-3-line' />
                          <Typography color='text.primary'>My Profile</Typography>
                        </MenuItem>
                        <div className='flex items-center plb-2 pli-4'>
                          <Button
                            fullWidth
                            variant='contained'
                            color='error'
                            size='small'
                            endIcon={<i className='ri-logout-box-r-line' />}
                            onClick={e => handleDropdownClose(e, '/loginFront')}
                            sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                          >
                            Logout
                          </Button>
                        </div>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </div>
        ) : null}
      </motion.div>
    </nav>
  )
}

export default Navbar
