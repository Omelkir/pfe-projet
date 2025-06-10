'use client'

import React, { createContext, useContext, useState } from 'react'

type NotificationContextType = {
  show: boolean
  trigger: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  show: false,
  trigger: () => {}
})

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false)

  const trigger = () => {
    setShow(true)
    setTimeout(() => setShow(false), 4000)
  }

  return <NotificationContext.Provider value={{ show, trigger }}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext)
