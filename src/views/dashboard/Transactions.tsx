//MUI Imports
import Card from '@mui/material/Card'

import type { CardStatsProps2 } from '@/types/pages/widgetTypes'

const Transactions = (props: CardStatsProps2) => {
  const { title, nom, image } = props

  return (
    <Card className={`bs-full ${image}`}>
      <div className='pt-12 pl-8 text-white'>
        <h5>{title}</h5>
        <h2>{nom}</h2>
      </div>
    </Card>
  )
}

export default Transactions
