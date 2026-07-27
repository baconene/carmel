import { ref, computed } from 'vue';
import type { GeneratedFile, GenerationParams, ConsumptionConfig } from '@/services/CCSXmlGenerator';
import { ccsXmlGenerator } from '@/services/CCSXmlGenerator';

export function useGeneratorState() {
  const filePrefix = ref<string>('');
  const badgeNumber = ref<string>('');
  const meterNumber = ref<string>('');
  const startDate = ref<string>('');
  const endDate = ref<string>('');
  const splitMode = ref<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const customDaysPerFile = ref<number>(2);
  const intervalFrequency = ref<'hourly' | '30min' | '15min'>('hourly');
  const consumptionMode = ref<'random-range' | 'fixed' | 'random'>('random-range');
  const minConsumption = ref<number>(0);
  const maxConsumption = ref<number>(500);
  const fixedValue = ref<number>(100);
  const isGenerating = ref(false);
  const generatedFiles = ref<GeneratedFile[]>([]);
  const selectedFileIndex = ref(0);
  const errorMessage = ref('');

  const selectedFile = computed(() => {
    if (selectedFileIndex.value >= 0 && selectedFileIndex.value < generatedFiles.value.length) {
      return generatedFiles.value[selectedFileIndex.value];
    }
    return null;
  });

  const totalDays = computed(() => {
    if (!startDate.value || !endDate.value) return 0;
    return ccsXmlGenerator.calculateTotalDays(new Date(startDate.value), new Date(endDate.value));
  });

  const totalReads = computed(() => {
    if (generatedFiles.value.length === 0) return 0;
    return ccsXmlGenerator.calculateTotalReads(getGenerationParams(), generatedFiles.value);
  });

  const consumptionRange = computed(() => {
    if (consumptionMode.value === 'fixed') {
      return `${fixedValue.value}`;
    }
    if (consumptionMode.value === 'random') {
      return '0 - 500';
    }
    return `${minConsumption.value} - ${maxConsumption.value}`;
  });

  const errors = computed(() => {
    const errs: string[] = [];

    if (!filePrefix.value.trim()) errs.push('File Prefix is required');
    if (!badgeNumber.value.trim()) errs.push('Badge Number is required');
    if (!meterNumber.value.trim()) errs.push('Meter Number is required');
    if (!startDate.value) errs.push('Start Date is required');
    if (!endDate.value) errs.push('End Date is required');

    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      if (end < start) {
        errs.push('End Date cannot be earlier than Start Date');
      }
    }

    if (splitMode.value === 'custom') {
      if (customDaysPerFile.value <= 0) {
        errs.push('Custom Days must be greater than zero');
      }
    }

    if (consumptionMode.value === 'random-range') {
      if (minConsumption.value < 0 || maxConsumption.value < 0) {
        errs.push('Consumption values cannot be negative');
      }
      if (minConsumption.value > maxConsumption.value) {
        errs.push('Minimum Consumption cannot exceed Maximum Consumption');
      }
    }

    if (consumptionMode.value === 'fixed') {
      if (fixedValue.value < 0) {
        errs.push('Fixed consumption value cannot be negative');
      }
    }

    return errs;
  });

  const isValid = computed(() => errors.value.length === 0);

  function getGenerationParams(): GenerationParams {
    return {
      filePrefix: filePrefix.value,
      badgeNumber: badgeNumber.value,
      meterNumber: meterNumber.value,
      startDate: new Date(startDate.value),
      endDate: new Date(endDate.value),
      splitMode: splitMode.value,
      customDaysPerFile: customDaysPerFile.value,
      intervalFrequency: intervalFrequency.value,
      consumptionConfig: {
        mode: consumptionMode.value,
        minConsumption: minConsumption.value,
        maxConsumption: maxConsumption.value,
        fixedValue: fixedValue.value,
      } as ConsumptionConfig,
    };
  }

  async function generateFiles(): Promise<void> {
    if (!isValid.value) {
      errorMessage.value = errors.value[0];
      return;
    }

    isGenerating.value = true;
    errorMessage.value = '';

    try {
      const params = getGenerationParams();
      generatedFiles.value = ccsXmlGenerator.generate(params);
      selectedFileIndex.value = 0;
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Failed to generate files';
      generatedFiles.value = [];
    } finally {
      isGenerating.value = false;
    }
  }

  function reset(): void {
    filePrefix.value = '';
    badgeNumber.value = '';
    meterNumber.value = '';
    startDate.value = '';
    endDate.value = '';
    splitMode.value = 'daily';
    customDaysPerFile.value = 2;
    intervalFrequency.value = 'hourly';
    consumptionMode.value = 'random-range';
    minConsumption.value = 0;
    maxConsumption.value = 500;
    fixedValue.value = 100;
    generatedFiles.value = [];
    selectedFileIndex.value = 0;
    errorMessage.value = '';
  }

  return {
    filePrefix,
    badgeNumber,
    meterNumber,
    startDate,
    endDate,
    splitMode,
    customDaysPerFile,
    intervalFrequency,
    consumptionMode,
    minConsumption,
    maxConsumption,
    fixedValue,
    isGenerating,
    generatedFiles,
    selectedFileIndex,
    selectedFile,
    errorMessage,
    totalDays,
    totalReads,
    consumptionRange,
    errors,
    isValid,
    generateFiles,
    reset,
  };
}
