<template>
  <div>
    <AuthBlock
      :title="t('auth.title')"
      :providers="providers"
      :on-auth="onAuth"
    />
  </div>
</template>

<script setup lang="ts">
import { createAuthClient } from 'better-auth/vue';

definePageMeta({
  layout: 'blank',
});

const { t } = useI18n();

const authClient = createAuthClient();

const onAuth = async (provider: string) => {
  const data = await authClient.signIn.social({
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
