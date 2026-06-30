import type { IUser } from '~~/server/models/User';

declare module 'h3' {
  interface H3EventContext {
    user?: IUser;
  }
}
