<template>
  <input
    type="text"
    :placeholder="t('common.search')"
    class="w-full px-4 py-2 rounded-full bg-(--ui-background) outline-none border-none shrink-0"
    :value="searchQuery"
    @input="searchQuery = ($event.target as HTMLInputElement).value"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const searchQuery = defineModel("searchQuery", {
  type: String,
  required: true,
});
</script>
