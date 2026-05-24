import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trading Journal',
    short_name: 'Trading',
    description: 'Personal trade history & setup tracker',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#030712',
    icons: [{ src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  }
}
