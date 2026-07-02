import type { ChatMessage } from '~/types/openrouter';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

interface NitroError {
  statusCode?: number;
  statusMessage?: string;
}

const chatMessageSchema = z.object({
  id: z.string().min(1, 'Message ID cannot be empty'),
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
    .min(1, 'Message must have at least one part'),
  timestamp: z.string().optional(),
  status: z
    .enum(['sent', 'received', 'pending', 'streaming', 'error'])
    .optional(),
  model: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Access Denied',
    });
  }

  const chatId = getRouterParam(event, 'id');
  if (!chatId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing chat ID',
    });
  }

  const body = await readBody<{ message: ChatMessage }>(event);
  if (!body || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing message object',
    });
  }

  const validationResult = chatMessageSchema.safeParse(body.message);
  if (!validationResult.success) {
    const errorMsg =
      validationResult.error.issues[0]?.message || 'Invalid message format';
    throw createError({
      statusCode: 400,
      statusMessage: `Bad Request: ${errorMsg}`,
    });
  }

  try {
    if (!ObjectId.isValid(chatId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Invalid Chat ID format',
      });
    }

    const { db } = await connectDB();

    const clientMessage = validationResult.data;
    const cleanMessage = {
      id: clientMessage.id,
      role: clientMessage.role,
      parts: clientMessage.parts,
      timestamp: clientMessage.timestamp || new Date().toISOString(),
      status:
        clientMessage.status ||
        (clientMessage.role === 'user' ? 'sent' : 'received'),
      model: clientMessage.model,
    };

    const result = await db.collection('chats').updateOne(
      {
        _id: new ObjectId(chatId),
        userId: user.id,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        $push: { content: cleanMessage } as any,
        $set: { updatedAt: new Date() },
      },
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chat not found or access denied',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Backend error while saving message:', error);
    if ((error as NitroError).statusCode) throw error;

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not save message',
    });
  }
});
