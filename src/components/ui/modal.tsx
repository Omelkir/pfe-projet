'use client'

import * as React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  children?: React.ReactNode
  className?: string
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  footer
}: ModalProps) {
  const [open, setOpen] = React.useState(isOpen)

  React.useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    isOpen && (
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        <div className='absolute inset-0 bg-black/10 backdrop-blur-sm' onClick={handleClose} />

        <div className='relative z-50 w-full sm:max-w-lg md:max-w-lg bg-white rounded-lg shadow-lg'>
          {(title || description) && (
            <div className='p-4'>
              {title && <div className='text-xl text-black'>{title}</div>}
              {description && <div className='text-sm'>{description}</div>}
            </div>
          )}
          <div className='p-4'>{children}</div>
          {footer && <div className='p-4'>{footer}</div>}
        </div>
      </div>
    )
  )
}
