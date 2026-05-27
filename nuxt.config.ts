// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: process.env.NODE_ENV === "development" },
  modules: [
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-security",
    "motion-v/nuxt",
    "@nuxt/eslint",
  ],
  srcDir: "app/",
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
    },
    langDir: "locales",
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "ru", language: "ru-RU", file: "ru.json" },
    ],
  },
  css: ["~/assets/css/main.css"],
  vite: {
    server: {
      watch: {
        ignored: ["**/node_modules/**"],
      },
    },
    build: {
      minify: "esbuild",
      sourcemap: false,
      rollupOptions: {
        output: {
          compact: true,
        },
      },
    },
  },
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { charset: "utf-8" },
      ],
    },
  },
  eslint: {
    config: {
      standalone: true,
    },
    checker: {
      fix: false,
    },
  },
  runtimeConfig: {
    aiApiKey: process.env.NUXT_AI_API_KEY,
    defaultAiModel: "gemini-2.5-flash",
  },
  routeRules: {
    "/api/**": {
      security: {
        rateLimiter: {
          tokensPerInterval: 5,
          interval: 60000,
        },
      },
    },
  },
  security: {
    enabled: process.env.NODE_ENV === "production",
    nonce: true,
    headers: {
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https:"],
        "script-src": [
          "'self'",
          "'nonce-{{nonce}}'",
          "'strict-dynamic'",
          "'wasm-unsafe-eval'",
        ],
      },
    },
    corsHandler: {
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000,
    },
  },
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
  },
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    minify: true,
  },
  icon: {
    serverBundle: {
      collections: ["lucide"],
    },
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },
});
