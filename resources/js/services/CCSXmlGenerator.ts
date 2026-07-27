export interface ConsumptionConfig {
  mode: 'random-range' | 'fixed' | 'random';
  minConsumption?: number;
  maxConsumption?: number;
  fixedValue?: number;
}

export interface GenerationParams {
  filePrefix: string;
  siteId: string;
  badgeNumber: string;
  meterNumber: string;
  startDate: Date;
  endDate: Date;
  splitMode: 'daily' | 'weekly' | 'monthly' | 'custom';
  customDaysPerFile?: number;
  intervalFrequency: 'hourly' | '30min' | '15min';
  consumptionConfig: ConsumptionConfig;
}

export interface GeneratedFile {
  filename: string;
  content: string;
  startDate: Date;
  endDate: Date;
}

export class CCSXmlGenerator {
  private getReadsPerDay(frequency: string): number {
    switch (frequency) {
      case 'hourly':
        return 24;
      case '30min':
        return 48;
      case '15min':
        return 96;
      default:
        return 24;
    }
  }

  private getIntervalMinutes(frequency: string): number {
    switch (frequency) {
      case 'hourly':
        return 60;
      case '30min':
        return 30;
      case '15min':
        return 15;
      default:
        return 60;
    }
  }

  private generateConsumption(config: ConsumptionConfig): number {
    if (config.mode === 'fixed' && config.fixedValue !== undefined) {
      return config.fixedValue;
    }

    if (config.mode === 'random-range' && config.minConsumption !== undefined && config.maxConsumption !== undefined) {
      return Math.floor(Math.random() * (config.maxConsumption - config.minConsumption + 1)) + config.minConsumption;
    }

    return Math.floor(Math.random() * 501);
  }

  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private generateReadingsForDay(date: Date, frequency: string, consumptionConfig: ConsumptionConfig): string {
    const intervalMinutes = this.getIntervalMinutes(frequency);
    const readingsPerDay = this.getReadsPerDay(frequency);
    const readings: string[] = [];

    for (let i = readingsPerDay - 1; i >= 0; i--) {
      const readingDate = new Date(date);
      readingDate.setHours(0, 0, 0, 0);
      readingDate.setMinutes(readingDate.getMinutes() + i * intervalMinutes);

      const consumption = this.generateConsumption(consumptionConfig);
      const consumptionWithMultiplier = (consumption / 10).toFixed(1);
      const dateTimeStr = this.formatDateTime(readingDate);

      readings.push(`        <consumption_history>
            <reading_date>${dateTimeStr}</reading_date>
            <consumption>${consumption}</consumption>
            <consumption_with_multiplier>${consumptionWithMultiplier}</consumption_with_multiplier>
        </consumption_history>`);
    }

    return readings.join('\n');
  }

  private generateXmlForDateRange(
    dateRange: { start: Date; end: Date },
    params: GenerationParams,
  ): string {
    const readings: string[] = [];
    const currentDate = new Date(dateRange.end);

    // Generate readings in reverse chronological order (end date to start date)
    while (currentDate >= dateRange.start) {
      const dayReadings = this.generateReadingsForDay(currentDate, params.intervalFrequency, params.consumptionConfig);
      readings.push(dayReadings);
      currentDate.setDate(currentDate.getDate() - 1);
    }

    const beginDate = this.formatDate(dateRange.start).replace(/-/g, '-');
    const endDate = this.formatDate(dateRange.end).replace(/-/g, '-');
    const formattedSiteId = params.siteId.padStart(5, '0');

    const xml = `<responseDetails>
    <site_id>${formattedSiteId}</site_id>
    <endpoints>
        <miu_id>${params.badgeNumber}</miu_id>
        <meter_number>${params.meterNumber}</meter_number>
${readings.join('\n')}
    </endpoints>
    <paging>
        <page>1</page>
        <limit>100</limit>
        <total>1</total>
        <next>/api/v1/consumption?site_id=${formattedSiteId}&amp;begin_date=${beginDate}&amp;end_date=${endDate}&amp;actual_consumption=false&amp;page=2</next>
        <self>/api/v1/consumption?site_id=${formattedSiteId}&amp;begin_date=${beginDate}&amp;end_date=${endDate}&amp;actual_consumption=false&amp;page=1</self>
    </paging>
</responseDetails>`;

    return xml;
  }

  private getDateRangesForSplitting(startDate: Date, endDate: Date, params: GenerationParams): Array<{ start: Date; end: Date }> {
    const ranges: Array<{ start: Date; end: Date }> = [];
    let currentStart = new Date(startDate);

    if (params.splitMode === 'daily') {
      while (currentStart <= endDate) {
        const currentEnd = new Date(currentStart);
        ranges.push({ start: new Date(currentStart), end: new Date(currentEnd) });
        currentStart.setDate(currentStart.getDate() + 1);
      }
    } else if (params.splitMode === 'weekly') {
      while (currentStart <= endDate) {
        const currentEnd = new Date(currentStart);
        currentEnd.setDate(currentEnd.getDate() + 6);
        if (currentEnd > endDate) {
          currentEnd.setTime(endDate.getTime());
        }
        ranges.push({ start: new Date(currentStart), end: new Date(currentEnd) });
        currentStart.setDate(currentStart.getDate() + 7);
      }
    } else if (params.splitMode === 'monthly') {
      while (currentStart <= endDate) {
        const currentEnd = new Date(currentStart.getFullYear(), currentStart.getMonth() + 1, 0);
        if (currentEnd > endDate) {
          currentEnd.setTime(endDate.getTime());
        }
        ranges.push({ start: new Date(currentStart), end: new Date(currentEnd) });
        currentStart = new Date(currentEnd);
        currentStart.setDate(currentStart.getDate() + 1);
      }
    } else if (params.splitMode === 'custom' && params.customDaysPerFile) {
      while (currentStart <= endDate) {
        const currentEnd = new Date(currentStart);
        currentEnd.setDate(currentEnd.getDate() + params.customDaysPerFile - 1);
        if (currentEnd > endDate) {
          currentEnd.setTime(endDate.getTime());
        }
        ranges.push({ start: new Date(currentStart), end: new Date(currentEnd) });
        currentStart.setDate(currentEnd.getDate() + 1);
      }
    }

    return ranges;
  }

  generate(params: GenerationParams): GeneratedFile[] {
    const dateRanges = this.getDateRangesForSplitting(params.startDate, params.endDate, params);
    const files: GeneratedFile[] = [];

    dateRanges.forEach((range) => {
      const filename = `${params.filePrefix}_${params.badgeNumber}_${this.formatDate(range.start)}.xml`;
      const content = this.generateXmlForDateRange(range, params);

      files.push({
        filename,
        content,
        startDate: range.start,
        endDate: range.end,
      });
    });

    return files;
  }

  calculateTotalReads(params: GenerationParams, files: GeneratedFile[]): number {
    const readsPerDay = this.getReadsPerDay(params.intervalFrequency);
    let totalReads = 0;

    files.forEach((file) => {
      const start = new Date(file.startDate);
      const end = new Date(file.endDate);
      let dayCount = 0;

      while (start <= end) {
        dayCount++;
        start.setDate(start.getDate() + 1);
      }

      totalReads += dayCount * readsPerDay;
    });

    return totalReads;
  }

  calculateTotalDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;

    while (start <= end) {
      days++;
      start.setDate(start.getDate() + 1);
    }

    return days;
  }
}

export const ccsXmlGenerator = new CCSXmlGenerator();
