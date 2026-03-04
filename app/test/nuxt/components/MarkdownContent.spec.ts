import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import MarkdownContent from "~/components/chat/MarkdownContent.vue";

describe("MarkdownContent", () => {
  it("renders basic markdown", async () => {
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: "# Heading\n\n**Bold text**",
      },
    });
    const html = wrapper.html();
    expect(html).toContain("<h1>Heading</h1>");
    expect(html).toContain("<strong>Bold text</strong>");
  });

  it("sanitizes malicious script tags", async () => {
    const maliciousMsg = "Hello <script>alert('XSS')</script> world";
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: maliciousMsg,
      },
    });
    const html = wrapper.html();
    expect(html).toContain("Hello world");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert('XSS')");
  });

  it("sanitizes malicious event handlers", async () => {
    const maliciousMsg = 'Hello <img src="x" onerror="alert(\'XSS\')"> world';
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: maliciousMsg,
      },
    });
    const html = wrapper.html();
    expect(html).toContain('<img src="x">');
    expect(html).not.toContain("onerror");
  });

  it("preserves safe HTML tags when enabled in markdown-it", async () => {
    const messageWithSafeHtml = "Hello <u>Underlined</u> world";
    const wrapper = await mountSuspended(MarkdownContent, {
      props: {
        content: messageWithSafeHtml,
      },
    });
    const html = wrapper.html();
    expect(html).toContain("<u>Underlined</u>");
  });
});
