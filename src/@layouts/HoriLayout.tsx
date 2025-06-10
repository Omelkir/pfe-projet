// React Imports
import type { ReactNode } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { horizontalLayoutClasses } from './utils/layoutClasses'

import LayCont from './components/layCont'

type HorizontalLayoutProps = ChildrenType & {
  nav?: ReactNode
}

const HorizontalLayout = (props: HorizontalLayoutProps) => {
  // Props
  const { nav, children } = props

  return (
    <div className={classnames(horizontalLayoutClasses.root)}>
      <div>{nav || null}</div>
      <div>
        <div className={classnames(horizontalLayoutClasses.contentWrapper)}>
          <LayCont>{children}</LayCont>
        </div>
      </div>
    </div>
  )
}

export default HorizontalLayout
