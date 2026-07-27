<script setup lang="ts">
import { ref, provide } from 'vue';

interface Props {
  defaultValue?: string;
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: '',
});

const modelValue = ref(props.value || props.defaultValue);

const setValue = (val: string) => {
  modelValue.value = val;
};

const state = {
  value: modelValue,
  setValue,
};

provide('tabs', state);
</script>

<template>
  <div class="w-full">
    <slot />
  </div>
</template>
