/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/hooks", "@repo/utils", "@repo/types"],
};

export default nextConfig;
