/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "res.cloudinary.com",
        ]
    },
    experimental: {
        appDir: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
}

export default nextConfig;