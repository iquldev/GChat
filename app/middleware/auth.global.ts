/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { authClient } from '~/lib/auth-client';

let cachedSession: any = null;
let sessionFetchPromise: Promise<any> | null = null;

export default defineNuxtRouteMiddleware(async (to) => {
  if (cachedSession !== null) {
    const isAuthenticated = !!cachedSession?.session;
    if (!isAuthenticated && to.path !== '/login') {
      return navigateTo('/login');
    }
    if (isAuthenticated && to.path === '/login') {
      return navigateTo('/');
    }
    return;
  }

  if (!sessionFetchPromise) {
    sessionFetchPromise = authClient
      .getSession({
        fetchOptions: {
          headers: useRequestHeaders(['cookie']) as Record<string, string>,
        },
      })
      .then((res) => {
        cachedSession = res.data;
        return res.data;
      })
      .finally(() => {
        sessionFetchPromise = null;
      });
  }

  const result = await sessionFetchPromise;
  const session = result?.session;
  const isAuthenticated = !!session;

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
});
