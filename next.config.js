/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ── Legacy /academic/* → working routes ──
      // Homepage CTAs: /academic/enroll, /academic/tutoring, /academic/ai-tools → /order
      {
        source: '/academic/enroll',
        destination: '/order',
        permanent: true,
      },
      {
        source: '/academic/tutoring',
        destination: '/order',
        permanent: true,
      },
      {
        source: '/academic/ai-tools',
        destination: '/order',
        permanent: true,
      },
      // Payment links: /academic/quote/:orderId → /pay/:orderId
      {
        source: '/academic/quote/:orderId',
        destination: '/pay/:orderId',
        permanent: true,
      },
      {
        source: '/academic/pay/:orderId',
        destination: '/pay/:orderId',
        permanent: true,
      },
      // Dashboard links: /academic/dashboard/:orderId → /dashboard/:orderId
      {
        source: '/academic/dashboard/:orderId',
        destination: '/dashboard/:orderId',
        permanent: true,
      },
      // Prep links: /academic/prep/:orderId → /dashboard/:orderId
      {
        source: '/academic/prep/:orderId',
        destination: '/dashboard/:orderId',
        permanent: true,
      },
      // Prep day links: /academic/prep/:orderId/day/:dayNum → /dashboard/:orderId
      {
        source: '/academic/prep/:orderId/day/:dayNum',
        destination: '/dashboard/:orderId',
        permanent: true,
      },
      // Catch-all: any other /academic/* → /order
      {
        source: '/academic/:path*',
        destination: '/order',
        permanent: false,
      },
    ];
  },
};
module.exports = nextConfig;
