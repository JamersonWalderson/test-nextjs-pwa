'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches
    }
    return false
  })
  const [isIOS] = useState(() => {
    if (typeof window !== 'undefined') {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    }
    return false
  })

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    
    console.log(`Install prompt was: ${choice.outcome}`)
    
    if (choice.outcome === 'accepted') {
      setIsInstalled(true)
    }
    
    setInstallPrompt(null)
  }

  if (isInstalled) {
    return (
      <div className="w-full rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✅</span>
          <div>
            <p className="font-semibold text-green-600 dark:text-green-400">
              App Instalado
            </p>
            <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
              Você está usando o PWA instalado
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {/* Botão de instalação para Chrome/Edge */}
      {installPrompt && (
        <button
          onClick={handleInstallClick}
          className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium shadow-sm"
        >
          📱 Instalar App
        </button>
      )}
      
      {/* Instruções para iOS Safari */}
      {isIOS && (
        <div className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Instalar no iOS
              </h3>
            </div>
            
            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">1.</span>
                <span>
                  Toque no botão <strong>Compartilhar</strong> 
                  <span className="inline-block mx-1 text-lg">
                    <svg className="inline w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                    </svg>
                  </span>
                  na barra inferior do Safari
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">2.</span>
                <span>
                  Role para baixo e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong> 
                  <span className="inline-block mx-1 text-lg">➕</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">3.</span>
                <span>
                  Toque em <strong>&quot;Adicionar&quot;</strong> para confirmar
                </span>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Mensagem quando não há suporte */}
      {!installPrompt && !isIOS && (
        <div className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                Instalação não disponível
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Use Chrome, Edge ou Safari para instalar este PWA
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
