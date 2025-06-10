//MUI Imports
import Card from '@mui/material/Card'

// Type Imports
import type { ThemeColor } from '@core/types'


type DataType = {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

// Vars
const data: DataType[] = [
  {
    stats: '245k',
    title: 'Sales',
    color: 'primary',
    icon: 'ri-pie-chart-2-line'
  },
  {
    stats: '12.5k',
    title: 'Users',
    color: 'success',
    icon: 'ri-group-line'
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Products',
    icon: 'ri-macbook-line'
  },
  {
    stats: '$88k',
    color: 'info',
    title: 'Revenue',
    icon: 'ri-money-dollar-circle-line'
  }
]

const MiniCard = () => {
  return (
    <Card className='bs-full'>
    </Card>
    
  )
}

export default MiniCard
