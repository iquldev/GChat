# 🤖 GChat

<img width="1920" height="1048" alt="Screenshot From 2026-06-24 13-39-11" src="https://github.com/user-attachments/assets/cd8c7684-d5a6-42b9-906d-66e731752ff3" />

GChat is a modern, high-performance chat interface powered by **OpenRouter API**, giving you access to hundreds of AI models in one place. Built with **Nuxt 4**, it provides real-time streaming, multi-lingual support, and security out of the box.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Bun](https://img.shields.io/badge/Bun-1.2-fbf0df?logo=bun&logoColor=black)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🌐 **OpenRouter API Integration**: Access hundreds of models (GPT-4o, Claude, Gemini, Llama and more) through a single unified API.
- ⚡ **Nuxt 4 Architecture**: Leveraging the latest Nuxt features for speed and developer productivity.
- 🎨 **Modern UI/UX**:
  - **Nuxt UI & Tailwind CSS 4**: Clean, accessible, and responsive design.
  - **Motion-v**: Fluid animations, transitions, and page layout animations.
  - **Animated background**: Dynamic visual effect on the home screen.
  - **Dark / Light / System themes**: Full color-mode support including OLED mode.
  - **Animated page transitions**: LayoutGroup + AnimatePresence for smooth navigation.
- 🔐 **Authentication**: Google & GitHub OAuth via Better Auth with session management.
- 🗄️ **MongoDB Persistence**: Chats stored in MongoDB — available across sessions and devices.
- ⏹️ **Stop Generation**: Abort streaming responses in real-time with a dedicated button.
- 📝 **Advanced Markdown**:
  - Full syntax support via `markdown-it`.
  - Syntax highlighting with `highlight.js`.
  - Sanitized output via `dompurify`.
  - Task lists and link attributes.
- 🌍 **Multi-lingual**: Full English and Russian support out of the box.
- 📂 **File Attachments**: Send images and files directly in conversations.
- 🔁 **Chat Management**: Retry messages, copy responses, rename, search, and delete chats.
- ⚙️ **Rich Settings**: Temperature, max tokens, custom system prompt, personal API key, OLED theme, sound notifications, export/import history.
- 💡 **Prompt Examples**: Quick-start panel on the homepage.
- ⌨️ **Enter to Send**: Send with Enter, new line with Shift+Enter. Full IME composition support.
- 🔐 **Secure by Default**:
  - Rate limiting: 5 req/min on `/api/**` and 30 req/min on `/api/auth/**`.
  - Auth guard middleware — all API routes require a valid session.
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
NUXT_BETTER_AUTH_SECRET=your-secret-here
NUXT_MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/

# Optional — default model if none selected (falls back to openrouter/free)
NUXT_DEFAULT_AI_MODEL=openrouter/auto

# Optional — OAuth providers (at least one required for login)
NUXT_GOOGLE_CLIENT_ID=...
NUXT_GOOGLE_CLIENT_SECRET=...
NUXT_GITHUB_CLIENT_ID=...
NUXT_GITHUB_CLIENT_SECRET=...

# Optional — auth URL (defaults to http://localhost:3000 in dev)
NUXT_PUBLIC_AUTH_URL=https://your-domain.com

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

| Category   | Technology                                                                           |
| ---------- | ------------------------------------------------------------------------------------ |
| Framework  | [Nuxt 4.4](https://nuxt.com/) + [Vite 7](https://vite.dev/)                         |
| Runtime    | [Bun](https://bun.sh/)                                                               |
| AI         | [OpenRouter API](https://openrouter.ai/) (SSE streaming)                             |
| UI Kit     | [@nuxt/ui](https://ui.nuxt.com/) + [Tailwind CSS 4](https://tailwindcss.com/)        |
| State      | [Pinia 3](https://pinia.vuejs.org/) + Cookies                                        |
| Auth       | [Better Auth](https://better-auth.com/) (Google, GitHub OAuth)                       |
| Database   | [MongoDB](https://mongodb.com/)                                                      |
| Animations | [Motion-v](https://motion-v.com/)                                                    |
| Markdown   | [markdown-it](https://github.com/markdown-it/markdown-it) + highlight.js             |
| i18n       | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (EN / RU)                                   |
| Icons      | [Lucide](https://lucide.dev/) (@iconify-json/lucide)                                 |
| Fonts      | [@nuxt/fonts](https://fonts.nuxt.com/)                                               |
| Security   | [nuxt-security](https://nuxt-security.vercel.app/)                                   |
| Validation | [Zod 4](https://zod.dev/)                                                            |
| Testing    | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)                |

---

## 📁 Project Structure

```text
.
├── app/
│   ├── assets/css/          # Global styles: main.css, colors.css, markdown.css, disable-blur.css
│   ├── components/
│   │   ├── auth/            # AuthBlock, AuthButton
│   │   ├── chat/            # ChatMessage, MarkdownContent, MarkdownRenderer, MessageContent, MessageFooter
│   │   ├── compose/         # MessageInput, ModelSelector, NewChatForm, PromptExamplesPanel
│   │   ├── homepage/        # HomepageBackground, HomepageHero
│   │   ├── settings/        # SettingItem, SettingsModal, SettingsSidebar
│   │   ├── sidebar/         # Sidebar, ChatList, ChatListItem, SidebarActions, SidebarSearch
│   │   └── ui/              # Avatar, IconButton, Timestamp
│   ├── layouts/             # default.vue (sidebar + settings modal), blank.vue (login)
│   ├── lib/                 # Better Auth client
│   ├── locales/             # i18n: en.json, ru.json
│   ├── middleware/          # Global auth guard (redirects unauthenticated users)
│   ├── pages/               # /, /login, /chat/[id]
│   ├── stores/              # chat.ts (chats, streaming), ui.ts (preferences)
│   ├── types/               # OpenRouter, Auth types + module declarations
│   ├── utils/               # Date formatters
│   └── test/                # Nuxt component tests, unit tests, E2E specs
├── server/
│   ├── api/
│   │   ├── auth/[...all].ts          # Better Auth handler
│   │   ├── chat/stream.post.ts       # SSE proxy → OpenRouter
│   │   └── chats/                    # CRUD: GET, POST, DELETE, PATCH + messages
│   ├── lib/                # Better Auth server config (MongoDB adapter)
│   ├── middleware/         # API auth guard (blocks unauthenticated requests)
│   ├── plugins/            # Session injection on every request
│   ├── types/              # H3EventContext augmentation
│   └── utils/              # db.ts (MongoDB), prompts.ts (system prompt)
├── i18n/                   # Locale files (en.json, ru.json)
├── nuxt.config.ts          # Nuxt configuration
└── package.json
```

---

## ⚙️ How the API Works

### Authentication

Better Auth handles sessions via its catch-all handler at `/api/auth/[...all]`. Users authenticate through Google or GitHub OAuth. A global auth middleware redirects unauthenticated visitors to `/login`, and a server middleware guards all `/api/**` routes (except `/api/auth/**`).

### Chats (CRUD)

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/chats`              | List user's chats    |
| POST   | `/api/chats`              | Create a new chat    |
| PATCH  | `/api/chats/[id]`         | Rename a chat        |
| DELETE | `/api/chats/[id]`         | Delete a chat        |
| POST   | `/api/chats/[id]/messages`| Append a message     |

All chat data is persisted in MongoDB with user ownership enforced server-side.

### Streaming (AI)

`POST /api/chat/stream` accepts a message history and model configuration, validates the body with Zod, then proxies the request to OpenRouter's SSE endpoint. The client reads the stream via `ReadableStream` and updates the UI in real time. Key features:

- **Authentication**: Session-based (Better Auth) or `Authorization` header fallback
- **OpenRouter Tools**: Includes `openrouter:datetime` and `openrouter:web_fetch`
- **Custom system prompts**: User-defined prompts override the default
- **User API keys**: Clients can supply their own OpenRouter key
- **Rate limiting**: 100 requests/hour per user (in-memory)
- **Abort**: Client disconnect stops generation via `AbortController`
- **File Attachments**: Sent as `inlineData` (base64), converted to `image_url` format

---

## 🔐 Security

| Parameter          | Value                                     |
| ------------------ | ----------------------------------------- |
| Rate Limit (API)   | 5 requests / 60 sec on `/api/**`          |
| Rate Limit (Auth)  | 30 requests / 60 sec on `/api/auth/**`    |
| Auth Guard         | All `/api/**` (except auth) require session |
| Request size       | 2 MB body / 8 MB uploads                  |
| CSP                | Enabled in production (nonce-based)       |
| CORS               | Whitelist via `NUXT_ALLOWED_ORIGINS`      |
| Security module    | Enabled in `production` only              |

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

> ⚠️ **Note**: Chats are persisted in MongoDB. UI preferences (theme, model, temperature, etc.) are stored in cookies. Clearing browser data will reset your preferences but not your conversation history.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
