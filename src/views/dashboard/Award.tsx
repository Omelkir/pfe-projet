// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Grid } from '@mui/material'

import type { CardStatsProps } from '@/types/pages/widgetTypes'

const Award = (props: CardStatsProps) => {
  const { icons, number, title, color, bg } = props

  return (
    <Card>
      <CardContent sx={{ height: '280px', paddingTop: '40px' }}>
        <div className='icon-box' style={{ backgroundColor: bg }}>
          <i className={icons} style={{ color: color, fontSize: '60px' }} />
        </div>
        <div className='centerCard'>
          <Typography variant='h5' style={{ fontSize: 30, fontWeight: 'bold', color: color, marginTop: 10 }}>
            {number}
          </Typography>
        </div>
        <div className='centerCard'>
          <Typography variant='h5' style={{ fontWeight: 'bold', marginTop: 10 }}>
            {title}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default Award
