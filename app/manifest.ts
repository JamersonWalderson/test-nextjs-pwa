import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Teste PWA',
    short_name: 'TestPWA',
    description: 'Progressive Web App com instalação offline, notificações push e experiência nativa completa. Acesse rapidamente da sua tela inicial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/vercel.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    screenshots: [
      {
        src: '/img1.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Tela principal do app'
      },
      {
        src: '/img1.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Funcionalidades do PWA'
      },
      {
        src: '/img1.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Versão desktop'
      }
    ],
    related_applications: [
    {
      platform: "webapp",
      url: "manifest.json"
    }
  ]
  }
}
