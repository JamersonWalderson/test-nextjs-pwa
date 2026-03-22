'use client'

import { useState } from 'react'

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission
    }
    return 'default'
  })
  const [isSupported] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window
  })

  const requestPermission = async () => {
    if (!isSupported) {
      alert('Notificações não são suportadas neste navegador')
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        console.log('Permissão de notificação concedida')
        
        // Enviar notificação de teste
        new Notification('Notificações Ativadas!', {
          body: 'Você receberá notificações deste PWA',
          icon: '/vercel.svg',
          badge: '/vercel.svg'
        })
      } else if (result === 'denied') {
        console.log('Permissão de notificação negada')
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
    }
  }

  const getStatusInfo = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: '✅',
          text: 'Notificações Ativadas',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        }
      case 'denied':
        return {
          icon: '❌',
          text: 'Notificações Bloqueadas',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800'
        }
      default:
        return {
          icon: '🔔',
          text: 'Notificações Desativadas',
          color: 'text-zinc-600 dark:text-zinc-400',
          bgColor: 'bg-zinc-50 dark:bg-zinc-800',
          borderColor: 'border-zinc-200 dark:border-zinc-700'
        }
    }
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Notificações não suportadas neste navegador
      </div>
    )
  }

  const status = getStatusInfo()

  return (
    <div className="flex flex-col gap-3 items-center w-full max-w-md">
      {/* Status das notificações */}
      <div className={`w-full rounded-lg border ${status.borderColor} ${status.bgColor} p-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{status.icon}</span>
          <div className="flex-1">
            <p className={`font-semibold ${status.color}`}>
              {status.text}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {permission === 'granted' && 'Você receberá notificações push'}
              {permission === 'denied' && 'Ative nas configurações do navegador'}
              {permission === 'default' && 'Clique no botão para ativar'}
            </p>
          </div>
        </div>
      </div>

      {/* Botão de ação */}
      {permission !== 'granted' && (
        <button
          onClick={requestPermission}
          disabled={permission === 'denied'}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
            permission === 'denied'
              ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
          }`}
        >
          {permission === 'denied' ? (
            <span className="flex items-center justify-center gap-2">
              <span>🔒</span>
              <span>Bloqueado - Ative nas Configurações</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🔔</span>
              <span>Ativar Notificações</span>
            </span>
          )}
        </button>
      )}

      {/* Botão de teste (apenas se já tiver permissão) */}
      {permission === 'granted' && (
        <button
          onClick={() => {
            new Notification('Notificação de Teste', {
              body: 'Esta é uma notificação de teste do PWA',
              icon: '/vercel.svg',
              badge: '/vercel.svg',
              tag: 'test-notification',
              requireInteraction: false
            })
          }}
          className="w-full px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-sm"
        >
          Enviar Notificação de Teste
        </button>
      )}
    </div>
  )
}
