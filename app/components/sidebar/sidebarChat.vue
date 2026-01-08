<template>
  <motion.div
    class="flex items-center px-4 py-2 rounded-full hover:cursor-pointer hover:opacity-50 transition-all"
    :class="{
      'bg-(--ui-background)': isSelected,
      'text-(--ui-text-second)': !isSelected,
    }"
  >
    <p class="truncate">
      {{ title }}
    </p>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";

const props = defineProps({
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
