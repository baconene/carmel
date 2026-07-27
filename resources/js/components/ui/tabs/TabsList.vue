<script setup lang="ts">
import { inject, computed } from 'vue';

const tabs = inject<any>('tabs');
</script>

<template>
  <div
    role="tablist"
    class="inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
  >
    <slot />
  </div>
</template>
