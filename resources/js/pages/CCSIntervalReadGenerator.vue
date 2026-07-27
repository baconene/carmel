<script setup lang="ts">
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import { RefreshCw, Zap } from '@lucide/vue';
import AppHeader from '@/components/AppHeader.vue';
import AppShell from '@/components/AppShell.vue';
import AppContent from '@/components/AppContent.vue';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CCSGeneratorForm from '@/components/CCSGeneratorForm.vue';
import CCSPreviewPanel from '@/components/CCSPreviewPanel.vue';
import CCSGeneratorSummary from '@/components/CCSGeneratorSummary.vue';
import { useGeneratorState } from '@/composables/useGeneratorState';

const state = useGeneratorState();

const showPreview = computed(() => state.generatedFiles.value.length > 0);
</script>

<template>
  <Head title="CCS Interval Read XML Generator" />

  <AppShell>
    <AppHeader />
    <AppContent>
      <div class="space-y-6">
        <!-- Page Header -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h1 class="flex items-center gap-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                <Zap class="h-8 w-8 text-blue-600 dark:text-blue-400" />
                CCS Interval Read XML Generator
              </h1>
              <p class="text-slate-600 dark:text-slate-400">
                Enterprise QA Tool for generating realistic meter payload testing
              </p>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div v-if="!showPreview" class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <CCSGeneratorForm :state="state" />
        </div>

        <!-- Preview & Summary Layout -->
        <div v-else class="space-y-6">
          <!-- Tabs for Preview and Summary -->
          <Tabs defaultValue="preview" class="w-full">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="preview">
                Preview
                <span class="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-900 dark:bg-blue-900/40 dark:text-blue-200">
                  {{ state.generatedFiles.value.length }}
                </span>
              </TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="edit">Edit Parameters</TabsTrigger>
            </TabsList>

            <!-- Preview Tab -->
            <TabsContent value="preview" class="h-screen max-h-[600px] space-y-4">
              <CCSPreviewPanel
                :files="state.generatedFiles.value"
                :selected-index="state.selectedFileIndex.value"
                @update:selectedIndex="(idx) => (state.selectedFileIndex.value = idx)"
              />
            </TabsContent>

            <!-- Summary Tab -->
            <TabsContent value="summary" class="space-y-4">
              <CCSGeneratorSummary
                :files="state.generatedFiles.value"
                :total-days="state.totalDays.value"
                :total-reads="state.totalReads.value"
                :interval-frequency="state.intervalFrequency.value"
                :consumption-mode="state.consumptionMode.value"
                :consumption-range="state.consumptionRange.value"
                :badge-number="state.badgeNumber.value"
                :meter-number="state.meterNumber.value"
                :file-prefix="state.filePrefix.value"
              />
            </TabsContent>

            <!-- Edit Tab -->
            <TabsContent value="edit" class="space-y-4">
              <div class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <CCSGeneratorForm :state="state" />
              </div>
            </TabsContent>
          </Tabs>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <Button
              @click="state.reset()"
              variant="outline"
              class="gap-2"
              size="lg"
            >
              <RefreshCw class="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </AppContent>
  </AppShell>
</template>
