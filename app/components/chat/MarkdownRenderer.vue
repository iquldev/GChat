<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    ref="contentRef"
    class="markdown-content"
    :class="{ 'is-streaming': isStreaming }"
    v-html="renderedMarkdown"
  />
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import markdownItTaskLists from 'markdown-it-task-lists';
import createDOMPurify, { type Config as DOMPurifyConfig } from 'dompurify';

const props = defineProps<{
  content: string;
  isStreaming?: boolean;
}>();

const contentRef = ref<HTMLElement | null>(null);

type HljsInstance = typeof import('highlight.js').default;

const _hljs = shallowRef<HljsInstance | null>(null);
let _hljsLoading = false;

async function ensureHljs(): Promise<void> {
  if (_hljs.value || _hljsLoading) return;
  _hljsLoading = true;
  try {
    const { default: hljs } = await import('highlight.js');
    _hljs.value = hljs;
  } catch (err) {
    console.error('[MarkdownContent] Failed to load highlight.js:', err);
    _hljsLoading = false;
  }
}

function buildCodeBlock(code: string, lang: string): string {
  const hljs = _hljs.value;
  let highlighted: string;
  let displayLang = lang || 'text';

  if (hljs) {
    if (lang && hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(code, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    } else {
      const result = hljs.highlightAuto(code);
      highlighted = result.value;
      if (!lang) displayLang = result.language ?? 'text';
    }
  } else {
    highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const encoded = encodeURIComponent(code);

  return (
    `<div class="code-block-wrapper">` +
    `<span class="code-block-lang">${displayLang}</span>` +
    `<button class="code-block-copy" data-code="${encoded}" title="Copy" aria-label="Copy code">` +
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon" aria-hidden="true">` +
    `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>` +
    `</svg>` +
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon" aria-hidden="true">` +
    `<polyline points="20 6 9 17 4 12"/>` +
    `</svg>` +
    `</button>` +
    `<pre class="hljs"><code class="language-${displayLang}">${highlighted}</code></pre>` +
    `</div>`
  );
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: buildCodeBlock,
});

md.use(markdownItLinkAttributes, {
  attrs: { target: '_blank', rel: 'noopener noreferrer' },
});

md.use(markdownItTaskLists, { enabled: true, label: true, labelAfter: true });

const purify = typeof window !== 'undefined' ? createDOMPurify(window) : null;

const PURIFY_CONFIG: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'blockquote',
    'div',
    'span',
    'strong',
    'b',
    'em',
    'i',
    's',
    'del',
    'u',
    'mark',
    'kbd',
    'sup',
    'sub',
    'small',
    'ul',
    'ol',
    'li',
    'pre',
    'code',
    'a',
    'img',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'td',
    'th',
    'label',
    'input', // task lists
    'button', // copy button
    'svg',
    'path',
    'polyline',
    'rect', // copy-button icons
  ],
  ALLOWED_ATTR: [
    'class',
    'id',
    'title',
    'aria-label',
    'aria-hidden',
    'href',
    'target',
    'rel',
    'src',
    'alt',
    'colspan',
    'rowspan',
    'align',
    'type',
    'checked',
    'disabled',
    'data-code',
    'viewBox',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'width',
    'height',
    'x',
    'y',
    'rx',
    'ry',
    'cx',
    'cy',
    'r',
    'd',
    'points',
  ],
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed', 'base'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  FORCE_BODY: false,
};

const renderedMarkdown = computed(() => {
  const raw = props.content?.trim();
  if (!raw) return '';

  let html = md.render(raw.replace(/\n{3,}/g, '\n\n'));

  html = html
    .replace(/<table>/g, '<div class="table-wrapper"><table>')
    .replace(/<\/table>/g, '</table></div>');

  html = html.replace(/<code[^>]*>\s*<\/code>/g, '');

  return purify ? purify.sanitize(html, PURIFY_CONFIG) : html;
});

function handleCopyClick(e: MouseEvent): void {
  const btn = (e.target as Element).closest<HTMLButtonElement>(
    '.code-block-copy',
  );
  if (!btn) return;

  const code = decodeURIComponent(btn.dataset.code ?? '');

  navigator.clipboard
    .writeText(code)
    .then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    })
    .catch((err) => console.error('Failed to copy code:', err));
}

onMounted(() => {
  contentRef.value?.addEventListener('click', handleCopyClick);
  ensureHljs();
});

onUnmounted(() => {
  contentRef.value?.removeEventListener('click', handleCopyClick);
});
</script>
