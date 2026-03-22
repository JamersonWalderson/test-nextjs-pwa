'use client'

import { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'

export default function OneSignalProvider() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    OneSignal.init({
      appId: "d38fa73a-a9f8-400d-91cb-9a2bec714447",
      allowLocalhostAsSecureOrigin: true,
    }).then(() => {
      console.log('OneSignal initialized successfully')
      setInitialized(true)
      
      // Verificar permissão atual
      const permission = OneSignal.Notifications.permission
      console.log('Notification permission:', permission)
    }).catch((error) => {
      console.error('OneSignal initialization failed:', error)
    })
  }, [])

  useEffect(() => {
    if (initialized) {
      // Solicitar permissão para notificações
      OneSignal.Slidedown.promptPush().then(() => {
        console.log('Push notification prompt shown')
      }).catch((error) => {
        console.warn('Push notification prompt error:', error)
      })
      
      // Listener para quando o usuário se inscrever
      OneSignal.User.PushSubscription.addEventListener('change', (subscription) => {
        console.log('Push subscription changed:', subscription)
      })
    }
  }, [initialized])

  return null // Componente não renderiza nada visualmente
}
