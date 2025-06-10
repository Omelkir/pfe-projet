'use client'

import { useState, useEffect } from 'react'

interface ImageType {
  src: string
  alt: string
}

interface SimpleSlideshowProps {
  interval?: number
  images: ImageType[] // Correction ici, images doit être un tableau d'objets avec src et alt
}

export function SimpleSlideshow({ interval = 3000, images }: SimpleSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval, images]) // Ajout de images dans les dépendances

  if (!images || images.length === 0) {
    return <p className='text-center'>Aucune image disponible</p>
  }

  return (
    <div className='relative w-full h-[350px] overflow-hidden rounded-lg'>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={image.src} alt={image.alt} className='w-full h-full object-cover' />
        </div>
      ))}

      <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
