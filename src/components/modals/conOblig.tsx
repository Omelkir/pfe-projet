'use client'

import { useRouter } from 'next/navigation'

import { Button, Grid, Box, Typography } from '@mui/material'

import { Modal } from '../ui/modal'
import Logo from '@components/layout/shared/Logo'

export default function ConnModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className='absolute left-1/2 transform -translate-x-1/2 top-5 sm:top-[33px]'>
          <Logo />
        </span>
      }
      className='p-8'
    >
      <Box position='relative' textAlign='center' paddingY={4}>
        <Typography variant='h6' fontWeight={500} marginTop={10}>
          Pour effectuer cette action, vous devez vous connecter à un compte existant ou en créer un nouveau.
        </Typography>
        <Grid container spacing={3} className='mt-8'>
          <Grid item xs={12} md={12}>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              onClick={() => {
                router.push('/loginFront')
              }}
            >
              Se connecter
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <Button
              fullWidth
              variant='outlined'
              color='primary'
              onClick={() => {
                router.push('/register')
              }}
            >
              S’inscrire
            </Button>
          </Grid>
        </Grid>
        <Typography
          variant='h6'
          fontWeight={500}
          marginTop={10}
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={onClose}
        >
          plus tard
        </Typography>
      </Box>
    </Modal>
  )
}
