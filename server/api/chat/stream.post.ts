import { z } from 'zod';
import { systemPrompt } from '~~/server/utils/prompts';
import type { OpenRouterMessage } from '~~/app/types/openrouter';

const chatSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).optional(),
  hasCustomSystemPrompt: z.boolean().optional(),
  content: z
    .array(
      z.object({
        role: z.enum(['user', 'model', 'assistant', 'system']),
        parts: z
          .array(
            z
              .object({
                text: z.string().optional(),
                inlineData: z
                  .object({
                    mimeType: z.string(),
                    data: z.string(),
                  })
                  .optional(),
              })
              .refine(
                (part) =>
                  part.text !== undefined || part.inlineData !== undefined,
                { message: 'Part must have either text or inlineData' },
              ),
          )
          .min(1),
      }),
    )
    .min(1),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const authHeader = getHeader(event, 'Authorization');
  const apiKey =
    authHeader ? authHeader.replace('Bearer ', '') : config.openrouterApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing OpenRouter API Key',
    });
  }

  const { content, model, temperature, max_tokens, hasCustomSystemPrompt } =
    await readValidatedBody(event, (body) => chatSchema.parse(body));

  const messages: OpenRouterMessage[] = [];

  if (!hasCustomSystemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt,
    });
  }

  for (const msg of content) {
    const role =
      msg.role === 'model' ? 'assistant'
      : msg.role === 'assistant' ? 'assistant'
      : msg.role === 'system' ? 'system'
      : 'user';

    const hasAttachments = msg.parts.some((p) => p.inlineData);

    if (hasAttachments) {
      const compiledContent = msg.parts.map((part) => {
        if (part.inlineData) {
          return {
            type: 'image_url' as const,
            image_url: {
              url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            },
          };
        }
        return {
          type: 'text' as const,
          text: part.text || '',
        };
      });
      messages.push({ role, content: compiledContent });
    } else {
      const textContent = msg.parts.map((p) => p.text || '').join('');
      messages.push({ role, content: textContent });
    }
  }

  const modelName = model || config.public.defaultAiModel || 'openrouter/free';

  const abortController = new AbortController();
  event.node.req.on('close', () => {
    abortController.abort();
  });

  let response: Response;
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/iquldev/GChat',
        'X-Title': 'GChat',
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        stream: true,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 2048,
        tools: [
          { type: 'openrouter:datetime' },
          { type: 'openrouter:web_fetch' },
        ],
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error Response:', errorText);

      if (response.status === 429) {
        throw createError({
          statusCode: 429,
          statusMessage: 'Rate limit exceeded',
        });
      }
      throw createError({
        statusCode: response.status,
        statusMessage: `OpenRouter error: ${response.statusText}`,
      });
    }
  } catch (e: unknown) {
    console.error('OpenRouter Fetch Error:', e);
    if (e && typeof e === 'object' && 'statusCode' in e) {
      throw e;
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'AI service unavailable',
    });
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }

      try {
        let emittedModel = false;
        while (true) {
          if (abortController.signal.aborted) {
            break;
          }

          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed === 'data: [DONE]') continue;

            if (trimmed.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));

                if (parsed.error) {
                  console.error('[stream] Model error chunk:', parsed.error);
                  controller.error(
                    new Error(parsed.error.message || 'Model stream error'),
                  );
                  return;
                }

                if (!emittedModel && parsed.model) {
                  const modelToken = `[MODEL:${parsed.model}]`;
                  controller.enqueue(new TextEncoder().encode(modelToken));
                  emittedModel = true;
                }

                const delta = parsed.choices?.[0]?.delta;

                if (!delta || (!delta.content && delta.content !== ''))
                  continue;

                const contentChunk = delta.content;

                if (!contentChunk) continue;

                const isSafetyMetadata =
                  /^(User|Model|Assistant)\s+Safety:\s+\w+\s*$/i.test(
                    contentChunk.trim(),
                  );
                if (isSafetyMetadata) {
                  console.warn(
                    '[stream] Filtered safety metadata chunk:',
                    JSON.stringify(contentChunk),
                  );
                  continue;
                }

                controller.enqueue(new TextEncoder().encode(contentChunk));
              } catch (err) {
                console.warn(
                  '[stream] Failed to parse SSE line:',
                  trimmed,
                  err,
                );
              }
            }
          }
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') {
          return;
        }
        controller.error(e);
        return;
      }
      controller.close();
    },
    cancel() {
      abortController.abort();
    },
  });

  return sendStream(event, stream);
});
