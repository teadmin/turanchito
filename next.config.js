/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'inmobiliariave.com',
      'via.placeholder.com',
      'picsum.photos',
      'unsplash.com',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  async redirects() {
    return [
      {
        source: '/casas-caracas',
        destination: '/vender-casa-en-caracas',
        permanent: true,
      },
      {
        source: '/apartamentos-caracas',
        destination: '/vender-apartamento-en-caracas',
        permanent: true,
      },
      {
        source: '/casas-maracay',
        destination: '/vender-casa-en-maracay',
        permanent: true,
      },
      {
        source: '/apartamentos-maracay',
        destination: '/vender-apartamento-en-maracay',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  compress: true,
  poweredByHeader: false,
  
  env: {
    CUSTOM_KEY: 'inmobiliaria-venezuela-app',
  },
}

module.exports = nextConfig