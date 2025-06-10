'use client'

import { Button, Grid } from '@mui/material'
import { FaExclamationTriangle } from 'react-icons/fa'

import { Modal } from '@/components/ui/modal'

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  label = 'cet élément'
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  label?: string
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h1 className='block w-full text-center'>
          <FaExclamationTriangle className='text-5xl text-red-500 mr-2' />
        </h1>
      }
      footer={
        <div className='flex justify-end gap-2'>
          <Button
            variant='contained'
            style={{ backgroundColor: 'white', color: 'black' }}
            size='small'
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button variant='contained' color='error' size='small' onClick={onConfirm}>
            Supprimer
          </Button>
        </div>
      }
    >
      <Grid container spacing={3}>
        <p className='mt-3 text-black text-xl block w-full text-center mb-6'>
          Êtes-vous sûr de vouloir supprimer {label} ?
        </p>
      </Grid>
    </Modal>
  )
}
