import type { NextConfig } from "next";

const rawOrigins = process.env.NEXT_PUBLIC_DEV_ORIGINS;
const devOrigins = rawOrigins
  ? rawOrigins.split(",").map((s) => s.trim()).filter(Boolean)
  : undefined;

const nextConfig: NextConfig = {
  /* HMR a partir da LAN: .env.local → NEXT_PUBLIC_DEV_ORIGINS=192.168.1.73 */
  ...(devOrigins?.length ? { allowedDevOrigins: devOrigins } : {}),
};

export default nextConfig;
