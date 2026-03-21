import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Teste PWA',
    short_name: 'TestPWA',
    description: 'Aplicação Progressive Web App de teste',
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
  }
}
