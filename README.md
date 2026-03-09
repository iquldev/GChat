# 🤖 GChat

<img width="1920" height="962" alt="изображение" src="https://github.com/user-attachments/assets/0ec2e5b6-07d1-4e3a-9474-f7d705e0d8f6" />

GChat is a modern, high-performance chat interface powered by **Google Gemini AI**. Built with **Nuxt 4**, it provides a seamless, multi-lingual, and secure experience for interacting with advanced language models.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.3-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Bun](https://img.shields.io/badge/Bun-1.2-fbf0df?logo=bun&logoColor=black)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🧠 **Gemini AI Integration**: Direct integration with Google's Generative AI via `@google/genai`.
- ⚡ **Nuxt 4 Architecture**: Leveraging the latest Nuxt features for speed and developer productivity.
- 🎨 **Modern UI/UX**:
    - **Nuxt UI & Tailwind CSS 4**: Clean, accessible, and responsive design.
    - **Motion-v**: Fluid animations and transitions.
    - **Dark/Light/System Themes**: Full color-mode support.
- 📝 **Advanced Markdown**: 
    - Full syntax support via `markdown-it`.
    - Syntax highlighting with `highlight.js`.
    - Sanitized output via `dompurify`.
    - Task lists and link attributes.
- 🌍 **Multi-lingual**: Full English and Russian support out of the box.
- 📂 **Attachments**: Support for file attachments in conversations.
- 🔐 **Secure by Default**:
    - Rate limiting and request size management.
    - Strict Content Security Policy (CSP).
    - Powered by `nuxt-security`.
- 🧪 **Robust Testing**: Comprehensive coverage with **Vitest** (unit/component) and **Playwright** (E2E).

---

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (v1.2.4 or higher)
- Node.js (v20+ or v22+)
- A Google Gemini API Key (Get it at [Google AI Studio](https://aistudio.google.com/))

### Installation
```bash
# Clone the repository
git clone https://github.com/iquldev/GChat.git
cd GChat

# Install dependencies
bun install
```

### Configuration
Create a `.env` file in the root directory:
```env
NUXT_AI_API_KEY=your_gemini_api_key_here
```

### Development
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🛠 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/)
- **Runtime**: [Bun](https://bun.sh/)
- **UI Kit**: [@nuxt/ui](https://ui.nuxt.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State**: [Pinia](https://pinia.vuejs.org/)
- **Animations**: [Motion-v](https://motion-v.com/)
- **i18n**: [@nuxtjs/i18n](https://i18n.nuxtjs.org/)
- **Security**: [Nuxt Security](https://nuxt-security.vercel.app/)

---

## 🧪 Testing

GChat follows a rigorous testing strategy to ensure stability.

```bash
# Run all tests (Unit + E2E)
bun run test:all

# Run Vitest unit & component tests
bun run test

# Run Playwright end-to-end tests
bun run test:e2e
```

---

## 📦 Production

Build the application for optimal performance:

```bash
# Build the project
bun run build

# Preview the production build
bun run preview
```

---

## 📁 Project Structure

```text
app/
├── assets/          # Global styles (Tailwind, Markdown, Colors)
├── components/      # Vue components (Chat, Sidebar, Settings)
├── locales/         # i18n translation files (EN, RU)
├── pages/           # Application routes
├── stores/          # Pinia state management (Chat, UI)
└── utils/           # Helper functions and formatters
server/
└── api/             # Server-side API endpoints (Gemini proxy)
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
