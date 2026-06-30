import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { client } from '../utils/db';

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  baseURL: process.env.NUXT_PUBLIC_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.NUXT_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET as string,
    },
  },
});
