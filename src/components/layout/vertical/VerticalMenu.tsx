// MUI Imports
import { useEffect, useState } from 'react'

import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { menuAdmin, menuMed, menulabo } from './menu'
import { getStorageData } from '@/utils/helpers'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  const typeOfLogger: any = getStorageData('typeOfLogger')

  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  const [mmenu, setMmenu] = useState<any>(
    typeOfLogger === 1 ? menuAdmin : typeOfLogger === 2 ? menuMed : typeOfLogger === 3 ? menulabo : []
  )

  useEffect(() => {
    setMmenu(typeOfLogger === 1 ? menuAdmin : typeOfLogger === 2 ? menuMed : typeOfLogger === 3 ? menulabo : [])
  }, [typeOfLogger])

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const renderMenu = (items: any[]) => {
    return items.map(item => {
      if (item.subMenu) {
        return (
          <SubMenu key={item.path} label={item.label} icon={<i className={item.icon} />} style={{ fontSize: '20px' }}>
            {renderMenu(item.subMenu)}
          </SubMenu>
        )
      }

      return (
        <MenuItem key={item.path} href={item.path} icon={<i className={item.icon} />} style={{ fontSize: '20px' }}>
          {item.label}
        </MenuItem>
      )
    })
  }

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuSection label={null}>{renderMenu(mmenu)}</MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
