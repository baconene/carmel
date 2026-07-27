<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import { Search, Zap } from '@lucide/vue';
import { Input } from '@/components/ui/input';

interface Tool {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  route: string;
  category: string;
}

const searchQuery = ref('');
const tools = ref<Tool[]>([]);
const loading = ref(false);

const filteredTools = computed(() => {
  if (!searchQuery.value) {
    return tools.value;
  }

  const query = searchQuery.value.toLowerCase();
  return tools.value.filter(
    tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description?.toLowerCase().includes(query) ||
      tool.slug.toLowerCase().includes(query)
  );
});

const groupedTools = computed(() => {
  const groups: Record<string, Tool[]> = {};

  filteredTools.value.forEach(tool => {
    if (!groups[tool.category]) {
      groups[tool.category] = [];
    }
    groups[tool.category].push(tool);
  });

  return groups;
});

async function fetchTools() {
  try {
    loading.value = true;
    const response = await fetch('/api/tools');
    if (response.ok) {
      tools.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch tools:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchTools();
});

async function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;

  try {
    const response = await fetch(`/api/tools/search?q=${encodeURIComponent(searchQuery.value)}`);
    if (response.ok) {
      tools.value = await response.json();
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
}
</script>

<template>
  <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <!-- Header -->
    <div class="space-y-2">
      <h2 class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        <Zap class="h-4 w-4 text-blue-600" />
        Tools
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Search and access available tools
      </p>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="text"
        placeholder="Search tools..."
        class="pl-10"
        :value="searchQuery"
        @input="handleSearch"
      />
    </div>

    <!-- Tools List -->
    <div v-if="loading" class="space-y-2 py-4 text-center">
      <p class="text-sm text-slate-500 dark:text-slate-400">Loading tools...</p>
    </div>

    <div v-else-if="Object.keys(groupedTools).length === 0" class="space-y-2 py-4 text-center">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {{ searchQuery ? 'No tools found' : 'No tools available' }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="(categoryTools, category) in groupedTools" :key="category" class="space-y-2">
        <!-- Category Label -->
        <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {{ category }}
        </h3>

        <!-- Tools -->
        <div class="space-y-1">
          <Link
            v-for="tool in categoryTools"
            :key="tool.id"
            :href="tool.route"
            class="flex items-start gap-3 rounded-md px-3 py-2 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <div class="mt-1 flex-shrink-0">
              <Zap v-if="tool.icon === 'Zap'" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div v-else class="h-4 w-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
                {{ tool.name }}
              </p>
              <p v-if="tool.description" class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {{ tool.description }}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>
