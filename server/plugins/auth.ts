import { auth } from '~~/server/lib/auth';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    if (event.path.startsWith('/api/auth')) {
      return;
    }

    try {
      const session = await auth.api.getSession({
        headers: event.headers,
      });

      if (session) {
        event.context.session = session.session;
        event.context.user = session.user;
      }
    } catch (error: unknown) {
      console.error('Better Auth Nitro Plugin Error:', error);
    }
  });
});
