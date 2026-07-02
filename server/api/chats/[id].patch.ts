import { ObjectId } from 'mongodb';
import { connectDB } from '~~/server/utils/db';

interface ChatDocument {
  _id?: ObjectId;
  userId: string;
  title: string;
  content: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

interface NitroError {
  statusCode?: number;
  statusMessage?: string;
}

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Access Denied',
    });
  }

  const chatId = getRouterParam(event, 'id');

  const body = await readBody<{ title: string }>(event);

  if (!chatId || !body || typeof body.title !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing chat ID or title',
    });
  }

  const trimmedTitle = body.title.trim();
  if (!trimmedTitle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Title cannot be empty or whitespace',
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

    const result = await db.collection<ChatDocument>('chats').updateOne(
      {
        _id: new ObjectId(chatId),
        userId: user.id,
      },
      {
        $set: {
          title: trimmedTitle.slice(0, 50),
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chat not found or access denied',
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error while renaming chat:', error);

    const nitroErr = error as NitroError;
    if (nitroErr.statusCode) throw error;

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not rename chat',
    });
  }
});
