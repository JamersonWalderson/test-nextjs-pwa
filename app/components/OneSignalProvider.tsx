'use client'

import { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'

export default function OneSignalProvider() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    OneSignal.init({
      appId: "d38fa73a-a9f8-400d-91cb-9a2bec714447",
    }).then(() => {
      console.log('OneSignal initialized successfully')
      setInitialized(true)
    }).catch((error) => {
      console.warn('OneSignal initialization failed:', error)
    })
  }, [])

  useEffect(() => {
    if (initialized) {
      // Opcional: solicitar permissão para notificações
      OneSignal.Slidedown.promptPush()
    }
  }, [initialized])

  return null // Componente não renderiza nada visualmente
}
