'use client'

import { useState, useEffect } from 'react'

import { cn } from '@/libs/utl'

interface AnimatedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  animationType?: 'fade' | 'slide' | 'zoom' | 'rotate'
}

export function AnimatedImage({ src, alt, width, height, className, animationType = 'zoom' }: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (prevSrc !== src) {
      setIsTransitioning(true)
      setPrevSrc(src)

      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 500) // Match this with the CSS transition duration

      return () => clearTimeout(timer)
    }
  }, [src, prevSrc])

  const getAnimationClass = () => {
    switch (animationType) {
      case 'fade':
        return 'transition-opacity duration-500'
      case 'slide':
        return 'transition-transform duration-500'
      case 'zoom':
        return 'transition-transform duration-500'
      case 'rotate':
        return 'transition-transform duration-500'
      default:
        return 'transition-opacity duration-500'
    }
  }

  const getAnimationStyle = () => {
    if (!isTransitioning) return {}

    switch (animationType) {
      case 'fade':
        return { opacity: 0 }
      case 'slide':
        return { transform: 'translateX(-100%)' }
      case 'zoom':
        return { transform: 'scale(0.8)' }
      case 'rotate':
        return { transform: 'rotate(90deg)' }
      default:
        return { opacity: 0 }
    }
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover', getAnimationClass(), isLoaded ? 'opacity-100' : 'opacity-0')}
        style={getAnimationStyle()}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}
