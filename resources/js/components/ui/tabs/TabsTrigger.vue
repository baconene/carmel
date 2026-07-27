<script setup lang="ts">
import { inject, computed } from 'vue';

interface Props {
  value: string;
}

const props = defineProps<Props>();

const tabs = inject<any>('tabs');

const isActive = computed(() => tabs?.value?.value === props.value);

const handleClick = () => {
  if (tabs?.setValue) {
    tabs.setValue(props.value);
  }
};
</script>

<template>
  <button
    :data-state="isActive ? 'active' : 'inactive'"
    @click="handleClick"
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      isActive
        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50',
    ]"
  >
    <slot />
  </button>
</template>
