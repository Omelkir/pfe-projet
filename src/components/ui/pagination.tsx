import type { PaginationProps } from 'rc-pagination';
import RCPagination from 'rc-pagination'

import 'rc-pagination/assets/index.css'
import { ArrowPrev } from '../icons/arrow-prev'
import { ArrowNext } from '../icons/arrow-next'

const Pagination: React.FC<PaginationProps> = props => {
  return <RCPagination nextIcon={<ArrowNext />} prevIcon={<ArrowPrev />} {...props} />
}

export default Pagination
