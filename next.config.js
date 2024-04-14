/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["monaco-editor"],
  images: {
    domains: [
      "cdn.jsdelivr.net",
      "avatars.githubusercontent.com",
      "github.com",
      "raw.githubusercontent.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
