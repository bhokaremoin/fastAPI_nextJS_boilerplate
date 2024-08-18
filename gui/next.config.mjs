const localurl = process.env.NEXT_PUBLIC_DOCKER
    ? 'http://backend:8001/api/:path*'
    : 'http://0.0.0.0:8001/api/:path*';

let backendUrl = process.env.NEXT_PUBLIC_API_URL + '/api/:path*';

console.log("NEXT_PUBLIC_DOCKER", process.env.NEXT_PUBLIC_DOCKER)
console.log("LOCALURL", localurl)
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://backend:8001/api/:path*',
            },
        ];
    },
    images: {
        domains: [],
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    reactStrictMode: false,
    output: 'standalone',
};

export default nextConfig;
