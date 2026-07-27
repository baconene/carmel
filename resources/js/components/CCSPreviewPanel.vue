<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { FileCode, Copy, Check } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GeneratedFile } from '@/services/CCSXmlGenerator';

interface Props {
  files: GeneratedFile[];
  selectedIndex: number;
}

interface Emits {
  (e: 'update:selectedIndex', value: number): void;
}

defineProps<Props>();
defineEmits<Emits>();

const selectedFile = computed(() => {
  if (props.selectedIndex >= 0 && props.selectedIndex < props.files.length) {
    return props.files[props.selectedIndex];
  }
  return null;
});

const copied = computed(() => {
  return false;
});

onMounted(() => {
  try {
    // Dynamically load Prism for syntax highlighting
    if (typeof window !== 'undefined' && !!(window as any).Prism) {
      (window as any).Prism.highlightAll();
    }
  } catch (e) {
    // Prism not available, show plain text
  }
});

function copyToClipboard() {
  if (selectedFile.value) {
    navigator.clipboard.writeText(selectedFile.value.content);
  }
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex h-full flex-col gap-4">
    <!-- File List -->
    <div class="space-y-2">
      <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        <FileCode class="h-4 w-4" />
        Generated Files
      </h3>
      <ScrollArea class="h-48 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <div class="space-y-1 p-4">
          <button
            v-for="(file, index) in props.files"
            :key="file.filename"
            @click="$emit('update:selectedIndex', index)"
            :class="[
              'block w-full truncate rounded px-3 py-2 text-left text-sm transition-colors',
              index === props.selectedIndex
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            ]"
            :title="file.filename"
          >
            {{ file.filename }}
          </button>
        </div>
      </ScrollArea>
    </div>

    <!-- XML Preview -->
    <div v-if="selectedFile" class="flex flex-1 flex-col gap-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Preview
        </h3>
        <Button
          @click="copyToClipboard"
          variant="outline"
          size="sm"
          class="h-8 gap-2"
        >
          <Copy v-if="!copied" class="h-4 w-4" />
          <Check v-else class="h-4 w-4 text-green-600" />
          <span class="text-xs">{{ copied ? 'Copied' : 'Copy' }}</span>
        </Button>
      </div>
      <ScrollArea class="flex-1 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <pre class="p-4 text-xs leading-relaxed text-slate-800 dark:text-slate-200"><code v-html="selectedFile.content" /></pre>
      </ScrollArea>
    </div>

    <div v-else class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        No file selected
      </p>
    </div>
  </div>
</template>
