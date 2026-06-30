export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api')) {
    return;
  }

  if (event.path.startsWith('/api/auth')) {
    return;
  }

  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Access Denied',
    });
  }
});
