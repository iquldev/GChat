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
import createDOMPurify from 'dompurify';
import hljs from 'highlight.js';

const props = defineProps<{
  content: string;
  isStreaming?: boolean;
}>();

const contentRef = ref<HTMLElement | null>(null);

const copyMap = new Map<string, string>();

function registerCode(code: string): string {
  const id = `cp-${Math.random().toString(36).slice(2, 10)}`;
  copyMap.set(id, code);
  return id;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight(code: string, lang?: string) {
    const resolvedLang = lang && hljs.getLanguage(lang) ? lang : undefined;

    const highlighted =
      resolvedLang ?
        hljs.highlight(code, {
          language: resolvedLang,
          ignoreIllegals: true,
        }).value
      : escapeHtml(code);

    const displayLang = resolvedLang ?? (lang || 'text');
    const copyId = registerCode(code);

    return (
      `<div class="code-block-wrapper">` +
      `<div class="code-block-header">` +
      `<span class="code-block-lang">${escapeHtml(displayLang)}</span>` +
      `<button class="code-block-copy" data-copy-id="${copyId}" title="Copy code" type="button">` +
      `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
      `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>` +
      `<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>` +
      `</svg>` +
      `<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
      `<polyline points="20 6 9 17 4 12"/>` +
      `</svg>` +
      `</button>` +
      `</div>` +
      `<pre class="hljs"><code class="language-${escapeHtml(displayLang)}">${highlighted}</code></pre>` +
      `</div>`
    );
  },
});

md.use(markdownItLinkAttributes, {
  matcher(href: string) {
    return /^https?:\/\//i.test(href);
  },
  attrs: {
    target: '_blank',
    rel: 'noopener noreferrer',
  },
});

md.use(markdownItTaskLists, {
  enabled: true,
  label: true,
  labelAfter: true,
});

let purify: ReturnType<typeof createDOMPurify> | null = null;

function getPurify() {
  if (!purify && typeof window !== 'undefined') {
    purify = createDOMPurify(window);
  }
  return purify;
}

const PURIFY_CONFIG: Parameters<
  ReturnType<typeof createDOMPurify>['sanitize']
>[1] = {
  ALLOWED_TAGS: [
    // Headings
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    // Text
    'p',
    'strong',
    'em',
    'u',
    's',
    'del',
    'ins',
    'mark',
    'small',
    'sup',
    'sub',
    'abbr',
    'kbd',
    'q',
    'cite',
    'blockquote',
    // Lists
    'ul',
    'ol',
    'li',
    // Code
    'pre',
    'code',
    // Structure
    'div',
    'span',
    'hr',
    'br',
    // Links & media
    'a',
    'img',
    // Tables
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'td',
    'th',
    'caption',
    // Task lists
    'label',
    'input',
    // Buttons (copy)
    'button',
    // SVG (copy icons)
    'svg',
    'path',
    'polyline',
    'rect',
    'circle',
    'line',
    // Details/summary (optional collapsibles in AI output)
    'details',
    'summary',
  ],
  ALLOWED_ATTR: [
    // Universal
    'class',
    'id',
    'title',
    'aria-hidden',
    'aria-label',
    'role',
    // Links
    'href',
    'target',
    'rel',
    // Images
    'src',
    'alt',
    'width',
    'height',
    'loading',
    // Tables
    'colspan',
    'rowspan',
    'scope',
    'align',
    // Task-list checkboxes
    'type',
    'checked',
    'disabled',
    // Copy button
    'data-copy-id',
    // SVG
    'xmlns',
    'viewBox',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'd',
    'points',
    'x',
    'y',
    'rx',
    'ry',
    'x1',
    'y1',
    'x2',
    'y2',
    'cx',
    'cy',
    'r',
  ],
  ALLOW_DATA_ATTR: false,
  FORCE_BODY: false,
};

const renderedMarkdown = computed(() => {
  const rawContent = props.content || '';
  if (!rawContent.trim()) return '';

  copyMap.clear();

  const normalizedContent = rawContent.replace(/\n{3,}/g, '\n\n');

  let html = md.render(normalizedContent);

  html = html
    .replace(/<table>/g, '<div class="table-wrapper"><table>')
    .replace(/<\/table>/g, '</table></div>');

  html = html.replace(/<code[^>]*>\s*<\/code>/g, '');

  const instance = getPurify();
  if (!instance) {
    return html;
  }

  return instance.sanitize(html, PURIFY_CONFIG);
});

function handleCopyClick(e: MouseEvent) {
  const btn = (e.target as Element).closest<HTMLButtonElement>(
    '.code-block-copy',
  );
  if (!btn) return;

  const copyId = btn.dataset.copyId ?? '';
  const code = copyMap.get(copyId);
  if (code === undefined) return;

  navigator.clipboard
    .writeText(code)
    .then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    })
    .catch((err) => {
      console.error('Failed to copy code:', err);
    });
}

onMounted(() => {
  contentRef.value?.addEventListener('click', handleCopyClick);
});

onUnmounted(() => {
  contentRef.value?.removeEventListener('click', handleCopyClick);
  copyMap.clear();
});
</script>
