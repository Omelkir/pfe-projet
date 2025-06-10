'use client'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

const NavSearch = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return isBreakpointReached ? (
    <IconButton className='text-textPrimary'>
      <i className='ri-search-line' style={{ color: 'white', fontSize: '25px' }} />
    </IconButton>
  ) : (
    <div className='flex items-center cursor-pointer gap-2'>
      <IconButton className='text-textPrimary'>
        <i className='ri-search-line' style={{ color: 'white', fontSize: '25px' }} />
      </IconButton>
      <div className='whitespace-nowrap select-none text-textDisabled' style={{ color: 'white', fontSize: '15px' }}>
        Search ⌘K
      </div>
    </div>
  )
}

export default NavSearch
