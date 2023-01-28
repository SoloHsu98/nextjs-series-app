/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  //for using with cloudinary image src and Next Image component
  images: {
    domains: ["res.cloudinary.com"],
  },
  // async redirects(){
  //   return [
  //     {
  //       source:'/home',
  //       destination:'home',
  //       permanent:true,
  //     }
  //   ]
  // }
};

module.exports = nextConfig;
