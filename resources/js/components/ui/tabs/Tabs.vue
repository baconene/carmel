<script setup lang="ts">
import { ref, computed, provide } from 'vue';

interface Props {
  defaultValue?: string;
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: '',
});

const modelValue = ref(props.value || props.defaultValue);

const state = computed(() => ({
  value: modelValue.value,
  setValue: (val: string) => {
    modelValue.value = val;
  },
}));

provide('tabs', state);
</script>

<template>
  <div class="w-full">
    <slot />
  </div>
</template>
