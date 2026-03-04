<template>
  <div class="border border-default rounded-full">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="t('common.search')"
      class="w-full px-4 py-2 rounded-full bg-(--ui-background) outline-none border-none shrink-0"
    />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const searchQuery = defineModel<string>("searchQuery", {
  required: true,
});
</script>
