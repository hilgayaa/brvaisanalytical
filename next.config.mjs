/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["via.placeholder.com", "images.unsplash.com", "res.cloudinary.com"]
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
