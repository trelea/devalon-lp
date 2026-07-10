import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Devalon brand logos are local, trusted SVGs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
