interface NextConfig {
  reactStrictMode?: boolean;
  images?: {
    domains?: string[];
    remotePatterns?: Array<{
      protocol?: 'http' | 'https';
      hostname: string;
      port?: string;
      pathname?: string;
    }>;
  };
  experimental?: Record<string, unknown>;
  [key: string]: unknown;
}

declare const config: NextConfig;
export default config;
export { NextConfig };