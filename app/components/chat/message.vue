<template>
  <div
    class="flex w-full px-2 md:px-4"
    :class="role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div
      class="flex gap-3 max-w-[95%] md:max-w-[80%]"
      :class="role === 'user' ? 'flex-row' : 'flex-row-reverse'"
    >
      <div
        class="flex flex-col gap-1 w-full"
        :class="role === 'user' ? 'items-end' : 'items-start'"
      >
        <div class="px-4 py-2 rounded-2xl bg-(--ui-sidebar-background)">
          <p
            class="text-base break-words whitespace-pre-wrap"
            :class="{ 'animate-text-shimmer': message.status === 'pending' }"
          >
            {{ message.content }}
          </p>
        </div>
        <div class="text-sm font-thin text-(--ui-text-second) opacity-70 px-1">
          <p>
            {{ sender }}, {{ formatDate(message.timestamp) }},
            <span :class="statusColor">{{ status }}</span>
          </p>
        </div>
      </div>
      <div
        class="hidden md:flex items-center justify-center h-10 w-10 rounded-full shrink-0 self-start"
        :class="
          role === 'user' ? 'bg-(--ui-user-avatar)' : 'bg-(--ui-ai-avatar)'
        "
      >
        <p class="text-(--ui-background) font-bold text-sm">{{ sender }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const role = computed(() => props.message.role);

const sender = computed(() => {
  if (role.value === "user") return "You";
  return "AI";
});

const status = computed(() => {
  if (props.message.status === "sent") return "✅";
  if (props.message.status === "pending") return "Pending...";
  if (props.message.status === "received") return props.message.model;
  if (props.message.status === "error") return "Error";
  return "";
});

const statusColor = computed(() => {
  if (props.message.status === "sent") return "text-(--ui-text-second)";
  if (props.message.status === "pending") return "text-(--ui-text-second)";
  if (props.message.status === "error") return "text-(--ui-error)";
  return "";
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
</script>
