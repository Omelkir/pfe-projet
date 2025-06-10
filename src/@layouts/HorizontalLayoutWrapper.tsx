'use client'

import type { ReactElement } from 'react'

type HorizontalLayoutWrapperProps = {
  horizentalLayout: ReactElement
}

const HorizontalLayoutWrapper = ({ horizentalLayout }: HorizontalLayoutWrapperProps) => {
  return <div>{horizentalLayout}</div>
}

export default HorizontalLayoutWrapper
