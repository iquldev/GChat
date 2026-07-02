<template>
  <div>
    <AuthBlock :title="t('auth.title')" :providers="providers" @auth="onAuth" />
  </div>
</template>

<script setup lang="ts">
import { signIn } from '~/lib/auth-client';

definePageMeta({
  layout: 'blank',
});

const { t } = useI18n();

const onAuth = async (provider: string) => {
  const data = await signIn.social({
    provider,
    callbackURL: '/',
  });
  return data;
};

const providers = [
  {
    id: 'google',
    name: 'Google',
    logo: 'mdi:google',
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: 'mdi:github',
  },
];
</script>
