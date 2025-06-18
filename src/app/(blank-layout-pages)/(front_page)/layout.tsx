import type { ChildrenType } from '@core/types'

import Providers from '@components/Providers'

import Navbar from './nav_bar/navBar'
import Footer from './footer/Footer'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <Providers direction={direction}>
      {/* <HorizontalLayoutWrapper horizentalLayout={<HorizontalLayout nav={<Navbar />}>{children}</HorizontalLayout>} /> */}
      <div>
        <Navbar />
      </div>
      <div>{children}</div>
      <div>
        <Footer />
      </div>
    </Providers>
  )
}

export default Layout
