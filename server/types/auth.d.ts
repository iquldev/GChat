import type { auth } from '~~/server/lib/auth';

declare module 'h3' {
  interface H3EventContext {
    user?: typeof auth.$Infer.Session.user;
    session?: typeof auth.$Infer.Session.session;
  }
}
