// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { IconChevronRight } from '@tabler/icons-react'

import type { CardArrow } from '@/types/pages/widgetTypes'

const Arrow = (props: CardArrow) => {
  const { title, subTitle } = props

  
return (
    <div className='mb-6'>
      <Typography
        className='text-lg posArrow ml-2 mr-2'
        style={{
          color: 'black',
          display: 'inline-block'
        }}
      >
        {title}
      </Typography>
      <IconChevronRight stroke={3} color='black' />
      <Typography
        className='text-lg posArrow  ml-2 mr-2'
        style={{
          color: 'black',
          display: 'inline-block'
        }}
      >
        {subTitle}
      </Typography>
    </div>
  )
}

export default Arrow
