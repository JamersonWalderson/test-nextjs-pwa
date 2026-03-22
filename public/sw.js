// Detectar browser do cliente
function detectBrowser(userAgent) {
  const isMobile = /Android|iPhone|iPad/i.test(userAgent)
  const isAndroid = /Android/i.test(userAgent)
  const isAndroidChrome = /Android.*Chrome\//i.test(userAgent) && !/Edg/i.test(userAgent)
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
  
  return {
    isMobile,
    isAndroid,
    isAndroidChrome,
    isIOS,
    shouldRecommendChrome: isAndroid && !isAndroidChrome
  }
}

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.')
  
  event.waitUntil(
    clients.claim().then(() => {
      // Notificar todos os clientes sobre o browser
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          // Extrair user agent da requisição (não disponível diretamente no SW)
          // Enviar mensagem para o cliente verificar
          client.postMessage({
            type: 'CHECK_BROWSER',
            timestamp: Date.now()
          })
        })
      })
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

// Receber mensagens dos clientes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'BROWSER_INFO') {
    const browserInfo = detectBrowser(event.data.userAgent)
    
    console.log('Browser detected:', browserInfo)
    
    // Se deve recomendar Chrome, enviar mensagem de volta
    if (browserInfo.shouldRecommendChrome) {
      event.source.postMessage({
        type: 'RECOMMEND_CHROME',
        browserInfo: browserInfo,
        message: 'Para melhor experiência de instalação, abra este site no Google Chrome'
      })
    }
  }
  
  // Responder a solicitação de instalação
  if (event.data && event.data.type === 'REQUEST_INSTALL') {
    const browserInfo = detectBrowser(event.data.userAgent)
    
    if (browserInfo.shouldRecommendChrome) {
      // Enviar URL para abrir no Chrome
      const url = event.data.url || self.location.origin
      const cleanUrl = url.replace(/^https?:\/\//, '')
      const chromeIntent = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end;`
      
      event.source.postMessage({
        type: 'OPEN_IN_CHROME',
        chromeIntent: chromeIntent,
        fallbackUrl: `googlechrome://${cleanUrl}`
      })
    } else {
      // Permitir instalação normal
      event.source.postMessage({
        type: 'PROCEED_INSTALL'
      })
    }
  }
})
