<template>
  <div
    class="bg-(--ui-background) h-screen w-full flex items-center justify-center overflow-hidden relative"
  >
    <HomepageBackground class="absolute w-full z-0" />
    <div class="z-10">
      <slot />
    </div>
  </div>
</template>
