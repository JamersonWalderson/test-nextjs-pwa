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
    return null
  }

  return (
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
  )
}
