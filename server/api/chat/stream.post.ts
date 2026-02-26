import { GoogleGenAI } from "@google/genai";
import { Readable } from "node:stream";
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
            z.object({
              text: z.string().min(1),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

export default defineEventHandler(async (event) => {
  const apiKey = useRuntimeConfig().aiApiKey;
  if (!apiKey)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const { content, model } = await readValidatedBody(event, (body) =>
    chatSchema.parse(body),
  );

  const formattedContent = content.map((msg) => ({
    role: msg.role,
    parts: msg.parts.map((part) => ({ text: part.text })),
  }));

  const ai = new GoogleGenAI({ apiKey });
  const modelName = model || "gemini-2.5-flash";

  let response;
  try {
    const result = await ai.models.generateContentStream({
      model: modelName,
      config: {
        systemInstruction: systemPrompt,
      },
      contents: formattedContent,
    });
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

  const stream = new Readable({ read() {} });

  (async () => {
    try {
      for await (const chunk of response) {
        if (chunk.text) stream.push(chunk.text);
      }
      stream.push(null);
    } catch (e) {
      stream.destroy(e as Error);
    }
  })();
  return sendStream(event, stream);
});
