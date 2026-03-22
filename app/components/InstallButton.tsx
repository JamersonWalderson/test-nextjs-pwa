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
  const [showChromeRecommendation, setShowChromeRecommendation] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Comunicar com service worker sobre o browser
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Enviar info do browser para o SW
        registration.active?.postMessage({
          type: 'BROWSER_INFO',
          userAgent: navigator.userAgent
        })
      })

      // Escutar respostas do service worker
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'RECOMMEND_CHROME') {
          console.log('Service Worker recomenda Chrome:', event.data.message)
          setShowChromeRecommendation(true)
        }
        
        if (event.data.type === 'OPEN_IN_CHROME') {
          // Abrir no Chrome usando intent
          window.location.href = event.data.chromeIntent
          
          // Fallback após 2 segundos
          setTimeout(() => {
            window.location.href = event.data.fallbackUrl
          }, 2000)
        }
      }

      navigator.serviceWorker.addEventListener('message', messageHandler)

      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
        navigator.serviceWorker.removeEventListener('message', messageHandler)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    // Solicitar ao service worker para verificar browser e decidir ação
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      registration.active?.postMessage({
        type: 'REQUEST_INSTALL',
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }

    // Se não tiver prompt (Safari, Firefox, etc.), apenas retornar
    if (!installPrompt) {
      return
    }

    // Fluxo normal de instalação no Chrome
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    
    console.log(`Install prompt was: ${choice.outcome}`)
    
    if (choice.outcome === 'accepted') {
      setIsInstalled(true)
    }
    
    setInstallPrompt(null)
  }

  if (isInstalled) {
    return null
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        {installPrompt && (
          <button
            onClick={handleInstallClick}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Instalar App
          </button>
        )}
        
        {isIOS && !installPrompt && (
          <div className="text-sm text-center text-zinc-600 dark:text-zinc-400 max-w-md">
            <p>
              Para instalar este app no iOS, toque no botão de compartilhar{' '}
              <span role="img" aria-label="share icon">⎋</span>
              {' '}e depois em &ldquo;Adicionar à Tela de Início&rdquo;{' '}
              <span role="img" aria-label="plus icon">➕</span>
            </p>
          </div>
        )}
      </div>

      {/* Modal de recomendação do Chrome */}
      {showChromeRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-sm w-full shadow-2xl p-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🌐</div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Abrir no Chrome
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Para instalar este PWA como WebAPK e ter a melhor experiência, abra no Google Chrome.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowChromeRecommendation(false)}
                  className="flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Abrir no Chrome
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
