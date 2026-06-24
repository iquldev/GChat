# Copilot instructions for GChat

Summary
- Purpose: help Copilot sessions understand how to build, test, lint, and navigate repository-specific architecture and conventions.
- Sources: README.md and AGENTS.md (architecture notes).

Build / Run / Test / Lint (commands)
- Install: bun install
- Dev: bun run dev
- Build: bun run build
- Preview prod build: bun run preview
- Prepare (postinstall): bun run postinstall (calls `nuxt prepare`)

Tests
- Run full unit/component suite (Vitest): bun run test  # runs `vitest run`
- Run a single Vitest file: bun run test -- path/to/spec.file.ts
- Run a single Vitest test by name: bun run test -- -t "test name"
- Playwright E2E suite: bun run test:e2e  # runs `playwright test`
- Run a single Playwright test: bun run test:e2e -- tests/example.spec.ts
- Run all tests: bun run test:all

Linting
- Project lint (ESLint): bun run lint  # runs `eslint .`
- Lint a single file: npx eslint path/to/file --fix

High-level architecture (big picture)
- Framework: Nuxt 4 with srcDir set to `app/` (see nuxt.config.ts). UI and app code live under `app/`.
- Server: Nitro server routes under `server/api/`. The main AI proxy endpoint is `server/api/chat/stream.post.ts` which validates with Zod and proxies streaming SSE to OpenRouter.
- Client state: Pinia stores in `app/stores/` (primary: `chat.ts`, `ui.ts`). Chat state persists via `useLocalStorage`.
- Streaming flow: client POSTs messages to `/api/chat/stream` (Accept: text/event-stream). Server forwards to OpenRouter `chat/completions` with stream=true and returns `text/event-stream`. Client reads ReadableStream chunks and updates UI incrementally.
- Config / secrets: runtime config keys in nuxt.config.ts: `openrouterApiKey` (env NUXT_OPENROUTER_API_KEY) and `public.defaultAiModel` (NUXT_DEFAULT_AI_MODEL).
- Security: `nuxt-security` is enabled (production), CSP nonce enabled, request size limits (2 MB body / 8 MB uploads) and a rate limiter on `/api/**` (5 requests / 60s).

Key repository conventions and patterns
- Source layout: core app code under `app/`, server endpoints under `server/`. Treat `app/` as repository root for editors / code search.
- Message payload shape (client ↔ server): the server Zod schema expects an object with `content` array where each item is { role: 'user'|'model'|'assistant'|'system', parts: [ { text?: string, inlineData?: { mimeType, data } } ] }.
  - Attachments: `inlineData` is base64 and is converted server-side to data:<mime>;base64,<data> and sent as `image_url` entries to OpenRouter.
  - hasCustomSystemPrompt: client sets this flag when it has already prepended a system prompt; server will only add default system prompt if this flag is false.
- Streaming semantics: server parses OpenRouter SSE (`data: ...` JSON with choices[0].delta.content) and filters out safety metadata chunks. Client and server assume incremental text chunks; aborts are handled with AbortController.
- Local persistence keys: Pinia + useLocalStorage keys include `gchat:chats` and `gchat:selectedChatId`. Clearing browser storage deletes all chats — useful for tests.
- Abort & retry flows: client store (`app/stores/chat.ts`) keeps an abort controller to stop generation; retryMessage reuses previous user message by finding the last user message before the failed AI message.
- Model naming: runtime public default `openrouter/free` fallback; client may pass model string to server which is forwarded to OpenRouter.

Files to consult for detailed behavior
- `nuxt.config.ts` — runtimeConfig, routeRules (rate limiting), security options
- `server/api/chat/stream.post.ts` — SSE proxy, Zod schema, error handling, streaming parsing
- `app/stores/chat.ts` — chat lifecycle, streaming client logic, localStorage usage
- `server/utils/prompts.ts` — default system prompt text
- `README.md` — quick start, commands, and testing examples
- `AGENTS.md` — developer-focused architecture notes (useful context)

AI assistants / Copilot tips
- Prefer editing files under `app/` for UI changes and `server/api/` for behavior that affects API/streaming.
- When modifying streaming code, update both `server/api/chat/stream.post.ts` and `app/stores/chat.ts` (client/server streaming parsing and chunk handling must remain compatible).
- Before changing runtime config keys, update `nuxt.config.ts` and README environment variables.

References
- README.md and AGENTS.md contain extra examples and architecture commentary.

---

Design system (tokens and rules)

Files to source tokens from:
- app/assets/css/colors.css (primary source of color tokens and dark/oled modes)
- app/assets/css/main.css (global typography, base font-size, animations, custom utilities)
- app/assets/css/markdown.css (heading sizes, line-height, code block paddings, table spacing)
- app/assets/css/disable-blur.css (reduced-motion / accessibility overrides)

Color tokens (use these CSS variables — do NOT hardcode hexes):
- --ui-background: #fdfdfd / dark #0a0a0a / oled #000000
- --ui-block-background: #f3f3f3 / dark #080808
- --ui-text-primary: #1a1a1a / dark #ffffff
- --ui-text-second: #666666 / dark #acacac
- --ui-primary: #666666 / dark #acacac
- --ui-primary-rgb: rgb(102,102,102) / dark rgb(172,172,172)
- --ui-error: #d32f2f / dark #ff5252
- --ui-border: rgba(0,0,0,0.06) / dark rgba(255,255,255,0.06)
- Code & UI extras: --ui-code-inline-bg, --ui-code-block-bg, --ui-code-pre-color, --ui-code-string, --ui-code-deletion, --ui-scrollbar-thumb, --ui-hr-border, --ui-backdrop-bg, etc.

Typography
- Base: html { font-size: 15px } and global font-family: "Geist", sans-serif (main) and "Geist Mono" for code.
- Line-height for prose: 1.7 (markdown.content)
- Headings: h1 1.75em, h2 1.5em, h3 1.25em, h4 1.1em, h5 1em, h6 0.9em; headings use font-weight:700 and line-height:1.3.
- Code blocks: font-size ~0.9–0.95em, line-height 1.6, monospace stack in markdown.css.

Spacing & layout tokens (observed values — prefer rems):
- Paragraph margin-bottom: 1rem
- Headings margin-top: 1.75rem; margin-bottom: 1rem
- List padding-left: 1.5rem
- Code block wrapper margin: 1.25rem; pre padding: 1.25–2.75rem
- Table cell padding: 0.5rem 0.75rem
- Small gaps: 0.25rem, 0.4rem where used for inline elements

Border radius and shapes
- Small: 2px (marks), 4px (kbd, blockquote rounded corner)
- Medium: 6px (code block wrapper, pre), 8px (images, details)
- Round: 9999px (circular copy button)

Animations & motion
- Easing and durations standardized in main.css utilities (fade, dropdown, modal, streamIn), prefer these utility classes (.animate-fade-in, .animate-dropdown-in, .animate-modal-in, .stream-enter-active). Respect prefers-reduced-motion flag and .disable-blur rules.

Components and where to change styles
- Sidebar: app/components/sidebar/* (Sidebar.vue, ChatList.vue, ChatListItem.vue, SidebarActions.vue, SidebarSearch.vue)
- Chat: app/components/chat/* (ChatMessage.vue, MessageContent.vue, MessageFooter.vue, MarkdownRenderer.vue)
- Compose: app/components/compose/* (MessageInput.vue, NewChatForm.vue, ModelSelector.vue, PromptExamplesPanel.vue)
- UI primitives: app/components/ui/* (IconButton.vue, Avatar.vue, Timestamp.vue)
- Homepage visuals: app/components/homepage/* (HomepageHero.vue)
- Settings UI: app/components/settings/* (SettingsModal.vue, SettingsSidebar.vue, SettingItem.vue)

Notes for agents:
- Put reusable primitives into app/components/ui/ and import them everywhere.
- When moving files, update explicit imports in pages and other components; Nuxt auto-registration may not pick up moved files immediately.
- Prefer composing ChatMessage from MessageContent + MessageFooter rather than inlining logic.
- Keep components single-responsibility: render, input, list-item, or primitive.
- Use kebab-case for named v-model bindings in templates: `v-model:active-category`.
- Avoid tuple-like SFC generics for defineEmits; use function-style typing instead.

Agent usage rules (enforceable guidance for Copilot / agents)
- Always use CSS variables from app/assets/css/colors.css for colors. If adding a new token, add it to colors.css in both :root and .dark sections.
- Use rem units consistent with existing CSS (base font-size 15px). Prefer rem/em for spacing and typography.
- Reuse existing utility classes in main.css (animations, custom-scrollbar, transition-layout) instead of adding ad-hoc animations.
- For components, prefer adding/adjusting CSS in the matching file under app/assets/css/ (or component-scoped <style> blocks) and expose new tokens via colors.css.
- When modifying streaming/UI states, keep visual feedback (status classes) consistent with ChatMessage.vue status values (pending/streaming/received/error).

How to compel the agent to use the design system in PRs
- Add (or modify) CSS variables only in app/assets/css/colors.css and include both :root and .dark variants.
- When generating components, include a small comment at top of the component file pointing to the token names used, e.g. /* Design tokens: --ui-primary, --ui-border, --ui-background */
- Prefer existing class names and utilities; if a new utility is needed, add it to app/assets/css/main.css under @layer utilities.

Where to look for examples
- See app/components/* for usage patterns and app/assets/css/* for token definitions and utilities.

---

(Generated by Copilot helper instructions.)
