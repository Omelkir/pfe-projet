// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import ToastProvider from '@/components/ui/toast'
import { NotificationProvider } from '@/context/NotificationContext'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <NotificationProvider>
      <Providers direction={direction}>
        <LayoutWrapper
          verticalLayout={
            <VerticalLayout navigation={<Navigation />} navbar={<Navbar />} footer={<VerticalFooter />}>
              <ToastProvider />
              {children}
            </VerticalLayout>
          }
        />
      </Providers>
    </NotificationProvider>
  )
}

export default Layout
