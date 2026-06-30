import { createAuthClient } from 'better-auth/vue';

export const authClient = createAuthClient({
  baseURL: process.env.NUXT_PUBLIC_AUTH_URL,
});
export const { signIn, signUp, signOut, useSession } = authClient;
