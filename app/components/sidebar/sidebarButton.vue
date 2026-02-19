<template>
  <button
    class="p-3 md:p-4 bg-(--ui-background) flex items-center justify-center w-fit rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all"
  >
    <Icon :name="icon" class="w-6 h-6 text-(--ui-text-second)" />
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>
