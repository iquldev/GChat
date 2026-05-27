import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { systemPrompt } from "~~/server/utils/prompts";

const chatSchema = z.object({
  model: z.string().optional(),
  content: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
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
                { message: "Part must have either text or inlineData" },
              ),
          )
          .min(1),
      }),
    )
    .min(1),
});
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.aiApiKey;
  if (!apiKey)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const { content, model } = await readValidatedBody(event, (body) =>
    chatSchema.parse(body),
  );

  const formattedContent = content.map((msg) => ({
    role: msg.role,
    parts: msg.parts.map((part) => {
      const result: { text?: string; inlineData?: typeof part.inlineData } = {};
      if (part.inlineData) result.inlineData = part.inlineData;
      if (part.text) result.text = part.text;
      if (Object.keys(result).length === 0) result.text = "";
      return result;
    }),
  }));

  const ai = new GoogleGenAI({ apiKey });
  const modelName = model || config.defaultAiModel || "gemini-2.5-flash";

  const abortController = new AbortController();
  event.node.req.on("close", () => {
    abortController.abort();
  });

  let response;
  try {
    const result = await ai.models.generateContentStream(
      {
        model: modelName,
        config: {
          systemInstruction: systemPrompt,
        },
        contents: formattedContent,
      },
      {
        signal: abortController.signal,
      },
    );
    response = result;
  } catch (e: unknown) {
    console.error("Gemini API Error:", e);

    const err = e as { status?: number; message?: string };

    if (err?.status === 429)
      throw createError({
        statusCode: 429,
        statusMessage: "Rate limit exceeded",
      });
    if (err?.status === 400 && err?.message?.includes("location"))
      throw createError({
        statusCode: 400,
        statusMessage: "Location not supported",
      });

    throw createError({
      statusCode: 502,
      statusMessage: "AI service unavailable",
    });
  }

  setResponseHeaders(event, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          if (abortController.signal.aborted) {
            break;
          }
          if (chunk.text) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") {
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
