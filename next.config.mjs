import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {};

const pwaConfig = withPWA({
  dest: 'public',
});  

export default pwaConfig(nextConfig);
