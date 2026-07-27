<script setup lang="ts">
import { AlertCircle } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { useGeneratorState } from '@/composables/useGeneratorState';

type GeneratorState = ReturnType<typeof useGeneratorState>;

defineProps<{
  state: GeneratorState;
}>();
</script>

<template>
  <div class="space-y-6">
    <!-- Error Display -->
    <div v-if="state.errorMessage.value" class="space-y-2">
      <Alert class="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
        <AlertCircle class="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription class="text-red-800 dark:text-red-300">
          {{ state.errorMessage.value }}
        </AlertDescription>
      </Alert>
    </div>

    <!-- File Prefix -->
    <div class="space-y-2">
      <Label for="filePrefix" class="text-sm font-semibold">File Prefix</Label>
      <Input
        id="filePrefix"
        :model-value="state.filePrefix.value"
        @update:model-value="state.filePrefix.value = $event"
        type="text"
        placeholder="e.g., TEST, DEV, INTERVAL"
        class="text-base"
      />
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Prepended to every generated filename
      </p>
    </div>

    <!-- Site ID -->
    <div class="space-y-2">
      <Label for="siteId" class="text-sm font-semibold">Site ID</Label>
      <Input
        id="siteId"
        :model-value="state.siteId.value"
        @update:model-value="state.siteId.value = $event"
        type="text"
        placeholder="05096"
        class="text-base"
      />
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Site identifier for API endpoints
      </p>
    </div>

    <!-- Badge Number & Meter Number -->
    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label for="badgeNumber" class="text-sm font-semibold">Badge Number (MIU ID)</Label>
        <Input
          id="badgeNumber"
          :model-value="state.badgeNumber.value"
          @update:model-value="state.badgeNumber.value = $event"
          type="text"
          placeholder="1563076506"
          class="text-base"
        />
      </div>
      <div class="space-y-2">
        <Label for="meterNumber" class="text-sm font-semibold">Meter Number</Label>
        <Input
          id="meterNumber"
          :model-value="state.meterNumber.value"
          @update:model-value="state.meterNumber.value = $event"
          type="text"
          placeholder="54573186"
          class="text-base"
        />
      </div>
    </div>

    <!-- Date Range -->
    <div class="space-y-3">
      <Label class="text-sm font-semibold">Date Range</Label>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="startDate" class="text-xs font-normal text-slate-600 dark:text-slate-400"
            >Start Date</Label
          >
          <Input
            id="startDate"
            :model-value="state.startDate.value"
            @update:model-value="state.startDate.value = $event"
            type="date"
            class="text-base"
            placeholder="2026-07-01"
          />
        </div>
        <div class="space-y-2">
          <Label for="endDate" class="text-xs font-normal text-slate-600 dark:text-slate-400"
            >End Date</Label
          >
          <Input
            id="endDate"
            :model-value="state.endDate.value"
            @update:model-value="state.endDate.value = $event"
            type="date"
            class="text-base"
            placeholder="2026-07-31"
          />
        </div>
      </div>
    </div>

    <!-- XML File Splitting -->
    <div class="space-y-3">
      <Label for="splitMode" class="text-sm font-semibold">XML File Splitting</Label>
      <Select :model-value="state.splitMode.value" @update:model-value="state.splitMode.value = $event">
        <SelectTrigger id="splitMode">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">One XML per Day</SelectItem>
          <SelectItem value="weekly">One XML per Week</SelectItem>
          <SelectItem value="monthly">One XML per Month</SelectItem>
          <SelectItem value="custom">Custom Number of Days</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Custom Days Per File -->
    <div v-if="state.splitMode.value === 'custom'" class="space-y-2 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
      <Label for="customDaysPerFile" class="text-sm font-semibold">Days per File</Label>
      <Input
        id="customDaysPerFile"
        :model-value="state.customDaysPerFile.value"
        @update:model-value="state.customDaysPerFile.value = Number($event)"
        type="number"
        min="1"
        placeholder="2"
        class="text-base"
      />
    </div>

    <!-- Interval Configuration -->
    <div class="space-y-3">
      <Label for="intervalFrequency" class="text-sm font-semibold">Interval Frequency</Label>
      <Select :model-value="state.intervalFrequency.value" @update:model-value="state.intervalFrequency.value = $event">
        <SelectTrigger id="intervalFrequency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hourly">Every Hour (24 reads/day)</SelectItem>
          <SelectItem value="30min">Every 30 Minutes (48 reads/day)</SelectItem>
          <SelectItem value="15min">Every 15 Minutes (96 reads/day)</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Consumption Generation Mode -->
    <div class="space-y-3">
      <Label for="consumptionMode" class="text-sm font-semibold">Consumption Generation</Label>
      <Select :model-value="state.consumptionMode.value" @update:model-value="state.consumptionMode.value = $event">
        <SelectTrigger id="consumptionMode">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="random-range">Random Range (Recommended)</SelectItem>
          <SelectItem value="fixed">Fixed Consumption</SelectItem>
          <SelectItem value="random">Completely Random</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Consumption Parameters -->
    <div v-if="state.consumptionMode.value === 'random-range'" class="space-y-3">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="minConsumption">Minimum Consumption</Label>
          <Input
            id="minConsumption"
            :model-value="state.minConsumption.value"
            @update:model-value="state.minConsumption.value = Number($event)"
            type="number"
            min="0"
            placeholder="0"
            class="text-base"
          />
        </div>
        <div class="space-y-2">
          <Label for="maxConsumption">Maximum Consumption</Label>
          <Input
            id="maxConsumption"
            :model-value="state.maxConsumption.value"
            @update:model-value="state.maxConsumption.value = Number($event)"
            type="number"
            min="0"
            placeholder="500"
            class="text-base"
          />
        </div>
      </div>
    </div>

    <div v-if="state.consumptionMode.value === 'fixed'" class="space-y-2">
      <Label for="fixedValue">Fixed Consumption Value</Label>
      <Input
        id="fixedValue"
        :model-value="state.fixedValue.value"
        @update:model-value="state.fixedValue.value = Number($event)"
        type="number"
        min="0"
        placeholder="100"
        class="text-base"
      />
    </div>

    <!-- Generate Button -->
    <Button
      :disabled="!state.isValid || state.isGenerating.value"
      @click="state.generateFiles()"
      class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
      size="lg"
    >
      <template v-if="state.isGenerating.value">
        <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        Generating...
      </template>
      <template v-else>
        Generate XML Files
      </template>
    </Button>

    <!-- Validation Errors Display -->
    <div v-if="state.errors.value.length > 0 && state.errorMessage.value === ''" class="space-y-2">
      <Alert class="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20">
        <AlertCircle class="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription class="text-amber-800 dark:text-amber-300">
          <ul class="list-inside list-disc space-y-1">
            <li v-for="error in state.errors.value" :key="error">{{ error }}</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  </div>
</template>
