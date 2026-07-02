import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import MarkdownContent from '~/components/chat/MarkdownContent.vue';

describe('MarkdownContent', () => {
  it('renders basic markdown', async () => {
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: '# Heading\n\n**Bold text**',
      },
    });
    const html = wrapper.html();
    expect(html).toContain('Heading');
    expect(html).toContain('Bold text');
  });

  it('sanitizes malicious script tags', async () => {
    const maliciousMsg = "Hello <script>alert('XSS')</script> world";
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: maliciousMsg,
      },
    });
    const html = wrapper.html();
    expect(html).not.toContain('<script>');
    expect(html).not.toContain("alert('XSS')");
    expect(html).toContain('Hello');
    expect(html).toContain('world');
  });

  it('sanitizes malicious event handlers', async () => {
    const maliciousMsg = 'Hello <img src="x" onerror="alert(\'XSS\')"> world';
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: maliciousMsg,
      },
    });
    const html = wrapper.html();
    const imgEl = wrapper.find('img');
    expect(imgEl.exists()).toBe(false);
    expect(html).toContain('Hello');
    expect(html).toContain('world');
  });

  it('preserves safe HTML tags when enabled in markdown-it', async () => {
    const messageWithSafeHtml = 'Hello <u>Underlined</u> world';
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: messageWithSafeHtml,
      },
    });
    const html = wrapper.html();
    expect(html).toContain('Underlined');
    expect(html).toContain('world');
  });
});
