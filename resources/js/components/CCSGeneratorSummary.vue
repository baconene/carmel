<script setup lang="ts">
import { Download, Archive } from '@lucide/vue';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import type { GeneratedFile } from '@/services/CCSXmlGenerator';

interface Props {
  files: GeneratedFile[];
  totalDays: number;
  totalReads: number;
  intervalFrequency: string;
  consumptionMode: string;
  consumptionRange: string;
  badgeNumber: string;
  meterNumber: string;
  filePrefix: string;
}

defineProps<Props>();

const frequencyLabels: Record<string, string> = {
  hourly: 'Hourly',
  '30min': 'Every 30 Minutes',
  '15min': 'Every 15 Minutes',
};

const modeLabels: Record<string, string> = {
  'random-range': 'Random Range',
  fixed: 'Fixed Consumption',
  random: 'Completely Random',
};

async function downloadSingleFile(file: GeneratedFile) {
  const blob = new Blob([file.content], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadAsZip(files: GeneratedFile[], prefix: string) {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.filename, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${prefix}_INTERVAL_FILES.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
        <p class="text-xs font-medium text-slate-600 dark:text-slate-400">Total Days</p>
        <p class="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">{{ totalDays }}</p>
      </div>

      <div class="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
        <p class="text-xs font-medium text-slate-600 dark:text-slate-400">XML Files</p>
        <p class="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">{{ files.length }}</p>
      </div>

      <div class="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
        <p class="text-xs font-medium text-slate-600 dark:text-slate-400">Total Reads</p>
        <p class="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">{{ totalReads }}</p>
      </div>

      <div class="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
        <p class="text-xs font-medium text-slate-600 dark:text-slate-400">Interval</p>
        <p class="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">{{ frequencyLabels[intervalFrequency] }}</p>
      </div>
    </div>

    <!-- Configuration Details -->
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
      <h3 class="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        Configuration Details
      </h3>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-sm text-slate-600 dark:text-slate-400">Consumption Mode</span>
          <span class="font-medium text-slate-900 dark:text-slate-100">{{ modeLabels[consumptionMode] }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-slate-600 dark:text-slate-400">Consumption Range</span>
          <span class="font-medium text-slate-900 dark:text-slate-100">{{ consumptionRange }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-slate-600 dark:text-slate-400">Badge Number</span>
          <span class="font-medium text-slate-900 dark:text-slate-100">{{ badgeNumber }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-slate-600 dark:text-slate-400">Meter Number</span>
          <span class="font-medium text-slate-900 dark:text-slate-100">{{ meterNumber }}</span>
        </div>
      </div>
    </div>

    <!-- Download Buttons -->
    <div v-if="files.length > 0" class="space-y-3">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Download</h3>
      <div v-if="files.length === 1" class="space-y-2">
        <Button
          @click="downloadSingleFile(files[0])"
          class="w-full gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          size="lg"
        >
          <Download class="h-4 w-4" />
          Download XML
        </Button>
      </div>
      <div v-else class="space-y-2">
        <Button
          @click="downloadAsZip(files, filePrefix)"
          class="w-full gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          size="lg"
        >
          <Archive class="h-4 w-4" />
          Download as ZIP ({{ files.length }} files)
        </Button>
        <details class="group rounded-lg border border-slate-200 dark:border-slate-700">
          <summary class="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
            Or download individual files
          </summary>
          <div class="space-y-2 border-t border-slate-200 p-4 dark:border-slate-700">
            <Button
              v-for="file in files"
              :key="file.filename"
              @click="downloadSingleFile(file)"
              variant="outline"
              class="w-full text-left"
              size="sm"
            >
              <Download class="mr-2 h-3 w-3" />
              {{ file.filename }}
            </Button>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>
