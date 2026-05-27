<template>
    <div
        class="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-center justify-center"
    >
        <div
            class="relative w-full max-w-250 h-125 opacity-20 dark:opacity-30 transition-opacity duration-500"
        >
            <div
                class="absolute top-0 left-[10%] w-125 h-64 bg-(--ui-blur-1) rounded-full mix-blend-multiply filter blur-[100px] animate-blob"
            />
            <div
                class="absolute top-0 right-[10%] w-125 h-64 bg-(--ui-blur-2) rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"
            />
            <div
                class="absolute bottom-10 left-[20%] `w-150 h-72 bg-(--ui-blur-3) rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"
            />
        </div>
    </div>
</template>

<style scoped>
.animate-blob {
    /* Animation is defined in main.css, but we can override or add local tweaks if needed */
}
</style>
