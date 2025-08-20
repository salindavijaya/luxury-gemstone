<script setup lang="ts">
import { withDefaults } from "vue";
import InnerViewToggle from "./product/ViewToggle.vue";

interface Props {
  view?: "grid" | "list";
}

const props = withDefaults(defineProps<Props>(), { view: "grid" });
</script>

<template>
  <InnerViewToggle :view="props.view" @change="$emit('change', $event)" />
</template>
