'use client'

import { Button } from '@mui/material'
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa'

import { Modal } from '@/components/ui/modal'

export default function SuccesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className='flex justify-center'>
          <FaCheckCircle className='text-green-500 text-6xl' />
        </div>
      }
      footer={
        <div className='flex justify-center mt-4'>
          <Button
            variant='contained'
            style={{ backgroundColor: '#16a34a', color: 'white' }}
            size='medium'
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>
      }
    >
      <div className='text-center px-4 space-y-2'>
        <h3 className='text-lg font-semibold text-green-700'>
          Votre compte a été <strong>créé avec succès</strong>
        </h3>
        <p className='text-sm text-gray-700 leading-6'>
          Veuillez attendre sa <strong>validation par un administrateur</strong>
        </p>
        <div className='flex items-center justify-center gap-2 text-sm text-gray-700'>
          <FaEnvelope className='text-lg text-green-600' />
          <span>Un e-mail de confirmation vous sera envoyé.</span>
        </div>
      </div>
    </Modal>
  )
}
