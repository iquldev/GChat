<template>
  <motion.div
    class="flex items-center px-4 py-2 rounded-full hover:cursor-pointer hover:opacity-50 transition-all border"
    :class="{
      'bg-(--ui-background) border-default': isSelected,
      'text-(--ui-text-second) border-transparent': !isSelected,
    }"
  >
    <p class="truncate">
      {{ title }}
    </p>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";

defineProps({
  title: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});
</script>
