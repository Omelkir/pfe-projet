'use client'

import { useState } from 'react'

import { Star } from 'lucide-react'

import { cn } from '@/libs/utl'

interface StarRatingProps {
  totalStars?: number
  initialRating?: number
  onChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  className?: string
}

export function StarRating({
  totalStars = 5,
  initialRating = 0,
  onChange,
  size = 'md',
  readOnly = false,
  className
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index: number) => {
    if (readOnly) return

    const newRating = index + 1

    setRating(newRating)
    onChange?.(newRating)
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center gap-1', className)} onMouseLeave={() => !readOnly && setHoverRating(0)}>
      {Array.from({ length: totalStars }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            sizeClasses[size],
            'cursor-pointer transition-all duration-150',
            (hoverRating > 0 ? index < hoverRating : index < rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-500',
            readOnly && 'cursor-default'
          )}
          onClick={() => handleClick(index)}
          onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
        />
      ))}
    </div>
  )
}
