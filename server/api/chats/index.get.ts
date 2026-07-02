export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Access Denied',
    });
  }

  try {
    const { db } = await connectDB();

    const rawChats = await db
      .collection('chats')
      .find({ userId: user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    return rawChats.map((chat) => ({
      id: chat._id.toString(),
      title: chat.title,
      content: chat.content || [],
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch chats',
    });
  }
});
