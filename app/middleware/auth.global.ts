import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { authClient } from '~/lib/auth-client';

export default defineNuxtRouteMiddleware(async (to) => {
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: useRequestHeaders(['cookie']) as Record<string, string>,
    },
  });

  const isAuthenticated = !!data?.session;

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
});
