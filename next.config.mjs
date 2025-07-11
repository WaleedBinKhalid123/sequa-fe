/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'seqouia-internal.sfo2.digitaloceanspaces.com',
      'seqouia-internal.sfo2.cdn.digitaloceanspaces.com'
    ],
  },
};

export default nextConfig;
