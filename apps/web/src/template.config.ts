export const TEMPLATE_CONFIG = {
  app: {
    name: 'osaekwoon',
    displayName: '오색운',
    primaryColor: '#D4AF37',
  },
  dev: {
    host: 'localhost',
    port: 5173,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8787/api',
  },
} as const;
