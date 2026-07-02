import { auth } from '~~/server/lib/auth';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    if (
      event.path.startsWith('/api/auth') ||
      event.path.startsWith('/.nuxt/') ||
      event.path.startsWith('/_nuxt/') ||
      /\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot|ico|json)$/i.test(
        event.path,
      ) ||
      event.path === '/favicon.ico' ||
      event.path === '/sitemap.xml' ||
      event.path === '/robots.txt'
    ) {
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
