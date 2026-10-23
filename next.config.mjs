/** @type {import('next').NextConfig} */
const nextConfig = {
  // EC2 (Misión EC2): servidor autónomo en .next/standalone.
  output: "standalone",
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Evitar caché en rutas dinámicas y fetches (datos siempre frescos)
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig
