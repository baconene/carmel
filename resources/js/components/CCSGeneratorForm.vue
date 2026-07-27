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
    <div v-if="state.errorMessage" class="space-y-2">
      <Alert class="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
        <AlertCircle class="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription class="text-red-800 dark:text-red-300">
          {{ state.errorMessage }}
        </AlertDescription>
      </Alert>
    </div>

    <!-- File Prefix -->
    <div class="space-y-2">
      <Label for="filePrefix">File Prefix</Label>
      <Input
        id="filePrefix"
        v-model="state.filePrefix"
        type="text"
        placeholder="e.g., TEST, DEV, INTERVAL"
        class="text-base"
      />
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Prepended to every generated filename
      </p>
    </div>

    <!-- Badge Number & Meter Number -->
    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label for="badgeNumber">Badge Number (MIU ID)</Label>
        <Input
          id="badgeNumber"
          v-model="state.badgeNumber"
          type="text"
          placeholder="1563076506"
          class="text-base"
        />
      </div>
      <div class="space-y-2">
        <Label for="meterNumber">Meter Number</Label>
        <Input
          id="meterNumber"
          v-model="state.meterNumber"
          type="text"
          placeholder="54573186"
          class="text-base"
        />
      </div>
    </div>

    <!-- Date Range -->
    <div class="space-y-3">
      <Label>Date Range</Label>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="startDate" class="text-xs font-normal text-slate-600 dark:text-slate-400"
            >Start Date</Label
          >
          <Input
            id="startDate"
            v-model="state.startDate"
            type="date"
            class="text-base"
          />
        </div>
        <div class="space-y-2">
          <Label for="endDate" class="text-xs font-normal text-slate-600 dark:text-slate-400"
            >End Date</Label
          >
          <Input
            id="endDate"
            v-model="state.endDate"
            type="date"
            class="text-base"
          />
        </div>
      </div>
    </div>

    <!-- XML File Splitting -->
    <div class="space-y-3">
      <Label for="splitMode">XML File Splitting</Label>
      <Select v-model="state.splitMode">
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
    <div v-if="state.splitMode === 'custom'" class="space-y-2">
      <Label for="customDaysPerFile">Days per File</Label>
      <Input
        id="customDaysPerFile"
        v-model.number="state.customDaysPerFile"
        type="number"
        min="1"
        placeholder="2"
        class="text-base"
      />
    </div>

    <!-- Interval Configuration -->
    <div class="space-y-3">
      <Label for="intervalFrequency">Interval Frequency</Label>
      <Select v-model="state.intervalFrequency">
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
      <Label for="consumptionMode">Consumption Generation</Label>
      <Select v-model="state.consumptionMode">
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
    <div v-if="state.consumptionMode === 'random-range'" class="grid gap-4 md:grid-cols-2 space-y-3 md:space-y-0">
      <div class="space-y-2">
        <Label for="minConsumption">Minimum Consumption</Label>
        <Input
          id="minConsumption"
          v-model.number="state.minConsumption"
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
          v-model.number="state.maxConsumption"
          type="number"
          min="0"
          placeholder="500"
          class="text-base"
        />
      </div>
    </div>

    <div v-if="state.consumptionMode === 'fixed'" class="space-y-2">
      <Label for="fixedValue">Fixed Consumption Value</Label>
      <Input
        id="fixedValue"
        v-model.number="state.fixedValue"
        type="number"
        min="0"
        placeholder="100"
        class="text-base"
      />
    </div>

    <!-- Generate Button -->
    <Button
      :disabled="!state.isValid || state.isGenerating"
      @click="state.generateFiles()"
      class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
      size="lg"
    >
      <template v-if="state.isGenerating">
        <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        Generating...
      </template>
      <template v-else>
        Generate XML Files
      </template>
    </Button>

    <!-- Validation Errors Display -->
    <div v-if="state.errors.length > 0 && state.errorMessage === ''" class="space-y-2">
      <Alert class="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20">
        <AlertCircle class="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription class="text-amber-800 dark:text-amber-300">
          <ul class="list-inside list-disc space-y-1">
            <li v-for="error in state.errors" :key="error">{{ error }}</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  </div>
</template>
