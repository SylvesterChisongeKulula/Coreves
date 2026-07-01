<template>
  <div class="flex min-h-screen flex-col bg-canvas">
    <TheAnnouncementBar />
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
