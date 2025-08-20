<template>
  <div class="relative" ref="root">
    <div class="relative">
      <input
        ref="searchInput"
        v-model="query"
        type="search"
        :placeholder="placeholder"
        class="w-full px-4 py-2 border rounded"
        @input="onInput"
        @focus="onFocus"
      />
    </div>

    <div
      v-if="showSuggestions"
      class="absolute z-50 w-full mt-2 bg-white border rounded shadow max-h-64 overflow-auto"
    >
      <ul>
        <li
          v-for="(s, i) in suggestions"
          :key="i"
          class="p-2 hover:bg-slate-50 cursor-pointer"
          @click="select(s)"
        >
          <span v-html="highlightMatch(s.text, query)"></span>
        </li>
        <li v-if="!suggestions.length" class="p-2 text-sm text-slate-500">
          No suggestions
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

interface Suggestion {
  text: string;
}

const props = withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: "Search",
});
const emit = defineEmits(["search", "suggestion"]);

const root = ref<HTMLElement | null>(null);
const query = ref("");
const suggestions = ref<Suggestion[]>([]);
const showSuggestions = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const mock = [
  { text: "Diamond Engagement Rings" },
  { text: "Emerald Gemstones" },
  { text: "Sapphire Necklaces" },
];

const onInput = () => {
  const q = query.value.trim().toLowerCase();
  if (!q) {
    suggestions.value = [];
    return;
  }
  suggestions.value = mock
    .filter((m) => m.text.toLowerCase().includes(q))
    .slice(0, 8);
  showSuggestions.value = true;
};

const onFocus = () => {
  showSuggestions.value = true;
};

const select = (s: Suggestion) => {
  query.value = s.text;
  showSuggestions.value = false;
  (emit as any)("suggestion", s);
  (emit as any)("search", s.text);
};

const highlightMatch = (text: string, searchQuery: string): string => {
  if (!searchQuery) return text;
  const esc = searchQuery.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
  const re = new RegExp(`(${esc})`, "gi");
  return text.replace(re, '<mark class="bg-yellow-200 px-0.5">$1</mark>');
};

const onDocumentClick = (e: MouseEvent) => {
  if (!root.value) return;
  if (!(e.target instanceof Node)) return;
  if (!root.value.contains(e.target)) showSuggestions.value = false;
};

onMounted(() => document.addEventListener("click", onDocumentClick));
onUnmounted(() => document.removeEventListener("click", onDocumentClick));

watch(query, () => {
  if (!query.value) showSuggestions.value = false;
});
</script>

<style scoped>
.bg-yellow-200 {
  background-color: #fef3c7;
}
mark {
  padding: 0 0.125rem;
  border-radius: 0.125rem;
}
</style>
