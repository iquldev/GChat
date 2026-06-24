<template>
    <div
        class="fixed top-0 left-0 w-screen h-screen overflow-visible pointer-events-none -z-10 flex items-center justify-center"
    >
        <div
            class="relative w-full h-full opacity-20 dark:opacity-30 transition-opacity duration-500"
        >
            <div
                class="absolute left-[50%] top-[45%] -translate-x-1/2 -translate-y-1/2 w-150 h-80 bg-(--ui-blur-1) rounded-full mix-blend-multiply filter blur-[140px] animate-blob"
            />
            <div
                class="absolute left-[60%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-140 h-72 bg-(--ui-blur-2) rounded-full mix-blend-multiply filter blur-[140px] animate-blob animation-delay-2000"
            />
            <div
                class="absolute left-[40%] top-[60%] -translate-x-1/2 -translate-y-1/2 w-160 h-88 bg-(--ui-blur-3) rounded-full mix-blend-multiply filter blur-[140px] animate-blob animation-delay-4000"
            />
        </div>
    </div>
</template>

<style scoped>
.animate-blob {
    animation: blob 7s infinite alternate;
}

@keyframes blob {
    from {
        transform: translate(0px, 0px) scale(1);
    }
    to {
        transform: translate(30px, -50px) scale(1.1);
    }
}

@media (max-width: 768px) {
    .animate-blob {
        animation: blob-mobile 15s infinite alternate;
    }

    @keyframes blob-mobile {
        from {
            transform: translate(0px, 0px) scale(0.5);
        }
        to {
            transform: translate(15px, -25px) scale(0.6);
        }
    }
}
</style>
