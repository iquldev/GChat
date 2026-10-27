<div align="center" style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/cd8c7684-d5a6-42b9-906d-66e731752ff3" alt="GChat Screenshot" style="max-width: 100%; height: auto;" />

  <h1>GChat</h1>
  <p><strong>Open-source AI chat interface powered by Nuxt 4, OpenRouter, Better-Auth & MongoDB.</strong></p>
  
  <p>
    <a href="#-quick-start">Quick Start</a> ·
    <a href="#-features">Features</a> ·
    <a href="#-tech-stack">Tech Stack</a> ·
    <a href="#%EF%B8%8F-how-the-api-works">API Docs</a> ·
    <a href="#-security--limits">Security</a> ·
    <a href="https://github.com/iquldev/GChat/issues">Issues</a>
  </p>
  
  <p>
    <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white" alt="Nuxt 4" /></a>
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-1.2-fbf0df?logo=bun&logoColor=black" alt="Bun" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white" alt="MongoDB" /></a>
    <a href="https://www.better-auth.com/"><img src="https://img.shields.io/badge/Better--Auth-1.6-black" alt="Better Auth" /></a>
    <a href="https://openrouter.ai/"><img src="https://img.shields.io/badge/OpenRouter-API-blue" alt="OpenRouter" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" /></a>
  </p>
</div>


## ✨ Features

- 🌐 **OpenRouter API Integration**: Access hundreds of models (GPT-4o, Claude 3.5, Gemini 2.0, Llama 3, DeepSeek and more) through a single unified streaming API with built-in tools (`datetime`, `web_fetch`).
- ⚡ **Nuxt 4 Architecture**: Fast, lightweight, and modern reactive full-stack architecture running on Bun runtime.
- 🔐 **Authentication & Sessions**: Full user authentication powered by **Better-Auth** with social OAuth providers (GitHub & Google) and secure server-side session cookies.
- 💾 **Persistent Chat History**: Cloud synchronization per user stored in **MongoDB** — access your conversations from any device.
- 🎨 **Modern UI/UX**:
  - **Nuxt UI & Tailwind CSS 4**: Clean, accessible, and responsive interface.
  - **Motion-v**: Fluid animations and interactive transitions.
  - **Color Modes**: Full Dark, Light, and System theme support.
  - **Search**: Instant chat filtering in the sidebar.
- ⏹️ **Stop Generation**: Abort streaming responses in real time with an `AbortController`-backed stop button.
- 📝 **Rich Markdown Rendering**:
  - Code syntax highlighting with `highlight.js`.
  - Sanitized HTML output via `dompurify`.
  - GitHub-flavored task lists and link attributes.
- 🌍 **Multi-lingual (i18n)**: English and Russian language support with automatic locale detection.
- 📂 **Multimodal File Attachments**: Send images and files with automatic base64 conversion and preview.
- 🛡️ **Multi-Tier Security**:
  - Route-level rate limiting (5 req/min on `/api/**`, 30 req/min on `/api/auth/**`).
  - In-memory per-user sliding-window rate limit (100 requests / hour).
  - Strict Content Security Policy (CSP) with nonce generation.
  - Configurable CORS whitelist via environment variable.
  - Request body limits: 2 MB payload / 8 MB file upload.
- 🧪 **Comprehensive Testing**: Tested with **Vitest** (unit and component tests) and **Playwright** (end-to-end tests).

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.4+) or Node.js (v20.19+ / v22.12+)
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- An [OpenRouter API Key](https://openrouter.ai/keys)
- (Optional) OAuth credentials from GitHub and/or Google for social login

### Installation

```bash
git clone https://github.com/iquldev/GChat.git
cd GChat
bun install
```

### Configuration

Create a `.env` file in the root directory:

```env
# ==========================================
# Required: AI & Database
# ==========================================
NUXT_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
NUXT_MONGODB_URI=mongodb://localhost:27017/gchat

# ==========================================
# Required: Authentication (Better-Auth)
# ==========================================
# Generate a secret: openssl rand -base64 32
NUXT_BETTER_AUTH_SECRET=your-32-character-secret-key-here
# Public URL of your application (without trailing slash)
NUXT_PUBLIC_AUTH_URL=http://localhost:3000

# ==========================================
# Optional: Social OAuth Providers
# ==========================================
NUXT_GITHUB_CLIENT_ID=
NUXT_GITHUB_CLIENT_SECRET=
NUXT_GOOGLE_CLIENT_ID=
NUXT_GOOGLE_CLIENT_SECRET=

# ==========================================
# Optional: Application Settings
# ==========================================
# Default model if none specified (defaults to openrouter/free)
NUXT_DEFAULT_AI_MODEL=openrouter/auto

# Comma-separated list of allowed CORS origins in production
# Defaults to http://localhost:3000 in development
NUXT_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | [Nuxt 4](https://nuxt.com/) |
| **Runtime** | [Bun](https://bun.sh/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (`mongodb` driver) |
| **Authentication** | [Better-Auth](https://www.better-auth.com/) (MongoDB adapter + GitHub/Google OAuth) |
| **AI Integration** | [OpenRouter API](https://openrouter.ai/) (Server-Sent Events streaming) |
| **UI Components** | [@nuxt/ui](https://ui.nuxt.com/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| **State Management** | [Pinia](https://pinia.vuejs.org/) |
| **Animations** | [Motion-v](https://motion-v.com/) |
| **Markdown** | [markdown-it](https://github.com/markdown-it/markdown-it) + [highlight.js](https://highlightjs.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) |
| **Internationalization** | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (EN / RU) |
| **Security** | [nuxt-security](https://nuxt-security.vercel.app/) + Zod payload validation |
| **Testing** | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |

---

## 📁 Project Structure

```text
.
├── app/
│   ├── assets/          # Tailwind CSS 4, Markdown and color tokens
│   ├── components/      # Vue components (auth, chat, compose, sidebar, settings)
│   ├── layouts/         # Default application layout
│   ├── lib/             # Client-side libraries (auth-client.ts)
│   ├── locales/         # i18n dictionaries (en.json, ru.json)
│   ├── middleware/      # Client navigation guards
│   ├── pages/           # Pages: /, /login, /chat/[id]
│   ├── stores/          # Pinia stores: chat.ts, ui.ts
│   ├── types/           # TypeScript definitions (openrouter.ts, auth.ts)
│   └── utils/           # Client utilities and formatters
├── server/
│   ├── api/
│   │   ├── auth/        # Better-Auth catch-all handler ([...all].ts)
│   │   ├── chat/        # SSE streaming endpoint (stream.post.ts)
│   │   └── chats/       # REST endpoints: CRUD for user chats and messages
│   ├── lib/             # Server auth instance configuration (auth.ts)
│   ├── middleware/      # auth-guard.ts (protects /api/**)
│   ├── plugins/         # Nitro plugins (session hydration)
│   └── utils/           # MongoDB connection helper (db.ts) and system prompts
├── i18n/                # i18n configuration
├── nuxt.config.ts       # Nuxt 4 configuration, security rules & runtimeConfig
└── package.json
```

---

## ⚙️ How the API Works

### 1. Authentication (`/api/auth/**`)
All chat routes require an authenticated session. Better-Auth validates session cookies on every request through Nitro server middleware ([`server/middleware/auth-guard.ts`](file:///D:/Files/Projects/GChat/server/middleware/auth-guard.ts)).

### 2. Chat Persistence (`/api/chats`)
- `GET /api/chats` — Retrieves all chats belonging to the logged-in user, sorted by update date.
- `POST /api/chats` — Creates a new chat session with an initial message.
- `PATCH /api/chats/:id` — Renames or updates chat metadata.
- `DELETE /api/chats/:id` — Deletes a chat session.
- `POST /api/chats/:id/messages` — Appends user and assistant messages to a chat.

### 3. Real-Time Streaming (`/api/chat/stream`)
The server receives the conversation history, validates the payload with **Zod**, applies rate limiting, and establishes a Server-Sent Events (SSE) proxy stream to `https://openrouter.ai/api/v1/chat/completions`.

```bash
# Example streaming request (requires valid session cookie or Bearer token)
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -d '{
    "model": "google/gemini-2.0-flash-exp:free",
    "content": [
      {
        "role": "user",
        "parts": [{ "text": "Hello, how are you?" }]
      }
    ]
  }'
```

The response streams text chunks directly to the client. If the user stops generation, the client connection closes and Nitro triggers an `AbortController` signal to terminate the upstream OpenRouter request.

---

## 🔐 Security & Limits

| Parameter | Value | Details |
| --- | --- | --- |
| **API Rate Limit** | 5 requests / 60 sec | Applied to all `/api/**` endpoints |
| **Auth Rate Limit** | 30 requests / 60 sec | Dedicated limiter for `/api/auth/**` |
| **User AI Limit** | 100 requests / hour | In-memory sliding window per authenticated user |
| **Max Request Body** | 2 MB | Enforced by `nuxt-security` |
| **Max File Upload** | 8 MB | Max payload for image attachments |
| **Content Security Policy** | Nonce-based CSP | Active in production with strict script rules |
| **CORS** | Whitelist via `NUXT_ALLOWED_ORIGINS` | Strict origin checking in production |

---

## 🧪 Testing

```bash
# Run unit and component tests (Vitest)
bun run test

# Run end-to-end tests (Playwright)
bun run test:e2e

# Run all test suites
bun run test:all

# Lint codebase (ESLint)
bun run lint
```

---

## 📦 Production Deployment

```bash
# Build the production bundle
bun run build

# Preview the built application locally
bun run preview
```

Ensure MongoDB and all required environment variables (`NUXT_MONGODB_URI`, `NUXT_BETTER_AUTH_SECRET`, `NUXT_PUBLIC_AUTH_URL`, `NUXT_OPENROUTER_API_KEY`) are configured in your production environment.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
