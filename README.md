# 🤖 GChat

<img width="1920" height="1048" src="https://github.com/user-attachments/assets/ff37c925-d747-4c0e-b4eb-ce47426003dd" />

GChat is a modern, high-performance chat interface powered by **OpenRouter API**, giving you access to hundreds of AI models in one place. Built with **Nuxt 4**, it provides real-time streaming, multi-lingual support, and security out of the box.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Bun](https://img.shields.io/badge/Bun-1.2-fbf0df?logo=bun&logoColor=black)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🌐 **OpenRouter API Integration**: Access hundreds of models (GPT-4o, Claude, Gemini, Llama and more) through a single unified API.
- ⚡ **Nuxt 4 Architecture**: Leveraging the latest Nuxt features for speed and developer productivity.
- 🎨 **Modern UI/UX**:
  - **Nuxt UI & Tailwind CSS 4**: Clean, accessible, and responsive design.
  - **Motion-v**: Fluid animations and transitions.
  - **Animated background**: Dynamic visual effect on the home screen.
  - **Dark / Light / System themes**: Full color-mode support.
- ⏹️ **Stop Generation**: Abort streaming responses in real-time with a dedicated button.
- 📝 **Advanced Markdown**:
  - Full syntax support via `markdown-it`.
  - Syntax highlighting with `highlight.js`.
  - Sanitized output via `dompurify`.
  - Task lists and link attributes.
- 🌍 **Multi-lingual**: Full English and Russian support out of the box.
- 📂 **File Attachments**: Send images and files directly in conversations.
- 🔁 **Chat Management**: Retry messages, copy responses, rename and delete chats.
- ⌨️ **Enter to Send**: Send with Enter, new line with Shift+Enter. Full IME composition support.
- 🔐 **Secure by Default**:
  - Rate limiting: 5 requests per minute on `/api/**`.
  - Strict Content Security Policy (CSP) with nonce support.
  - Configurable CORS whitelist via environment variable.
  - Request size limits: 2 MB (body) / 8 MB (file uploads).
  - Powered by `nuxt-security`.
- 🧪 **Robust Testing**: Comprehensive coverage with **Vitest** (unit/component) and **Playwright** (E2E).

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.4+)
- Node.js (v20.19+ or v22.12+)
- An [OpenRouter API Key](https://openrouter.ai/keys)

### Installation

```bash
git clone https://github.com/iquldev/GChat.git
cd GChat
bun install
```

### Configuration

Create a `.env` file in the root directory:

```env
# Required
NUXT_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx

# Optional — default model if none selected (falls back to openrouter/free)
NUXT_DEFAULT_AI_MODEL=openrouter/auto

# Optional — comma-separated list of allowed CORS origins (production)
# If not set and NODE_ENV=production, all origins are blocked
# In development defaults to: http://localhost:3000
NUXT_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🛠 Tech Stack

| Category   | Technology                                                                    |
| ---------- | ----------------------------------------------------------------------------- |
| Framework  | [Nuxt 4](https://nuxt.com/)                                                   |
| Runtime    | [Bun](https://bun.sh/)                                                        |
| AI         | [OpenRouter API](https://openrouter.ai/) (SSE streaming)                      |
| UI Kit     | [@nuxt/ui](https://ui.nuxt.com/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| State      | [Pinia](https://pinia.vuejs.org/) + LocalStorage                              |
| Animations | [Motion-v](https://motion-v.com/)                                             |
| Markdown   | [markdown-it](https://github.com/markdown-it/markdown-it) + highlight.js      |
| i18n       | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (EN / RU)                            |
| Security   | [nuxt-security](https://nuxt-security.vercel.app/)                            |
| Validation | [Zod](https://zod.dev/)                                                       |
| Testing    | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)         |

---

## 📁 Project Structure

```text
.
├── app/
│   ├── assets/          # Global styles (Tailwind, Markdown, colors)
│   ├── components/      # Vue components (Chat, Sidebar, Settings, NewChat)
│   ├── locales/         # i18n translation files (en.json, ru.json)
│   ├── pages/           # Routes: / and /chat/[id]
│   ├── stores/          # Pinia state management: chat.ts, ui.ts
│   ├── types/           # TypeScript types (openrouter.ts, etc.)
│   └── utils/           # Helper functions and formatters
├── server/
│   ├── api/
│   │   └── chat/
│   │       └── stream.post.ts   # SSE proxy → OpenRouter
│   └── utils/
│       └── prompts.ts           # System prompt
├── i18n/                # i18n configuration
├── nuxt.config.ts       # Main Nuxt configuration
└── package.json
```

---

## ⚙️ How the API Works

The server accepts a POST request to `/api/chat/stream` with a message history and model name, validates the body with **Zod**, then proxies the request to `https://openrouter.ai/api/v1/chat/completions` in streaming mode (SSE). The client reads the stream via `ReadableStream` and updates the UI in real time. When the connection is closed, streaming is aborted via `AbortController`.

### File Attachment Support

Files are passed as `inlineData` (base64) and converted to the `image_url` format expected by OpenRouter.

---

## 🔐 Security

| Parameter        | Value                                |
| ---------------- | ------------------------------------ |
| Rate Limit       | 5 requests / 60 sec on `/api/**`     |
| Max request body | 2 MB                                 |
| Max file upload  | 8 MB                                 |
| CSP              | Enabled in production (nonce-based)  |
| CORS             | Whitelist via `NUXT_ALLOWED_ORIGINS` |
| Security module  | Enabled in `production` only         |

---

## 🧪 Testing

```bash
# Unit & Component tests
bun run test

# End-to-end tests (Playwright)
bun run test:e2e

# Run all tests
bun run test:all
```

---

## 📦 Production

```bash
# Build the project
bun run build

# Preview the production build
bun run preview
```

> ⚠️ **Note**: All chats are stored in the browser's `localStorage`. Clearing browser data will permanently delete all conversation history.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
