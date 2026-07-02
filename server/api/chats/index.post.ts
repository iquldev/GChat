import { z } from 'zod';
import { connectDB } from '~~/server/utils/db';

const createChatSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(50),
  firstMessage: z.object({
    id: z.string().min(1),
    role: z.enum(['user', 'model', 'assistant', 'system']),
    parts: z
      .array(
        z.object({
          text: z.string().optional(),
          inlineData: z
            .object({
              mimeType: z.string(),
              data: z.string(),
            })
            .optional(),
        }),
      )
      .min(1),
    timestamp: z.string().optional(),
    model: z.string().optional(),
  }),
});

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Access Denied',
    });
  }

  const body = await readBody(event);

  const validationResult = createChatSchema.safeParse(body);
  if (!validationResult.success) {
    const errorMsg =
      validationResult.error.issues[0]?.message || 'Invalid payload';
    throw createError({
      statusCode: 400,
      statusMessage: `Bad Request: ${errorMsg}`,
    });
  }

  const { title, firstMessage } = validationResult.data;

  try {
    const { db } = await connectDB();

    const newChat = {
      userId: user.id,
      title: title.slice(0, 30),
      content: [
        {
          id: firstMessage.id,
          role: firstMessage.role,
          parts: firstMessage.parts,
          timestamp: firstMessage.timestamp || new Date().toISOString(),
          status: 'sent',
          model: firstMessage.model,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('chats').insertOne(newChat);

    return {
      id: result.insertedId.toString(),
      title: newChat.title,
      content: newChat.content,
    };
  } catch (error: unknown) {
    const err = error as { statusCode?: number };
    if (err.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not create chat',
    });
  }
});
