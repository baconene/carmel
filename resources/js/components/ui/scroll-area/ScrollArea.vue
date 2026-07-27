<script setup lang="ts">
interface Props {
  orientation?: 'vertical' | 'horizontal';
}

withDefaults(defineProps<Props>(), {
  orientation: 'vertical',
});
</script>

<template>
  <div class="relative overflow-hidden">
    <div class="overflow-auto">
      <slot />
    </div>
  </div>
</template>
